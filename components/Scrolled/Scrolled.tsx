import { ReactNode } from 'react'
import { useScrolledRowStyles, useStyles } from './style'
import { Theme } from '@components/theme'
export const Scrolled = ({
  children,
  className,
  containerRef: ref,
  showScroll = false,
  ctx,
}: {
  children: ReactNode
  className?: string
  containerRef?: React.RefObject<HTMLDivElement>
  showScroll?: boolean
  ctx: { theme: Theme }
}) => {
  const { theme } = ctx
  const { scrolled } = useStyles({ theme: { ...theme, showScroll } })
  return (
    <div ref={ref} className={`${scrolled} ${className ? className : ''}`}>
      {children}
    </div>
  )
}

export const ScrolledRow = ({
  children,
  className,
  containerRef: ref,
  showScroll = false,
  ctx,
}: {
  children: ReactNode
  className?: string
  containerRef?: React.RefObject<HTMLDivElement>
  showScroll?: boolean
  ctx: { theme: Theme }
}) => {
  const { theme } = ctx

  const { scrolledRow } = useScrolledRowStyles({
    theme: { ...theme, showScroll },
  })
  return (
    <div ref={ref} className={`${scrolledRow} ${className}`}>
      {children}
    </div>
  )
}
