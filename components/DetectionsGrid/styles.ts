import { Theme } from '@components/theme'
import { createUseStyles } from 'react-jss'
export const useStyles = createUseStyles((theme: Theme) => ({
  detectionsScrollContainer: {
    maxHeight: '500px',
    minHeight: '200px',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '8px',
    scrollBehavior: 'smooth',
    display: 'block',
    '&::-webkit-scrollbar': {
      width: '10px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '5px',
      margin: '4px 0',
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.colors.bright_purple,
      borderRadius: '5px',
      border: '2px solid #f1f1f1',
      '&:hover': {
        background: theme.colors.royal_blue,
      },
    },
    scrollbarWidth: 'thin',
    scrollbarColor: `${theme.colors.bright_purple} #f1f1f1`,
  },
  detectionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
  },
  noDetections: {
    textAlign: 'center',
    padding: '40px',
    color: theme.colors.slate_gray,
    fontSize: '14px',
  },
  loadingText: {
    textAlign: 'center',
    padding: '20px',
    color: theme.colors.slate_gray,
  },
}))
