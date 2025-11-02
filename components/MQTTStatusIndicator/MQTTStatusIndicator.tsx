import React from 'react'
import { Theme } from '@components/theme'
import { createUseStyles } from 'react-jss'

interface MQTTStatusIndicatorProps {
  isConnected: boolean
  theme: Theme
}

const useStyles = createUseStyles((theme: Theme) => ({
  statusContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    marginTop: '10px',
    transition: 'all 0.3s ease',
  },
  connected: {
    backgroundColor: '#10b98120',
    color: '#10b981',
    border: '1px solid #10b981',
  },
  disconnected: {
    backgroundColor: theme.colors.flame + '20',
    color: theme.colors.flame,
    border: `1px solid ${theme.colors.flame}`,
  },
  indicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    animation: '$pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
    '100%': {
      opacity: 1,
    },
  },
}))

export const MQTTStatusIndicator: React.FC<MQTTStatusIndicatorProps> = ({
  isConnected,
  theme,
}) => {
  const classes = useStyles({ theme })

  return (
    <div
      className={`${classes.statusContainer} ${
        isConnected ? classes.connected : classes.disconnected
      }`}
    >
      <div
        className={classes.indicator}
        style={{
          backgroundColor: isConnected ? '#10b981' : theme.colors.flame,
        }}
      />
      <span>
        {isConnected
          ? 'MQTT Connecté - Temps réel actif'
          : 'MQTT Déconnecté - Reconnexion...'}
      </span>
    </div>
  )
}
