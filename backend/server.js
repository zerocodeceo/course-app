require('dotenv').config()
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const cors = require('cors')
const mongoose = require('mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('./models/User')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const CourseContent = require('./models/CourseContent')
const UserProgress = require('./models/UserProgress')
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

const app = express()
app.set('trust proxy', 1)

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// Middleware
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    if (!endpointSecret) {
      return res.status(400).send('Webhook secret not configured')
    }

    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        
        try {
          const userId = session.metadata.userId
          if (!userId) {
            return res.status(400).send('No userId in session metadata')
          }

          const user = await User.findById(userId)
          if (!user) {
            return res.status(404).send('User not found')
          }

          user.plan = 'premium'
          user.purchaseDate = new Date()
          await user.save()
        } catch (error) {
          return res.status(500).send('Error updating user')
        }
        break
    }

    res.json({ received: true })
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
})

// 1. CORS first
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://zerocodeceo.com',
      'https://www.zerocodeceo.com',
      'http://localhost:3000'
    ];
    
    // Allow requests with no origin (like mobile apps)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error('Not allowed by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
  exposedHeaders: ['Set-Cookie']
}))

// 2. Body parsing middleware
app.use(express.json())

// 3. Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60,
    autoRemove: 'native'
  }),
  name: 'sid',
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.zerocodeceo.com' : undefined
  }
}))

// 4. Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

// 5. Headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cookie, Set-Cookie')
  next()
})

// Passport configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://zerocodeceo.onrender.com/auth/google/callback",
    proxy: true
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      console.log('Google Strategy - Processing profile:', profile.id)
      let user = await User.findOne({ googleId: profile.id })
      
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0].value,
          plan: 'basic'
        })
      }
      
      return cb(null, user)
    } catch (error) {
      console.error('Google Strategy error:', error)
      return cb(error, null)
    }
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

app.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: true
  }),
  async function(req, res) {
    try {
      console.log('Google callback - user:', req.user?._id)
      
      if (!req.user) {
        console.error('No user in callback')
        return res.redirect(`${process.env.CLIENT_URL}/login`)
      }

      await User.findByIdAndUpdate(req.user._id, {
        lastLogin: new Date()
      })

      // Explicitly save session before redirect
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err)
          return res.redirect(`${process.env.CLIENT_URL}/login`)
        }
        res.redirect(process.env.CLIENT_URL)
      })
    } catch (error) {
      console.error('Callback error:', error)
      res.redirect(`${process.env.CLIENT_URL}/login`)
    }
  }
)

app.get('/auth/status', async (req, res) => {
  console.log('Auth Status Check:');
  console.log('Session ID:', req.sessionID);
  console.log('Session:', {
    ...req.session,
    cookie: req.session?.cookie?.toJSON()
  });
  console.log('User:', req.user?._id);
  console.log('Headers:', req.headers);
  console.log('Is Authenticated:', req.isAuthenticated());

  if (req.isAuthenticated()) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        lastLogin: new Date()
      });
    } catch (error) {
      console.error('Error updating lastLogin:', error);
    }
  }

  res.json({
    user: req.isAuthenticated() ? req.user : null,
    sessionId: req.sessionID,
    sessionExists: !!req.session,
    hasUser: !!req.user,
    isAuthenticated: req.isAuthenticated()
  });
})

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' })
    }
    res.redirect(process.env.CLIENT_URL)
  })
})

app.post('/create-checkout-session', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Plan',
              description: 'Learn to build a web app from scratch using AI...',
            },
            unit_amount: 2999,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user._id.toString()
      }
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    res.status(500).json({ error: 'Error creating checkout session' })
  }
})

app.post('/verify-payment', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const { session_id } = req.body
  if (!session_id) {
    return res.status(400).json({ error: 'No session ID provided' })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)
    console.log('Payment session:', session)

    if (session.payment_status === 'paid' && session.metadata.userId === req.user._id.toString()) {
      const user = await User.findById(req.user._id)
      if (user) {
        user.plan = 'premium'
        user.purchaseDate = new Date()
        await user.save()
        return res.json({ success: true })
      }
    }

    throw new Error('Invalid payment session')
  } catch (error) {
    console.error('Payment verification error:', error)
    res.status(400).json({ error: 'Payment verification failed' })
  }
})

app.get('/user-stats', async (req, res) => {
  try {
    const totalPremiumUsers = await User.countDocuments({ plan: 'premium' })
    const recentPremiumUsers = await User.find({ plan: 'premium' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('profilePicture displayName -_id')

    res.json({
      totalPremiumUsers,
      recentPremiumUsers
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    res.status(500).json({ error: 'Error fetching user stats' })
  }
})

app.get('/dashboard-stats', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Get all premium users with locations
    const premiumUsers = await User.find({ 
      plan: 'premium',
      'location.coordinates': { $exists: true } 
    })

    // Group users by location (with small precision to create clusters)
    const locationGroups = premiumUsers.reduce((groups, user) => {
      if (!user.location?.coordinates) return groups

      // Round coordinates to 1 decimal place to group nearby users
      const lat = Math.round(user.location.coordinates.latitude * 10) / 10
      const lng = Math.round(user.location.coordinates.longitude * 10) / 10
      const key = `${lat},${lng}`

      if (!groups[key]) {
        groups[key] = {
          lat,
          lng,
          count: 0
        }
      }
      groups[key].count++
      return groups
    }, {})

    // Convert groups to array and adjust marker size based on count
    const visitorLocations = Object.values(locationGroups).map(({ lat, lng, count }) => ({
      lat,
      lng,
      size: Math.min(Math.max(4, Math.log2(count) * 3), 12) // Size between 4-12px based on count
    }))

    // Create growth data based on actual purchase dates
    const months = Array.from({ length: 12 }, (_, i) => {
      return new Date(2024, i, 1).toLocaleString('en-US', { month: 'short' })
    })
    const now = new Date()
    const currentMonth = now.getMonth()
    
    const subscribersByMonth = new Array(currentMonth + 1).fill(0)
    premiumUsers.forEach(user => {
      const purchaseMonth = new Date(user.purchaseDate).getMonth()
      if (purchaseMonth <= currentMonth) {
        subscribersByMonth[purchaseMonth]++
      }
    })

    // Calculate cumulative growth
    let cumulative = 0
    const cumulativeGrowth = subscribersByMonth.map(count => {
      cumulative += count
      return cumulative
    })

    const subscriberGrowth = {
      labels: months.slice(0, currentMonth + 1),
      data: cumulativeGrowth
    }

    res.json({
      totalMembers: premiumUsers.length,
      totalRevenue: premiumUsers.length * 29.99,
      totalVisitors: await User.countDocuments(),
      memberGrowth: subscriberGrowth,
      visitorLocations
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({ error: 'Error fetching dashboard stats' })
  }
})

app.get('/course-content', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    let content = await CourseContent.find().sort('order')
    
    if (!content.length) {
      // Initialize with default content if none exists
      content = await CourseContent.insertMany([
        {
          id: '1',
          title: '1. INTRO (TO BE CHANGED)',
          description: 'Learn how to set up a Next.js project with TypeScript, Tailwind CSS, and shadcn/ui components.',
          videoUrl: 'https://www.youtube.com/embed/your-video-id',
          order: 1
        },
        {
          id: '2',
          title: '2. Setting Up Your Development Environment',
          description: 'Build a professional landing page with animations, responsive design, and modern UI components.',
          videoUrl: 'https://www.youtube.com/embed/your-video-id',
          order: 2
        },
        {
          id: '3',
          title: '3. Enabling Google Login for Your Web App',
          description: 'Learn how to set up Google login for your web app step by step. This video will guide you through obtaining the necessary credentials from the Google Cloud Console and configuring your site to allow users to sign in with their Google accounts, enhancing security and user experience.',
          videoUrl: 'https://www.youtube.com/embed/ZXckMQe8xMQ',
          order: 3
        },
        {
          id: '4',
          title: '4. Installing MongoDB & Saving Google Login Users',
          description: 'In this video, you will learn how to install MongoDB and set it up for your project. Follow along as we save the first pieces of data—users who log in using Google. This foundational step will prepare your database for managing user information efficiently.',
          videoUrl: 'https://www.youtube.com/embed/aW1kv-vhkNo',
          order: 4
        },
        {
          id: '5',
          title: '5. Integrating Stripe Payments: From Test Mode to Live Transactions',
          description: 'Discover how to integrate Stripe as your payment gateway, starting from test mode and progressing to live transactions with a real credit card. This video covers the entire process, including setting up Stripe, testing payments, and going live, so you can confidently handle payments in your web app.',
          videoUrl: 'https://www.youtube.com/embed/ALXuYuj4kEA',
          order: 5
        },
        {
          id: '6',
          title: '6. Building the Dashboard with the Course Videos and Statistics',
          description: 'Learn how to create a dynamic course dashboard that organizes your videos and displays key user statistics! This video walks you through designing and coding the interface, making it easy for users to access content and track their progress.',
          videoUrl: 'https://www.youtube.com/embed/yuR5oJxgvpI',
          order: 6
        },
        {
          id: '7',
          title: '7. Setting Up Admin Controls & Restricting Content for Paid Users',
          description: 'In this video, you will learn how to create an admin account and implement restrictions to ensure that only paid users can access premium content. We’ll cover user roles, permissions, and securing your content behind the paywall for a seamless experience.',
          videoUrl: 'https://www.youtube.com/embed/wavULz_TSlk',
          order: 7
        },
        {
          id: '8',
          title: '8. Analytics & Tracking',
          description: 'Add user analytics, track visitor locations, and create growth metrics.',
          videoUrl: 'https://www.youtube.com/embed/your-video-id',
          order: 8
        },
        {
          id: '9',
          title: '9. API Development',
          description: 'Build robust API endpoints with Express.js and implement proper authentication.',
          videoUrl: 'https://www.youtube.com/embed/your-video-id',
          order: 9
        },
        {
          id: '10',
          title: '10. Deployment & Optimization',
          description: 'Learn how to deploy your application and implement production best practices.',
          videoUrl: 'https://www.youtube.com/embed/your-video-id',
          order: 10
        },
        {
          id: '11',
          title: '11. Handling Errors & Logging',
          description: 'Learn how to implement proper error handling and logging in your application. We\'ll cover error boundaries in React, backend error middleware, and setting up logging systems to track and debug issues in production.',
          videoUrl: 'https://www.youtube.com/embed/your-video-id',
          order: 11
        },
        {
          id: '12',
          title: '12. Testing Your Application',
          description: 'Discover how to write and implement tests for your application. We\'ll cover unit testing with Jest, integration testing with React Testing Library, and end-to-end testing with Cypress to ensure your application works reliably.',
          videoUrl: 'https://www.youtube.com/embed/your-video-id',
          order: 12
        },
        {
          id: '13',
          title: '13. Advanced Features & Future Updates',
          description: 'Explore advanced features and upcoming updates for your application. Learn about implementing real-time features, WebSocket integration, and other advanced topics that will take your app to the next level.',
          videoUrl: 'https://www.youtube.com/embed/your-video-id',
          order: 13
        }
      ])
    }

    res.json(content)
  } catch (error) {
    console.error('Error fetching course content:', error)
    res.status(500).json([])
  }
})

app.put('/update-content/:id', async (req, res) => {
  if (!req.user || req.user.email !== 'bbertapeli@gmail.com') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { id } = req.params
  const { videoUrl, description } = req.body

  try {
    const content = await CourseContent.findOneAndUpdate(
      { id },
      { 
        $set: { 
          videoUrl, 
          description,
          updatedAt: new Date()
        } 
      },
      { new: true }
    )

    if (!content) {
      return res.status(404).json({ error: 'Content not found' })
    }

    res.json({ success: true, content })
  } catch (error) {
    console.error('Error updating content:', error)
    res.status(500).json({ error: 'Error updating content' })
  }
})

app.post('/update-progress', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { videoId, duration, watchedDuration, completed } = req.body

  try {
    const progress = await UserProgress.findOneAndUpdate(
      { 
        userId: req.user._id, 
        videoId 
      },
      { 
        $set: { 
          duration,
          watchedDuration,
          completed,
          lastWatched: new Date()
        } 
      },
      { upsert: true, new: true }
    )

    res.json({ success: true, progress })
  } catch (error) {
    console.error('Error updating progress:', error)
    res.status(500).json({ error: 'Error updating progress' })
  }
})

app.get('/user-progress', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const progress = await UserProgress.find({ userId: req.user._id })
    
    const durations = {}
    const watchedDurations = {}
    const completed = {}
    let totalWatchedDuration = 0

    progress.forEach(p => {
      durations[p.videoId] = p.duration || 0
      watchedDurations[p.videoId] = p.watchedDuration || 0
      completed[p.videoId] = p.completed || false
      totalWatchedDuration += p.watchedDuration || 0
    })

    const totalDuration = Object.values(durations).reduce((acc, curr) => acc + curr, 0)

    res.json({
      totalDuration,
      watchedDuration: totalWatchedDuration,
      durations,
      watchedDurations,
      completed
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    res.status(500).json({ error: 'Error fetching progress' })
  }
})

app.post('/admin/add-videos', async (req, res) => {
  if (!req.user || req.user.email !== 'bbertapeli@gmail.com') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const newVideos = await CourseContent.insertMany([
      {
        id: '11',
        title: '11. Handling Errors & Logging',
        description: 'Learn how to implement proper error handling and logging in your application. We\'ll cover error boundaries in React, backend error middleware, and setting up logging systems to track and debug issues in production.',
        videoUrl: 'https://www.youtube.com/embed/your-video-id',
        order: 11
      },
      {
        id: '12',
        title: '12. Testing Your Application',
        description: 'Discover how to write and implement tests for your application. We\'ll cover unit testing with Jest, integration testing with React Testing Library, and end-to-end testing with Cypress to ensure your application works reliably.',
        videoUrl: 'https://www.youtube.com/embed/your-video-id',
        order: 12
      },
      {
        id: '13',
        title: '13. Advanced Features & Future Updates',
        description: 'Explore advanced features and upcoming updates for your application. Learn about implementing real-time features, WebSocket integration, and other advanced topics that will take your app to the next level.',
        videoUrl: 'https://www.youtube.com/embed/your-video-id',
        order: 13
      }
    ])

    res.json({ success: true, videos: newVideos })
  } catch (error) {
    console.error('Error adding new videos:', error)
    res.status(500).json({ error: 'Failed to add new videos' })
  }
})

app.post('/update-location', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const { coordinates } = req.body
    
    // Update user's location in database with just coordinates
    await User.findByIdAndUpdate(req.user._id, {
      location: {
        coordinates: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        }
      }
    })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update location' })
  }
})

// Error handler should be after routes but before app.listen
app.use((err, req, res, next) => {
  console.error('Global error handler:', err)
  if (err.name === 'AuthenticationError') {
    return res.redirect(`${process.env.CLIENT_URL}/login`)
  }
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 