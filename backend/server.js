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

const app = express()

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// Middleware
app.use('/webhook', express.raw({type: 'application/json'}))
app.use(express.json())
app.use(cors({
  origin: ['https://zerocodeceo.vercel.app', 'http://localhost:3000'],
  credentials: true
}))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60
  }),
  cookie: {
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
    domain: '.onrender.com'
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
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login` }),
  function(req, res) {
    res.redirect(process.env.CLIENT_URL)
  }
)

app.get('/auth/status', (req, res) => {
  res.json({ user: req.user || null })
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
              description: 'Learn to build a web app from scratch using AI. This course covers front-end, back-end development, and integrating AI features, giving you the skills to create and deploy intelligent web applications. Perfect for beginners and developers alike.',
            },
            unit_amount: 2999,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.CLIENT_URL,
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

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)

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
      .sort({ purchaseDate: -1 })
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
    // Get all premium users sorted by purchase date
    const premiumUsers = await User.find({ plan: 'premium' })
      .sort({ purchaseDate: 1 })

    const totalSubscribers = premiumUsers.length
    const totalRevenue = totalSubscribers * 29.99

    // Get unique locations from premium users
    const visitorLocations = premiumUsers.map(user => {
      // For now, just return Miami coordinates for all users
      return {
        lat: 25.7617,  // Miami latitude
        lng: -80.1918  // Miami longitude
      }
    })

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
      totalMembers: totalSubscribers,
      totalRevenue,
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
          description: 'Learn how to create a dynamic course dashboard that organizes your videos and displays key user statistics. This video walks you through designing and coding the interface, making it easy for users to access content and track their progress.',
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

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 