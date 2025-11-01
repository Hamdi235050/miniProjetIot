import { Theme } from '@components/theme'
import { createUseStyles } from 'react-jss'

export const useStyles = createUseStyles((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.light,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    height: '90vh', // Prend toute la hauteur de la fenêtre
    justifyContent: 'center',
  },
}))
