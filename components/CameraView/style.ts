import { Theme } from '@components/theme'
import { createUseStyles } from 'react-jss'

export const useStyles = createUseStyles((theme: Theme) => ({
  camera: {
    display: 'flex',
    padding: 73,
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
    alignSelf: 'stretch',
    borderRadius: 10,
    background: '#ECECF0',
    position: 'relative',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.colors.flame,
    color: theme.colors.white,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  },
  image: {
    maxHeight: '50vh',
    objectFit: 'cover',
    width: '100%',
    borderRadius: 20,
  },
  video: {
    width: '100%',
    height: '25vh',
    objectFit: 'cover',
    borderRadius: 10,
    backgroundColor: theme.colors.dark,
  },
  noImage: {
    color: theme.colors.slate_gray,
    display: 'flex',
  },
}))
