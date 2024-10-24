import React, { useEffect, useState } from 'react'
import { Text, Pressable, Linking, AppState, type AppStateStatus } from 'react-native'
import { styles } from '../../styles'

const OpenSettingsButton = ({ getLocationData }: { getLocationData: () => Promise<void> }): React.JSX.Element => {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState)

  const handleAppStateChange = (nextAppState: AppStateStatus): void => {
    if ((appState.match(/inactive|background/) != null) && nextAppState === 'active') {
      // When the app comes back to the foreground, call getLocationData
      // console.log('App has come back to the foreground. Checking location data...')
      getLocationData().catch((err) => { console.error('Error fetching location data after returning from settings:', err) })
    }
    setAppState(nextAppState)
  }

  useEffect(() => {
    // console.log(appState)
    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription.remove()
    }
  }, [appState])

  const openAppSettings = async (): Promise<void> => {
    try {
      await Linking.openSettings()
    } catch (err) {
      console.error('Failed to open app settings:', err)
    }
  }

  return (
      <Pressable onPress={openAppSettings} style={[styles.signOutButton, { marginTop: 0 }]}>
        <Text style={styles.signOutButtonText}>
          Go to settings
        </Text>
      </Pressable>
  )
}

export default OpenSettingsButton
