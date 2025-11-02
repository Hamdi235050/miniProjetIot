import { createUseStyles } from 'react-jss'
import { Theme } from '@components/theme'

export const useStyles = createUseStyles((theme: Theme) => ({
  detectionCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
  },
  detectionImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    backgroundColor: '#f5f5f5',
  },
  noImagePlaceholder: {
    width: '100%',
    height: '180px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    color: theme.colors.slate_gray,
    gap: '8px',
  },
  detectionInfo: {
    padding: '12px',
  },
  detectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  detectionCount: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: theme.colors.royal_blue,
  },
  detectionDate: {
    fontSize: '12px',
    color: theme.colors.slate_gray,
  },
  detectionObjects: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  detectionTag: {
    fontSize: '12px',
    padding: '4px 8px',
    backgroundColor: theme.colors.bright_purple + '20',
    color: theme.colors.bright_purple,
    borderRadius: '4px',
    fontWeight: '500',
  },
}))
