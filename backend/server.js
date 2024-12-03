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

app.use(express.json())
app.use(cors({
  origin: ['https://zerocodeceo.com', 'https://www.zerocodeceo.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
  exposedHeaders: ['Set-Cookie']
}))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cookie, Set-Cookie');
  next();
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60
  }),
  name: 'sid',
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
  }
}))

app.use(passport.initialize())
app.use(passport.session())

// Passport configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://zerocodeceo.onrender.com/auth/google/callback",
    proxy: true
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
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
      // Update last login time
      await User.findByIdAndUpdate(req.user._id, {
        lastLogin: new Date()
      })

      req.login(req.user, (err) => {
        if (err) return res.redirect(`${process.env.CLIENT_URL}/login`)
        res.redirect(process.env.CLIENT_URL)
      })
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/login`)
    }
  }
)

app.get('/auth/status', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      // Update last login time when checking status
      await User.findByIdAndUpdate(req.user._id, {
        lastLogin: new Date()
      })
    } catch (error) {
      console.error('Error updating lastLogin:', error)
    }
  }

  res.json({
    user: req.isAuthenticated() ? req.user : null,
    sessionId: req.sessionID,
    sessionExists: !!req.session,
    hasUser: !!req.user,
    isAuthenticated: req.isAuthenticated()
  })
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
  try {
    // Get all premium users with locations
    const premiumUsers = await User.find({ 
      plan: 'premium',
      'location.coordinates': { $exists: true } 
    })

    // Group users by location for the map
    const locationGroups = premiumUsers.reduce((groups, user) => {
      if (!user.location?.coordinates) return groups

      const lat = Math.round(user.location.coordinates.latitude * 10) / 10
      const lng = Math.round(user.location.coordinates.longitude * 10) / 10
      const key = `${lat},${lng}`

      if (!groups[key]) {
        groups[key] = { lat, lng, count: 0 }
      }
      groups[key].count++
      return groups
    }, {})

    const visitorLocations = Object.values(locationGroups).map(({ lat, lng, count }) => ({
      lat,
      lng,
      size: Math.min(Math.max(4, Math.log2(count) * 3), 12)
    }))

    const totalUsers = await User.countDocuments()
    const totalPremiumUsers = await User.countDocuments({ plan: 'premium' })
    const revenue = totalPremiumUsers * 29.99

    // Create basic stats for everyone
    const baseStats = {
      totalMembers: totalUsers,
      totalVisitors: totalUsers,
      visitorLocations,
      memberGrowth: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [0, 0, 0, 0, 0, totalPremiumUsers]
      }
    }

    // Add sensitive data for admin
    if (req.user?.email === 'bbertapeli@gmail.com') {
      res.json({
        ...baseStats,
        totalRevenue: revenue
      })
    } else {
      res.json({
        ...baseStats,
        totalRevenue: 0
      })
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({ error: 'Error fetching dashboard stats' })
  }
})

app.get('/course-content', async (req, res) => {
  try {
    // Define preview content
    const previewContent = [{
      id: '1',
      title: '1. Getting Started with AI Web Development',
      description: 'Learn the fundamentals of building web applications with AI assistance.',
      videoUrl: 'https://www.youtube.com/embed/m4HZgYcyUVA',
      order: 1
    }]

    // If not logged in or basic user, return preview only
    if (!req.user || req.user.plan === 'basic') {
      return res.json(previewContent)
    }

    // For premium users and admin, return full content
    let content = await CourseContent.find().sort('order')
    
    if (!content.length) {
      // Initialize with default content if none exists
      content = await CourseContent.insertMany([
        previewContent[0],
        {
          id: '2',
          title: '2. From Design to Code: Building Your Project\'s Foundation',
          description: 'Learn how to transform a website or SaaS screenshot into a fully functional site.',
          videoUrl: 'https://www.youtube.com/embed/your-video-id',
          order: 2
        },
        // ... add other course content items
      ])
    }

    res.json(content)
  } catch (error) {
    console.error('Error fetching course content:', error)
    res.status(500).json({ error: 'Error fetching course content' })
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

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 