import React from 'react'
import { Button, button_purpleVariant } from '@components/Button'
import { buttonLightVariant } from '@components/Button'
import { useTheme } from '@components/theme'
import { Export } from '@components/icons'
import { useStyles } from './styles'
import { Camera } from '@components/icons'
import { CameraCard } from '@components/CameraCard'
export const Home = () => {
  const theme = useTheme()
  const classes = useStyles({ theme })
  return (
    <div className={classes.container}>
      <p>Welcome to the Home Page</p>
      <CameraCard ctx={{ theme }}>
        <Button
          ctx={{ theme }}
          onClick={() => {}}
          label="Export"
          variants={buttonLightVariant}
        >
          <Export width={16} height={16} />
        </Button>
        <Button
          ctx={{ theme }}
          onClick={() => {}}
          label="camera"
          variants={button_purpleVariant}
        >
          <Camera width={9} height={8} />
        </Button>
      </CameraCard>
    </div>
  )
}
