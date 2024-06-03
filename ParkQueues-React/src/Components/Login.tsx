import { Alert, Pressable, Text, TextInput, View } from 'react-native'
import { colorPalette, fontFamily, styles } from '../styles'
import React, { useState, useRef, useEffect } from 'react'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { useDataContext } from '../Data/DataContext'

const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [allFieldsFilled, setAllFieldsFilled] = useState(false)
  const { setUser } = useDataContext()

  const passwordRef: React.MutableRefObject<any> = useRef(null)

  useEffect(() => {
    if (email.length > 0 && password.length > 0) {
      setAllFieldsFilled(true)
    } else {
      setAllFieldsFilled(false)
    }
  }, [email, password])

  const handleSignIn = (): void => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Logged in
        const user = userCredential.user
        setUser(user)
        setEmail('')
        setPassword('')
        // Alert.alert('Login Successful', `User: ${user}`)
      })
      .catch((/* error */) => {
        // const errorCode = error.code
        // const errorMessage = error.message
        Alert.alert('Incorrect email or password', 'Please try again.')
        setPassword('')
      })
  }

  const forgotPassword = (): void => {
    if (email === '') {
      Alert.alert('Please enter your email.', 'Enter your email and try again.')
      return
    }
    Alert.alert('Are you sure you want to reset your password?', '', [
      {
        text: 'Yes',
        onPress: () => {
          sendPasswordResetEmail(auth, email)
            .then(() => {
              Alert.alert('Check your email',
                'If we have an account for your email address, we will send an email with further instructions.\n\n' +
                'Please be patient, this may take just a minute or two.')
            })
            .catch((error) => {
              const errorCode = error.code
              const errorMessage = error.message
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              Alert.alert(errorCode, errorMessage)
            })
        }
      },
      { text: 'Cancel' }
    ])
  }

  return (
    <View style={styles.authCard}>
      <Text style={styles.authHeadingText}>Welcome back!</Text>
      <Text style={styles.authFieldText}>
        Email address
      </Text>
      <TextInput
        style={styles.authInput}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <Text style={styles.authFieldText}>
        Password
      </Text>
      <TextInput
        ref={passwordRef}
        style={styles.authInput}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="done"
      />
      {!allFieldsFilled
        ? <Pressable style={styles.authButton} onPress={() => {
          Alert.alert('Please fill in all necessary fields.')
        }}>
          <Text style={styles.authButtonText}>Sign in</Text>
        </Pressable>
        : <Pressable onPress={handleSignIn} style={styles.authButtonReady}>
          <Text style={styles.authButtonReadyText}>Sign in</Text>
        </Pressable>}
      <Pressable style={styles.resetPasswordButton} onPress={forgotPassword}>
        <Text style={{ fontFamily, color: colorPalette.layer2, fontSize: 16 }}>Reset password</Text>
      </Pressable>
    </View>
  )
}

export default Login
