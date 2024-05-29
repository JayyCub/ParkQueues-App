import { Alert, Pressable, Text, TextInput, View, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { styles } from '../styles'
import React, { useState, useRef, useEffect } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
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

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Logged in
        const user = userCredential.user
        setUser(user)
        setEmail('')
        setPassword('')
        // Alert.alert('Login Successful', `User: ${user}`)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        Alert.alert('Login Failed', `${errorCode}: ${errorMessage}`)
      })
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
        ? <Pressable style={styles.authButton}>
          <Text style={styles.authButtonText}>Sign in</Text>
        </Pressable>
        : <Pressable onPress={handleSignIn} style={styles.authButtonReady}>
          <Text style={styles.authButtonReadyText}>Sign in</Text>
        </Pressable>}
    </View>
  )
}

export default Login
