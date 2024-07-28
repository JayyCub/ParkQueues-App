import React, { useState, useEffect } from 'react'
import { View, TouchableWithoutFeedback, Keyboard, Text, ScrollView, Pressable, Alert, Linking } from 'react-native'
import Register from '../Components/Register'
import Login from '../Components/Login'
import { fontFamily, styles } from '../styles'
import { useDataContext } from '../Data/DataContext'
import { auth } from '../../firebaseConfig'
import { sendPasswordResetEmail } from 'firebase/auth'

const AccountPage = (): React.JSX.Element => {
  const [isRegistering, setIsRegistering] = useState(false)
  const { user, setUser } = useDataContext()
  const [userDisplayName, setUserDisplayName] = useState(user?.displayName ?? '')

  useEffect(() => {
    if (user != null) {
      setUserDisplayName(user.displayName ?? '')
    }
  }, [user])

  const toggleForm = (): void => {
    setIsRegistering(!isRegistering)
  }

  const logout = async (): Promise<void> => {
    Alert.alert('Are you sure you want to sign out?', '', [
      {
        text: 'Yes',
        onPress: () => {
          setUser(null)
          auth.signOut().then().catch((error) => {
            console.log(error)
          })
        }
      },
      { text: 'Cancel' }
    ])
  }

  const resetPassword = async (): Promise<void> => {
    Alert.alert('Are you sure you want to reset your password?', '', [
      {
        text: 'Yes',
        onPress: () => {
          if (auth?.currentUser?.email != null) {
            sendPasswordResetEmail(auth, auth.currentUser.email)
              .then(() => {
                Alert.alert('Check your email',
                  'If we have an account for your email address, we will send an email with further instructions.')
              })
              .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                Alert.alert(errorCode, errorMessage)
              })
          } else {
            Alert.alert('Could not send email.', 'There is no email address connected to your account')
          }
        }
      },
      { text: 'Cancel' }
    ])
  }

  const handleFeedbackPress = (): void => {
    const url = 'https://docs.google.com/forms/d/e/1FAIpQLSeLUZL3mhlKdwjTq6XSSdlEwIjfvVYjmGBOvdXzBt05fM6DHw/viewform?usp=sf_link'
    Linking.openURL(url).catch((err) => { console.error('Failed to open URL:', err) })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {(user?.displayName == null)
        // NOT AUTHENTICATED
        ? <View style={styles.authContainer}>
          {isRegistering ? <Register /> : <Login />}
          <Pressable onPress={toggleForm} style={{
            backgroundColor: 'white',
            borderRadius: 25,
            shadowColor: '#aeb5be',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 1,
            height: 30,
            width: '66%',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10
          }}>
            <Text style={{
              fontFamily,
              fontSize: 18
            }}>
              {isRegistering ? 'Go to login' : 'Create new account'}</Text>
          </Pressable>
        </View>
        // AUTHENTICATED
        : <ScrollView>
          <View style={styles.main}>
            <View style={styles.accountSectionView}>
              <Text style={styles.accountHeaderText}>
                Hello, {userDisplayName}
              </Text>
            </View>
            <Text style={styles.accountSubHeaderText}>Account options</Text>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <Pressable onPress={resetPassword} style={styles.signOutButton}>
              <Text style={styles.signOutButtonText}>
                Reset password
              </Text>
            </Pressable>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <Pressable onPress={logout} style={styles.signOutButton}>
              <Text style={styles.signOutButtonText}>
                Log out
              </Text>
            </Pressable>

            <Text style={[styles.accountSubHeaderText, { marginTop: 50 }]}>Got feedback for the app? Found a problem?</Text>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <Pressable onPress={handleFeedbackPress} style={styles.signOutButton}>
              <Text style={styles.signOutButtonText}>
                Send a message!
              </Text>
            </Pressable>

            <Text style={[styles.accountSubHeaderText, { marginTop: 50 }]}>If you have enjoyed your experience with the ParkQueues app, write us a review on your app store and share your experience!</Text>

          </View>
        </ScrollView>
      }
    </TouchableWithoutFeedback>
  )
}

export default AccountPage
