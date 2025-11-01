import { Theme } from '@components/theme'
import { createUseStyles } from 'react-jss'

export const useStyles = createUseStyles(
  (theme: Theme & { showScroll: boolean }) => ({
    scrolled: {
      display: 'flex',
      scrollbarGutter: 'stable',
      width: '100%',
      maxHeight: '100%',
      overflowY: 'auto',
      scrollBehavior: 'smooth',
      ...(!theme.showScroll
        ? {
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '&::-webkit-scrollbar-track': {
              boxShadow: 'inset 0 0 5px grey',
              borderRadius: 10,
            },
            scrollbarWidth: 'none' /* Firefox 64 */,
          }
        : {
            '&::-webkit-scrollbar-track': {
              background: theme.colors.bright_purple,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.colors.royal_blue,
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: theme.colors.royal_blue,
            },
            scrollbarColor: `${theme.colors.royal_blue} ${theme.colors.royal_blue} `,
            scrollbarWidth: 'thin',
          }),
      flexDirection: 'column',
      boxSizing: 'border-box',
      '&:focus': {
        outline: 'none',
      },
    },
  })
)

export const useScrolledRowStyles = createUseStyles(
  (theme: Theme & { showScroll: boolean }) => ({
    scrolledRow: {
      scrollbarGutter: 'stable',
      width: '100%',
      overflowX: 'auto',
      overflowY: 'hidden',

      ...(!theme.showScroll
        ? {
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '&::-webkit-scrollbar-track': {
              boxShadow: 'inset 0 0 5px grey',
              borderRadius: 10,
            },
            scrollbarWidth: 'none' /* Firefox 64 */,
            flexDirection: 'row',
          }
        : {
            '&::-webkit-scrollbar-track': {
              background: theme.colors.bright_purple,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.colors.royal_blue,
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: theme.colors.royal_blue,
            },
            scrollbarColor: `${theme.colors.royal_blue} ${theme.colors.royal_blue} `,
            scrollbarWidth: 'thin',
          }),
      '&:focus': {
        outline: 'none',
      },
    },
  })
)
