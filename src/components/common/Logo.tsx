import { useState } from 'react'
import { Cpu } from 'lucide-react'

interface LogoProps {
  /** Size classes for the logo's bounding box, e.g."h-9 w-9"*/
  className?: string
  /** Size classes for the fallback icon, shown until /kaaralogo.jpg exists */
  iconClassName?: string
}

/**
 * Renders the Kaara wordmark image. Falls back to the old Cpu-in-a-box
 * placeholder (no broken-image icon) until /kaaralogo.jpg is added to
 * the public/ folder — at that point it switches over automatically.
 */
export function Logo({ className = 'h-9 w-9', iconClassName = 'h-5 w-5' }: LogoProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-primary shadow-md shadow-primary/20 shrink-0 ${className}`}>
        <Cpu className={`${iconClassName} text-white`} />
      </div>
    )
  }

  return (
    <img
      src="/kaaralogo.jpg"
      alt="Kaara"
      className={`object-contain shrink-0 ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
