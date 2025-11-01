import { Variants } from '@components/Button/styles'
import { Theme } from '@components/theme'

export const buttonLightVariant = (theme: Theme): Variants => ({
  backgroundColor: theme.colors.light,
  color: theme.colors.dark_gray,
})
export const button_purpleVariant = (theme: Theme): Variants => ({
  backgroundColor: theme.colors.bright_purple,
  color: theme.colors.white,
})
