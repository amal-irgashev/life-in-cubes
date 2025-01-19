import { motion } from 'framer-motion'

interface DecadeMoodProps {
  isHappy: boolean
}

export function DecadeMood({ isHappy }: DecadeMoodProps) {
  return (
    <motion.div
      className="w-6 h-6 relative"
      initial={false}
      animate={isHappy ? "happy" : "neutral"}
    >
      <motion.div
        className="absolute inset-0 border-2 border-primary rounded-full"
        variants={{
          happy: {
            scaleY: 1,
          },
          neutral: {
            scaleY: 0.5,
          },
        }}
      />
      <motion.div
        className="absolute bottom-1 left-1/2 w-3 h-3 border-2 border-t-0 border-primary rounded-b-full -translate-x-1/2"
        variants={{
          happy: {
            scaleY: 1,
          },
          neutral: {
            scaleY: 0.1,
          },
        }}
      />
    </motion.div>
  )
}

