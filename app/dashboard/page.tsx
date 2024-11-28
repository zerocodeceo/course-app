"use client"
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, DollarSign, Eye, TrendingUp, PlayCircle, Globe2, Layers, Lock } from "lucide-react"
import { ResponsiveContainer } from 'recharts'
import { MainLayout } from '../components/MainLayout'
import SimpleWorldMap from '../components/SimpleWorldMap'
import dynamic from 'next/dynamic'
import { showToast } from '../components/Toast'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { CourseProgress } from '../components/CourseProgress'
import { VideoPlayer } from '../components/VideoPlayer'
import { formatTime } from '../lib/utils'

// Rest of your dashboard code... 