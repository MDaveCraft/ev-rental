"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import {
  Car,
  Zap,
  History,
  Star,
  CreditCard,
  Settings,
  HelpCircle,
  MapPin,
  Calendar,
  User,
  FileText,
  Sparkles,
  Search,
  TrendingUp,
  Battery,
  Clock,
  Coins,
} from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const runCommand = useCallback(
    (command: () => void) => {
      onOpenChange(false)
      command()
    },
    [onOpenChange],
  )

  // Recent searches (mock data)
  const recentSearches = [
    { label: "Tesla Model 3 Booking", icon: Car, href: "/dashboard/bookings" },
    { label: "Charging station Bangalore", icon: Zap, href: "/dashboard/charging" },
  ]

  // Quick actions
  const quickActions = [
    { label: "Book a Trip", icon: Car, href: "/dashboard/bookings", shortcut: "B" },
    { label: "Find Chargers", icon: Zap, href: "/dashboard/charging", shortcut: "C" },
    { label: "V2G Credits", icon: Coins, href: "/dashboard/v2g-credits", shortcut: "V" },
    { label: "View Map", icon: MapPin, href: "/dashboard/map", shortcut: "M" },
  ]

  // Features
  const features = [
    { label: "Past Bookings", icon: History, href: "/dashboard/bookings?tab=history" },
    { label: "V2G Earnings", icon: Coins, href: "/dashboard/v2g-credits" },
    { label: "My Reviews", icon: Star, href: "/dashboard/reviews" },
    { label: "Payment Methods", icon: CreditCard, href: "/dashboard/payments" },
    { label: "Trip Calendar", icon: Calendar, href: "/dashboard/calendar" },
    { label: "Documents", icon: FileText, href: "/dashboard/documents" },
  ]

  // Account
  const accountItems = [
    { label: "Profile Settings", icon: User, href: "/dashboard/settings" },
    { label: "Preferences", icon: Settings, href: "/dashboard/settings?tab=preferences" },
    { label: "Help & Support", icon: HelpCircle, href: "/dashboard/support" },
  ]

  // AI suggestions based on context
  const aiSuggestions = [
    { label: "Best charger for your next trip to Pune", icon: Sparkles },
    { label: "Optimize your charging schedule", icon: TrendingUp },
    { label: "Nearby EVs with high availability", icon: Battery },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl max-w-2xl">
        <VisuallyHidden>
          <DialogTitle>Command Palette</DialogTitle>
        </VisuallyHidden>
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <CommandInput
              placeholder="Search bookings, chargers, settings..."
              value={search}
              onValueChange={setSearch}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0"
            />
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
              ESC
            </kbd>
          </div>
          <CommandList className="max-h-[400px]">
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Sparkles className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No results found.</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Try asking AI for help</p>
              </div>
            </CommandEmpty>

            {/* AI Suggestions */}
            {search.length > 0 && (
              <CommandGroup heading="AI Suggestions">
                {aiSuggestions.map((item) => (
                  <CommandItem key={item.label} onSelect={() => runCommand(() => {})} className="gap-3 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Recent Searches */}
            {!search && (
              <CommandGroup heading="Recent">
                {recentSearches.map((item) => (
                  <CommandItem
                    key={item.label}
                    onSelect={() => runCommand(() => router.push(item.href))}
                    className="gap-3"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            <CommandSeparator />

            {/* Quick Actions */}
            <CommandGroup heading="Quick Actions">
              {quickActions.map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => runCommand(() => router.push(item.href))}
                  className="gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span>{item.label}</span>
                  {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* Features */}
            <CommandGroup heading="Features">
              {features.map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => runCommand(() => router.push(item.href))}
                  className="gap-3"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* Account */}
            <CommandGroup heading="Account">
              {accountItems.map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => runCommand(() => router.push(item.href))}
                  className="gap-3"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          {/* AI Copilot Footer */}
          <div className="border-t bg-secondary/30 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>AI Copilot ready to help</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground hidden sm:inline-flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
                <span className="text-xs text-muted-foreground hidden sm:inline">to open</span>
              </div>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
