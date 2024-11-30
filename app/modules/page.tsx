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
    title: "Project Setup & Design System",
    description: "Learn how to set up a modern web application using Next.js 14, TypeScript, and Tailwind CSS. We'll implement a robust design system using shadcn/ui components that will serve as the foundation for your entire application.",
    duration: "45 mins",
    icon: <Palette className="w-5 h-5" />,
    skills: ["Next.js 14", "TypeScript", "Tailwind CSS", "shadcn/ui"]
  },
  {
    id: "2",
    title: "Setting Up Your Development Environment",
    description: "Configure your development environment with the necessary tools and extensions. Learn best practices for project structure and code organization that will make your development process smoother.",
    duration: "30 mins",
    icon: <Code className="w-5 h-5" />,
    skills: ["VS Code", "Git", "npm", "Environment Setup"]
  },
  {
    id: "3",
    title: "Enabling Google Login for Your Web App",
    description: "Implement secure authentication using Google OAuth. Learn how to handle user sessions, protect routes, and manage user data securely in your application.",
    duration: "45 mins",
    icon: <Users className="w-5 h-5" />,
    skills: ["OAuth 2.0", "Authentication", "Session Management"]
  },
  {
    id: "4",
    title: "Installing MongoDB & Saving Google Login Users",
    description: "Set up MongoDB to store user data and integrate it with your authentication system. Learn database modeling, CRUD operations, and best practices for data management.",
    duration: "50 mins",
    icon: <Database className="w-5 h-5" />,
    skills: ["MongoDB", "Database Design", "Data Modeling"]
  },
  {
    id: "5",
    title: "Integrating Stripe Payments",
    description: "Add payment processing to your application using Stripe. Learn how to handle subscriptions, manage payment flows, and implement proper error handling.",
    duration: "55 mins",
    icon: <Lock className="w-5 h-5" />,
    skills: ["Stripe API", "Payment Processing", "Error Handling"]
  },
  {
    id: "6",
    title: "Building the Interactive Dashboard",
    description: "Create an interactive dashboard that displays user progress, course content, and analytics. Learn how to implement data visualization and real-time updates.",
    duration: "65 mins",
    icon: <LayoutDashboard className="w-5 h-5" />,
    skills: ["Data Visualization", "Real-time Updates", "User Interface"]
  },
  {
    id: "7",
    title: "Admin Controls & Content Restrictions",
    description: "Implement role-based access control and content restrictions. Learn how to create an admin panel and manage premium content access.",
    duration: "45 mins",
    icon: <Settings className="w-5 h-5" />,
    skills: ["Access Control", "Admin Panel", "Content Management"]
  },
  {
    id: "8",
    title: "Analytics & User Tracking",
    description: "Implement comprehensive analytics and user tracking. Learn how to monitor user behavior, track key metrics, and make data-driven decisions.",
    duration: "40 mins",
    icon: <Sparkles className="w-5 h-5" />,
    skills: ["Analytics", "User Tracking", "Data Analysis"]
  },
  {
    id: "9",
    title: "API Development & Integration",
    description: "Build robust API endpoints and integrate them with your frontend. Learn RESTful principles and secure API development practices.",
    duration: "50 mins",
    icon: <Code className="w-5 h-5" />,
    skills: ["API Design", "REST", "Backend Integration"]
  },
  {
    id: "10",
    title: "Deployment & Production",
    description: "Deploy your application to production. Learn about different hosting options, environment configuration, and production best practices.",
    duration: "45 mins",
    icon: <Settings className="w-5 h-5" />,
    skills: ["Deployment", "DevOps", "Production Setup"]
  },
  {
    id: "11",
    title: "Testing & Quality Assurance",
    description: "Implement comprehensive testing strategies. Learn about different types of testing and how to ensure your application's reliability.",
    duration: "40 mins",
    icon: <Clock className="w-5 h-5" />,
    skills: ["Testing", "QA", "Code Quality"]
  },
  {
    id: "12",
    title: "Advanced Features & Updates",
    description: "Explore advanced features and learn about maintaining and updating your application. Cover topics like WebSocket integration and real-time features.",
    duration: "45 mins",
    icon: <Sparkles className="w-5 h-5" />,
    skills: ["WebSocket", "Real-time Features", "Maintenance"]
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

        <Tabs defaultValue="1" className="w-full">
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