import { Theme } from '@components/theme'
import { createUseStyles } from 'react-jss'

export const useStyles = createUseStyles((theme: Theme) => ({
  cardContainer: {
    display: 'flex',
    padding: 32,
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 14,
    background: 'rgba(255, 255, 255, 0.9)',
    boxShadow: theme.boxShadow.boxShadowLarge,
  },
}))
