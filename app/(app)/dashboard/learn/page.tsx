"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Play,
  CheckCircle2,
  Lock,
  Award,
  Clock,
  ChevronRight,
  Zap,
  Battery,
  Car,
  Shield,
  Star,
  Trophy,
  Target,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const MODULES = [
  {
    id: 1,
    title: "EV Basics & Terminology",
    description: "Learn fundamental EV concepts, battery technology, and key terminology",
    duration: "15 min",
    lessons: 5,
    completed: true,
    icon: Battery,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: 2,
    title: "Charging Infrastructure",
    description: "Understand different charger types, networks, and how to plan charging stops",
    duration: "20 min",
    lessons: 6,
    completed: true,
    icon: Zap,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    id: 3,
    title: "Range Optimization",
    description: "Tips and techniques to maximize your EV range efficiently",
    duration: "25 min",
    lessons: 7,
    completed: false,
    progress: 60,
    icon: Target,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 4,
    title: "Safety & Best Practices",
    description: "Safety protocols, emergency procedures, and responsible EV usage",
    duration: "20 min",
    lessons: 5,
    completed: false,
    locked: false,
    icon: Shield,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: 5,
    title: "Advanced Driving Techniques",
    description: "Master regenerative braking, eco-driving, and trip planning",
    duration: "30 min",
    lessons: 8,
    completed: false,
    locked: true,
    icon: Car,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
]

const CERTIFICATIONS = [
  {
    id: 1,
    name: "EV Ready Driver",
    description: "Complete EV Basics & Charging modules",
    earned: true,
    earnedDate: "Nov 15, 2025",
    discount: "5%",
    icon: Award,
  },
  {
    id: 2,
    name: "Range Master",
    description: "Complete Range Optimization with 80%+ quiz score",
    earned: false,
    progress: 60,
    discount: "10%",
    icon: Trophy,
  },
  {
    id: 3,
    name: "EV Expert",
    description: "Complete all modules and pass final assessment",
    earned: false,
    progress: 40,
    discount: "15%",
    icon: Star,
  },
]

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What does SOC stand for in EV terminology?",
    options: ["Speed of Charge", "State of Charge", "System of Control", "Size of Capacity"],
    correct: 1,
  },
  {
    id: 2,
    question: "Which type of charger is fastest for EVs?",
    options: ["Level 1 AC", "Level 2 AC", "DC Fast Charger", "Portable Charger"],
    correct: 2,
  },
  {
    id: 3,
    question: "What technique helps recover energy while braking?",
    options: ["Turbo Boost", "Regenerative Braking", "Eco Mode", "Sport Mode"],
    correct: 1,
  },
]

export default function LearnPage() {
  const [selectedModule, setSelectedModule] = useState<(typeof MODULES)[0] | null>(null)
  const [quizMode, setQuizMode] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleStartQuiz = () => {
    setQuizMode(true)
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowResults(false)
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers, answerIndex]
    setSelectedAnswers(newAnswers)

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 500)
    } else {
      setTimeout(() => setShowResults(true), 500)
    }
  }

  const score = selectedAnswers.filter((a, i) => a === QUIZ_QUESTIONS[i].correct).length

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">EV Education Hub</h1>
          <p className="text-muted-foreground">Learn, certify, and unlock discounts on your rentals</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Your Progress</p>
            <p className="text-2xl font-semibold text-primary">40%</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {quizMode ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto"
          >
            {!showResults ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => setQuizMode(false)}>
                      Exit Quiz
                    </Button>
                  </div>
                  <Progress value={((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100} className="mt-4" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <h2 className="text-xl font-semibold">{QUIZ_QUESTIONS[currentQuestion].question}</h2>

                  <div className="space-y-3">
                    {QUIZ_QUESTIONS[currentQuestion].options.map((option, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(i)}
                        disabled={selectedAnswers.length > currentQuestion}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border transition-all",
                          selectedAnswers[currentQuestion] === i
                            ? i === QUIZ_QUESTIONS[currentQuestion].correct
                              ? "border-primary bg-primary/10"
                              : "border-destructive bg-destructive/10"
                            : "hover:border-primary/50",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full border text-sm">
                            {String.fromCharCode(65 + i)}
                          </span>
                          {option}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={cn(
                      "mx-auto mb-6 h-20 w-20 rounded-full flex items-center justify-center",
                      score >= 2 ? "bg-primary/20" : "bg-amber-500/20",
                    )}
                  >
                    {score >= 2 ? (
                      <Trophy className="h-10 w-10 text-primary" />
                    ) : (
                      <Target className="h-10 w-10 text-amber-500" />
                    )}
                  </motion.div>

                  <h2 className="text-2xl font-semibold mb-2">{score >= 2 ? "Excellent Work!" : "Keep Practicing!"}</h2>
                  <p className="text-muted-foreground mb-6">
                    You scored {score} out of {QUIZ_QUESTIONS.length} questions correctly
                  </p>

                  {score >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary mb-6"
                    >
                      <Award className="h-5 w-5" />
                      <span className="font-medium">10% Discount Unlocked!</span>
                    </motion.div>
                  )}

                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => setQuizMode(false)}>
                      Back to Modules
                    </Button>
                    <Button onClick={handleStartQuiz}>Retry Quiz</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ) : (
          <motion.div key="modules" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Certifications */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Certifications</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {CERTIFICATIONS.map((cert, i) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <Card
                      className={cn(
                        "relative overflow-hidden transition-shadow",
                        cert.earned ? "border-primary shadow-lg shadow-primary/10" : "",
                      )}
                    >
                      {cert.earned && (
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent" />
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-full flex items-center justify-center",
                              cert.earned ? "bg-primary/20" : "bg-muted",
                            )}
                          >
                            <cert.icon
                              className={cn("h-5 w-5", cert.earned ? "text-primary" : "text-muted-foreground")}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm">{cert.name}</h3>
                              {cert.earned && <CheckCircle2 className="h-4 w-4 text-primary" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{cert.description}</p>
                            {cert.earned ? (
                              <p className="text-xs text-primary mt-2">Earned {cert.earnedDate}</p>
                            ) : (
                              <Progress value={cert.progress} className="mt-2 h-1" />
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={cert.earned ? "default" : "secondary"}
                          className="absolute bottom-4 right-4 text-xs"
                        >
                          {cert.discount} off
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Learning Modules */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Learning Modules</h2>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleStartQuiz}>
                  <Play className="h-4 w-4" />
                  Take Quick Quiz
                </Button>
              </div>

              <div className="space-y-3">
                {MODULES.map((module, i) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <Card
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        module.locked ? "opacity-60" : "",
                        module.completed ? "border-primary/30" : "",
                      )}
                      onClick={() => !module.locked && setSelectedModule(module)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", module.bgColor)}>
                            <module.icon className={cn("h-6 w-6", module.color)} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{module.title}</h3>
                              {module.completed && <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />}
                              {module.locked && <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{module.description}</p>
                            {module.progress && !module.completed && (
                              <Progress value={module.progress} className="mt-2 h-1.5 max-w-xs" />
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {module.duration}
                            </span>
                            <span>{module.lessons} lessons</span>
                            <ChevronRight className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Did you know?</h3>
                    <p className="text-sm text-muted-foreground">
                      Completing all certifications can save you up to 30% on your monthly rentals. Start learning
                      today!
                    </p>
                  </div>
                  <Button className="gap-2">
                    Continue Learning
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
