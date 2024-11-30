"use client"
import * as React from 'react'
import { MainLayout } from '../components/MainLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Code, Palette, Database, Lock, LayoutDashboard, Settings, Users, Sparkles } from 'lucide-react'
import { AnimatedBackground } from '../components/AnimatedBackground'

const modules = [
  {
    id: "intro",
    title: "Introduction to ZeroCodeCEO",
    description: "Get started with an overview of the course, what you'll learn, and how to make the most of this learning experience. Learn about the tools we'll use and what you'll be able to build by the end.",
    duration: "30 mins",
    icon: <Sparkles className="w-5 h-5" />,
    skills: ["Course Overview", "Tools Introduction", "Learning Path"]
  },
  {
    id: "1",
    title: "Setting Up Your Development Environment",
    description: "Learn how to install all the essential tools and software needed to follow along with the course. This video will guide you step-by-step through the installation process, ensuring you are fully equipped and ready to dive into the next lessons.",
    duration: "12 mins",
    icon: <Palette className="w-5 h-5" />,
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "GitHub", "Node.js", "MongoDB", "React"]
  },
  {
    id: "2",
    title: "From Design to Code: Building Your Project’s Foundation",
    description: "Learn how to transform a website or SaaS screenshot into a fully functional site that serves as the foundation for your project. This video covers where to find high-quality designs and guides you through using Cursor to efficiently convert them into clean, usable code.",
    duration: "13 mins",
    icon: <Code className="w-5 h-5" />,
    skills: ["Cursor", "Image to Code", "Design to Code", "How to Find Designs"]
  },
  {
    id: "3",
    title: "Enabling Google Login for Your Web App",
    description: "Learn how to set up Google login for your web app step by step. This video will guide you through obtaining the necessary credentials from the Google Cloud Console and configuring your site to allow users to sign in with their Google accounts, enhancing security and user experience.",
    duration: "16 mins",
    icon: <Users className="w-5 h-5" />,
    skills: ["Google OAuth 2.0", "Authentication", "Session Management", "Google Cloud Console", "Saving Credentials"]
  },
  {
    id: "4",
    title: "Installing MongoDB & Saving Google Login Users",
    description: "In this video, you'll learn how to install MongoDB and set it up for your project. Follow along as we save the first pieces of data—users who log in using Google. This foundational step will prepare your database for managing user information efficiently.",
    duration: "20 mins",
    icon: <Database className="w-5 h-5" />,
    skills: ["MongoDB", "Mongo Atlas", "Database Design", "Data Modeling", "Saving Users"]
  },
  {
    id: "5",
    title: "Integrating Stripe Payments: From Test Mode to Live Transactions",
    description: "Discover how to integrate Stripe as your payment gateway, starting from test mode and progressing to live transactions with a real credit card. This video covers the entire process, including setting up Stripe, testing payments, and going live, so you can confidently handle payments in your web app.",
    duration: "34 mins",
    icon: <Lock className="w-5 h-5" />,
    skills: ["Stripe API", "Payment Processing", "Error Handling", "Test Mode", "Live Transactions", "Confetti Success Page Animation"]
  },
  {
    id: "6",
    title: "Building the Dashboard with the Course Videos and Statistics",
    description: "Learn how to create a dynamic course dashboard that organizes your videos and displays key user statistics. This video walks you through designing and coding the interface, making it easy for users to access content and track their progress.",
    duration: "1 hour and  20mins",
    icon: <LayoutDashboard className="w-5 h-5" />,
    skills: ["Data Visualization", "Charts", "Dynamic Map", "User Count", "Members Count", "Real-time Updates", "User Interface"]
  },
  {
    id: "7",
    title: "Setting Up Admin Controls & Restricting Content for Paid Users",
    description: "In this video, you'll learn how to create an admin account and implement restrictions to ensure that only paid users can access premium content. We’ll cover user roles, permissions, and securing your content behind the paywall for a seamless experience.",
    duration: "37 mins",
    icon: <Settings className="w-5 h-5" />,
    skills: ["Access Control", "Admin Panel", "Content Management", "User Roles", "Permissions", "Paywall"]
  },
  {
    id: "8",
    title: "Customizing Your Web App: Logos, Text, and Final Touches",
    description: "In this video, learn how to personalize your web app by adding your logo, updating text, and making final adjustments. We'll guide you through the finishing touches that give your project a polished, professional look.",
    duration: "26 mins",
    icon: <Sparkles className="w-5 h-5" />,
    skills: ["Logos", "Text", "Final Touches", "Polished Look"]
  },
  {
    id: "9",
    title: "Adding a Favicon, Animations, and Final Visual Touch-Ups",
    description: "Learn how to add a favicon to your web app, incorporate animations, and apply final visual touch-ups. This video focuses on the small details that enhance user experience and give your project a polished finish.",
    duration: "17 mins",
    icon: <Code className="w-5 h-5" />,
    skills: ["Favicon", "Animations", "Final Visual Touch-Ups", "User Experience", "Polished Finish"]
  },
  {
    id: "10",
    title: "Building a Course Progress Tracker with a Progress Bar",
    description: "In this video, you'll learn how I implemented the progress tracking system for the course. We'll guide you through tracking user progress, updating the database, and displaying a dynamic progress bar to keep students engaged and motivated.",
    duration: "29 mins",
    icon: <Settings className="w-5 h-5" />,
    skills: [ "Progress Tracking", "Progress Bar", "Database", "User Experience"]
  },  
  {
    id: "11",
    title: "Final Touches: Creating Static Pages",
    description: "In this video, we’ll wrap up the project by creating the remaining static pages, including Modules and FAQ, and making final visual adjustments before the deployment off on your server.",
    duration: "7 mins",
    icon: <Clock className="w-5 h-5" />,
    skills: ["Creating StaticPages", "Final Visual Adjustments"]
  },
  {
    id: "12",
    title: "Deploying Your Web App: Frontend, Backend, and Domain Setup",
    description: "In this video, you’ll learn how to upload your code to GitHub, deploy the frontend to Vercel, and the backend to Render. We’ll also walk through linking your custom domain, zerocodeceo.com, to bring your web app live.",
    duration: "26 mins",
    icon: <Sparkles className="w-5 h-5" />,
    skills: ["GitHub", "Vercel", "Render", "Domain Setup", "Bringing Your Web App Live", "Deploying"]
  }
]

export default function ModulesPage() {
  return (
    <MainLayout>
      <AnimatedBackground />
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Course Modules
          </h1>
          <p className="text-lg text-gray-600">
          Learn how to build <strong>this exact web application you’re using right now</strong>—from scratch.</p> 
          <br></br>
          <p>Starting with just a screenshot, you’ll create everything: user authentication, payments, a database, financial dashboards, charts, and more. And the best part? You’ll do it all without typing a single line of code.
          </p>
        </div>

        <Tabs defaultValue="intro" className="w-full">
          <TabsList className="grid grid-cols-2 lg:grid-cols-7 mb-8 bg-white/80 backdrop-blur-sm shadow rounded-lg">
            <TabsTrigger value="intro">Intro</TabsTrigger>
            {[1, 2, 3, 4, 5, 6].map((group) => (
              <TabsTrigger key={group} value={group.toString()}>
                {`${group * 2 - 1}-${group * 2}`}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="intro">
            <div className="grid gap-6">
              <Card key="intro" className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-100/80 rounded-lg">
                      {modules[0].icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{modules[0].title}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Duration: {modules[0].duration}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {modules[0].description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {modules[0].skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-purple-100/50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {[1, 2, 3, 4, 5, 6].map((group) => (
            <TabsContent key={group} value={group.toString()}>
              <div className="grid gap-6">
                {modules.slice(group * 2 - 1, group * 2 + 1).map((module) => (
                  <Card key={module.id} className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-100/80 rounded-lg">
                          {module.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-1">{module.title}</CardTitle>
                          <CardDescription className="text-sm text-gray-500">
                            Duration: {module.duration}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        {module.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {module.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-purple-100/50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  )
} 