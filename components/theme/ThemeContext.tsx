import { createContext, FC, ReactNode, useContext, useMemo } from 'react'
import { defaultTheme, Theme } from './Theme'

const ThemeContext = createContext<Theme | undefined>(undefined)

export const useTheme = (): Theme => {
  const themeContext = useContext(ThemeContext)
  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return themeContext
}

type ThemeProviderProps = {
  children: ReactNode
  value?: Partial<Theme>
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const theme: Theme = useMemo(() => ({ ...defaultTheme }), [defaultTheme])

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
