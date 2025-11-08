import { createUseStyles } from 'react-jss'
import { Theme } from '@components/theme'

export const useStyles = createUseStyles((theme: Theme) => ({
  detectionResult: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: theme.colors.white,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.bright_purple}20`,
    boxShadow: theme.boxShadow.boxShadowLarge,
  },
  detectionTitle: {
    color: theme.colors.royal_blue,
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '16px',
  },
  detectionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: theme.colors.bright_purple + '05',
    borderRadius: '8px',
    marginBottom: '10px',
    border: `1px solid ${theme.colors.bright_purple}10`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.colors.bright_purple + '10',
      transform: 'translateX(4px)',
    },
  },
  detectionLabel: {
    fontWeight: 'bold',
    fontSize: '15px',
    color: theme.colors.royal_blue,
  },
  detectionConfidence: {
    color: theme.colors.bright_purple,
    fontWeight: 600,
    fontSize: '14px',
  },
  annotatedImageContainer: {
    marginTop: '16px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: `2px solid ${theme.colors.bright_purple}20`,
  },
  annotatedImage: {
    width: '100%',
    display: 'block',
    borderRadius: '8px',
  },
}))
