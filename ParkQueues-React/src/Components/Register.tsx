import { Alert, Pressable, Text, TextInput, View } from 'react-native'
import { styles } from '../styles'
import React, { useState, useRef, useEffect } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { useDataContext } from '../Data/DataContext'

const Register = (): React.JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVerify, setPasswordVerify] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [allFieldsFilled, setAllFieldsFilled] = useState(false)
  const { setUser } = useDataContext()

  const lastNameRef: React.MutableRefObject<any> = useRef(null)
  const emailRef: React.MutableRefObject<any> = useRef(null)
  const passwordRef: React.MutableRefObject<any> = useRef(null)
  const passwordVerifyRef: React.MutableRefObject<any> = useRef(null)

  useEffect(() => {
    if (
      email.length > 0 &&
      password.length > 0 &&
      passwordVerify.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      password === passwordVerify
    ) {
      setAllFieldsFilled(true)
    } else {
      setAllFieldsFilled(false)
    }
  }, [email, password, passwordVerify, firstName, lastName])

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        updateProfile(user, {
          displayName: firstName + ' ' + lastName
        }).then(() => {
          setUser(auth.currentUser!)
          setFirstName('')
          setLastName('')
          setEmail('')
          setPassword('')
          setPasswordVerify('')
          Alert.alert('Registration Successful', `Email: ${email}\nPassword: ${password}`)
        })
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        Alert.alert('Registration Failed', `${errorCode}: ${errorMessage}`)
      })
  }

  return (
    <View style={styles.authCard}>
      <Text style={styles.authHeadingText}>Create an account</Text>
      <Text style={styles.authFieldText}>
        First name
      </Text>
      <TextInput
        style={styles.authInput}
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => lastNameRef.current.focus()}
      />
      <Text style={styles.authFieldText}>
        Last name
      </Text>
      <TextInput
        ref={lastNameRef}
        style={styles.authInput}
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current.focus()}
      />
      <Text style={styles.authFieldText}>
        Email address
      </Text>
      <TextInput
        ref={emailRef}
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
        returnKeyType="next"
        onSubmitEditing={() => passwordVerifyRef.current.focus()}
      />
      <Text style={styles.authFieldText}>
        Confirm password
      </Text>
      <TextInput
        ref={passwordVerifyRef}
        style={styles.authInput}
        value={passwordVerify}
        onChangeText={setPasswordVerify}
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="done"
        // onSubmitEditing={handleRegister}
      />
      {!allFieldsFilled
        ? <Pressable style={styles.authButton}>
          <Text style={styles.authButtonText}>Register</Text>
        </Pressable>
        : <Pressable onPress={handleRegister} style={styles.authButtonReady}>
          <Text style={styles.authButtonReadyText}>Register</Text>
        </Pressable>}
    </View>
  )
}

export default Register
