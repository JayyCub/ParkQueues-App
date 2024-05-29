import React, { useState } from 'react'
import { View, Button, TouchableWithoutFeedback, Keyboard, Text, ScrollView, Pressable } from 'react-native'
import Register from '../Components/Register'
import Login from '../Components/Login'
import { styles } from '../styles'
import { useDataContext } from '../Data/DataContext'
import { auth } from '../../firebaseConfig'

const AccountPage = ({ navigation }: any): React.JSX.Element => {
  const [isRegistering, setIsRegistering] = useState(false)
  const { user, setUser } = useDataContext()

  const toggleForm = (): void => {
    setIsRegistering(!isRegistering)
  }

  const logout = async (): Promise<void> => {
    setUser(null)
    auth.signOut().then()
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {user == null
        // NOT AUTHENTICATED
        ? <View style={styles.authContainer}>
          {isRegistering ? <Register /> : <Login />}
          <Button
            title={isRegistering ? 'Go to login' : 'Create new account'}
            onPress={toggleForm}
          />
        </View>
        // AUTHENTICATED
        : <ScrollView>
          <View style={styles.main}>
            <View style={styles.accountSectionView}>
              <Text style={styles.accountHeaderText}>
                Hello, {'' + user.displayName}
              </Text>
            </View>
            <Text style={styles.accountSubHeaderText}>Account options</Text>
            <Pressable onPress={logout} style={styles.signOutButton}>
              <Text style={styles.signOutButtonText}>
                Log out
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      }
    </TouchableWithoutFeedback>
  )
}

export default AccountPage
