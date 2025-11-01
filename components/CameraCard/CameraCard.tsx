import { Theme } from '@components/theme'
import React from 'react'
import { useStyles } from './styles'

export const CameraCard = ({
  children,
  ctx,
}: {
  children: React.ReactNode
  ctx: {
    theme: Theme
  }
}) => {
  const { theme } = ctx

  const classes = useStyles({ theme })
  return <div className={classes.cardContainer}>{children}</div>
}
