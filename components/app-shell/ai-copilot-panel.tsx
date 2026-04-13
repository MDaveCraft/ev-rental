"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, Send, Loader2, Zap, Car, MapPin, Calendar, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  suggestions?: string[]
}

interface AICopilotPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AICopilotPanel({ isOpen, onClose }: AICopilotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your EV Assistant. I can help you find chargers, book trips, check availability, and optimize your EV experience. What would you like to do?",
      suggestions: [
        "Find chargers near me",
        "Book a trip to Pune",
        "Check my booking status",
        "Optimize charging schedule",
      ],
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, Message> = {
        default: {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I can help you with that! Based on your profile and location, here are some options:",
          suggestions: ["View nearby chargers", "Check trip availability", "See my bookings"],
        },
        charger: {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I found 12 charging stations within 5km of your location. The nearest one is at MG Road with 3 available slots. Would you like to reserve a slot?",
          suggestions: ["Reserve at MG Road", "Show all stations", "Filter by fast charging"],
        },
        trip: {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Great choice! I found 8 EVs available for your trip to Pune. The best option is a Tata Nexon EV with 94% range confidence. Shall I proceed with booking?",
          suggestions: ["Book Tata Nexon EV", "Show other options", "Compare prices"],
        },
        booking: {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "You have 2 upcoming bookings:\n\n1. Tata Nexon EV - Dec 8, Bengaluru (Confirmed)\n2. MG ZS EV - Dec 15, Pune (Pending)\n\nWould you like to manage any of these?",
          suggestions: ["View Dec 8 trip", "Confirm Dec 15 trip", "Add to calendar"],
        },
        optimize: {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Based on your usage patterns and electricity rates, I recommend charging between 10 PM - 6 AM for 23% cost savings. I can also set up smart alerts for optimal charging windows.",
          suggestions: ["Enable smart charging", "View savings report", "Set charging alerts"],
        },
      }

      const lowerText = messageText.toLowerCase()
      let response = responses.default

      if (lowerText.includes("charger") || lowerText.includes("charging")) {
        response = responses.charger
      } else if (lowerText.includes("trip") || lowerText.includes("pune") || lowerText.includes("book")) {
        response = responses.trip
      } else if (lowerText.includes("booking") || lowerText.includes("status")) {
        response = responses.booking
      } else if (lowerText.includes("optimize") || lowerText.includes("schedule")) {
        response = responses.optimize
      }

      setMessages((prev) => [...prev, response])
      setIsLoading(false)
    }, 1000)
  }

  const quickActions = [
    { icon: Zap, label: "Find Chargers", color: "text-amber-500" },
    { icon: Car, label: "Book Trip", color: "text-primary" },
    { icon: MapPin, label: "Nearby EVs", color: "text-emerald-500" },
    { icon: Calendar, label: "My Schedule", color: "text-blue-500" },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-4 top-20 bottom-4 w-[380px] z-50"
        >
          <Card className="h-full flex flex-col shadow-2xl border-border/50 bg-card/95 backdrop-blur-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Copilot</h3>
                  <p className="text-xs text-muted-foreground">Your EV Assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-b bg-secondary/20">
              <div className="grid grid-cols-4 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.label)}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <action.icon className={cn("h-4 w-4", action.color)} />
                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5",
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/50",
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.suggestions && (
                      <div className="mt-3 space-y-1.5">
                        {message.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(suggestion)}
                            className="flex items-center justify-between w-full text-left text-xs px-3 py-2 rounded-lg bg-background/50 hover:bg-background transition-colors group"
                          >
                            <span>{suggestion}</span>
                            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-background/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about EVs..."
                  className="flex-1 bg-secondary/50 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full h-10 w-10 shrink-0"
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
