// Shared animation utilities for cohesive, premium scroll animations
// Following Stripe/Linear/Vercel motion principles

export const luxuriousEasing = [0.22, 1, 0.36, 1] as const
export const smoothEasing = [0.16, 1, 0.3, 1] as const

// Scroll reveal variants
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: luxuriousEasing,
    },
  },
}

export const fadeLeftVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      ease: luxuriousEasing,
    },
  },
}

export const fadeRightVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      ease: luxuriousEasing,
    },
  },
}

export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: luxuriousEasing,
    },
  },
}

// Staggered container variants
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const fastStaggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

// Grid cascade variants (for bento grids)
export const gridCascadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

export const gridItemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: luxuriousEasing,
    },
  },
}

// Card hover effects
export const cardHoverVariants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.25,
      ease: smoothEasing,
    },
  },
}

// Navbar scroll state
export const navbarScrolledStyle = {
  background: "rgba(10, 10, 10, 0.95)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 4px 30px rgba(16, 185, 129, 0.1)",
}

// Chart animation variants
export const chartContainerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: luxuriousEasing,
    },
  },
}

// Line draw animation for charts
export const lineDrawVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, ease: luxuriousEasing },
      opacity: { duration: 0.3 },
    },
  },
}

// Bar rise animation
export const barRiseVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: (i: number) => ({
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: luxuriousEasing,
    },
  }),
}

// Section header variants
export const sectionHeaderVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: luxuriousEasing,
    },
  },
}

// Footer variants
export const footerItemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: luxuriousEasing,
    },
  },
}

// Particle text variants
export const particleTextVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: luxuriousEasing,
    },
  },
}

// Viewport margin for triggering animations
export const defaultViewportMargin = "-80px"
export const earlyViewportMargin = "-150px"
