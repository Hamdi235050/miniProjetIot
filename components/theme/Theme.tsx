import { boxShadow, BoxShadow } from './boxShadow'
import { colors, Colors } from './colors'

export type Theme = {
  colors: Colors
  boxShadow: BoxShadow
}
export const defaultTheme: Theme = {
  colors,
  boxShadow,
}
