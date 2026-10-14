import Reveal3D from './Reveal3D'
import type { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  return (
    <Reveal3D className={className} delay={delay} direction={direction}>
      {children}
    </Reveal3D>
  )
}
