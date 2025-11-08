import { Theme } from '@components/theme'
import { createUseStyles } from 'react-jss'
export type Variants = {
  color: string
  backgroundColor: string
  iconColor?: string
}
export const useStyles = createUseStyles(
  (theme: Theme & { variants: Variants }) => ({
    button: {
      backgroundColor: theme.variants.backgroundColor,
      color: theme.variants.color,
      padding: '8.8px 21.975px 11.2px 16.8px',
      borderRadius: '8px',
      display: 'flex',
      width: 'fit-content',
      gap: '8px',
      border: '0.8px solid rgba(0, 0, 0, 0.10)',
      cursor: 'pointer',
      '&:nth-child(2)': {
        color: theme.variants.color,
        alignItems: 'center',
      },
    },
  })
)
