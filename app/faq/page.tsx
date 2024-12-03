"use client"
import * as React from 'react'
import { MainLayout } from '../components/MainLayout'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedBackground } from '../components/AnimatedBackground'

const faqs = [
  {
    question: "What makes this course unique?",
    answer: `This course isn’t just about using AI to generate code. It teaches you how to create everything you’re using right now—from authentication to payments, design to deployment.  
    The coolest part? You’ll type zero lines of code.  Yeah, I know—you’ve probably seen tons of YouTube videos about using Claude, Cursor, Replit, v0, and the rest to whip up code. But let’s be real: typing “Claude, make a to-do list app” isn’t going to get you anywhere.  
    This course is different. For $30, I’ll show you how to build any web app from scratch. No fluff, just me on camera going from a screenshot to an actual product. And from someone who actually knows how to get AI to spit out code that works, looks good, and can go live.  
    Watching clickbait YouTube videos might be fun for a few minutes. But this? This will teach you how to create something real.`
    },
  {
    question: "Do I need any coding experience to take this course?",
    answer: "No coding experience is required! This course is designed for complete beginners. We’ll guide you step by step, using AI tools to build a fully functional web app without writing any code."
  },
  {
    question: "What do I get with the premium plan?",
    answer: "The premium plan, priced at $29.99, gives you lifetime access to the main course and all future extra courses and features included in the plan. Some additional premium content may require a separate purchase, but premium users will receive regular updates and bonuses at no extra cost."
  },
  {
    question: "Will I have access to financial and performance stats for the course?",
    answer: "Yes! As part of the learning experience, you’ll have access to a dashboard showing real-time statistics, including the number of students, total revenue generated, and other performance metrics. This gives you insight into how the course was built and how it functions behind the scenes."
  },
  {
    question: "Can I really build a complete web app without coding?",
    answer: "Of course! The videos in this course show me building the exact full-stack web app you’re using right now—without typing a single line of code. Every feature, from user authentication and payment systems to the progress tracking and the dashboard, was created using AI. By following along, you'll do the same!"
  }
]

export default function FAQPage() {
  return (
    <MainLayout>
      <AnimatedBackground />
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our course and learning process.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800">
              Everything you need to know
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="max-w-3xl mx-auto text-center mt-12">
          <p className="text-gray-600">
            Still have questions? Feel free to contact us at{' '} <br />
            <a 
              href="mailto:zerocodeceo@gmail.com" 
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              zerocodeceo@gmail.com
            </a>
          </p>
        </div>
      </div>
    </MainLayout>
  )
} 