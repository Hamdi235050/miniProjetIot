import { Theme } from '@components/theme'
import { useStyles, Variants } from './styles'

export const Button = ({
  label,
  onClick,
  children,
  variants,
  ctx,
}: {
  label: string
  onClick: () => void
  children?: React.ReactNode
  variants: (theme: Theme) => Variants
  ctx: {
    theme: Theme
  }
}) => {
  const { theme } = ctx
  const extendedTheme: Theme & { variants: Variants } = {
    ...theme,
    variants: variants(theme),
  }
  const classes = useStyles({ theme: extendedTheme })
  return (
    <div>
      <button className={classes.button} onClick={onClick}>
        {children}
        <span> {label}</span>
      </button>
    </div>
  )
}
