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
  const [passwordValid, setPasswordValid] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  const [firstNameValid, setFirstNameValid] = useState(false)
  const [lastNameValid, setLastNameValid] = useState(false)
  const { setUser } = useDataContext()

  const lastNameRef: React.MutableRefObject<any> = useRef(null)
  const emailRef: React.MutableRefObject<any> = useRef(null)
  const passwordRef: React.MutableRefObject<any> = useRef(null)
  const passwordVerifyRef: React.MutableRefObject<any> = useRef(null)

  useEffect(() => {
    if (
      password === passwordVerify &&
      passwordValid &&
      emailValid &&
      firstNameValid &&
      lastNameValid
    ) {
      setAllFieldsFilled(true)
    } else {
      setAllFieldsFilled(false)
    }
  }, [email, password, passwordVerify, firstName, lastName, passwordValid, emailValid, firstNameValid, lastNameValid])

  const handleRegister = (): void => {
    if (!validatePassword(password)) {
      setPasswordValid(false)
      return
    }
    if (!validateEmail(email)) {
      setEmailValid(false)
      return
    }
    if (firstName.trim() === '') {
      setFirstNameValid(false)
      return
    }
    if (lastName.trim() === '') {
      setLastNameValid(false)
      return
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        updateProfile(user, {
          displayName: firstName + ' ' + lastName
        }).then(() => {
          setFirstName('')
          setLastName('')
          setEmail('')
          setPassword('')
          setPasswordVerify('')
          setUser(null)
          setUser(user)
          // Alert.alert('Registration Successful', `Email: ${email}\nPassword: ${password}`)
        }).catch((error) => {
          console.error('Error changing account details', error)
        })
      })
      .catch((error) => {
        const errorCode = error.code
        // const errorMessage = error.message
        if (errorCode === 'auth/email-already-in-use') {
          Alert.alert('Email in use', 'An account already exists with this email address. ' +
            'Please use a different email or recover your password.')
        }
        console.log(error)
      })
  }

  const validatePassword = (password: string): boolean => {
    const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/
    return passwordCriteria.test(password)
  }

  const validateEmail = (email: string): boolean => {
    const emailCriteria = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailCriteria.test(email)
  }

  const handlePasswordChange = (password: string): void => {
    setPassword(password)
    setPasswordValid(validatePassword(password))
  }

  const handleEmailChange = (email: string): void => {
    setEmail(email)
    setEmailValid(validateEmail(email))
  }

  const handleFirstNameChange = (firstName: string): void => {
    setFirstName(firstName)
    setFirstNameValid(firstName.trim() !== '')
  }

  const handleLastNameChange = (lastName: string): void => {
    setLastName(lastName)
    setLastNameValid(lastName.trim() !== '')
  }

  return (
    <View style={styles.authCard}>
      <Text style={styles.authHeadingText}>Create an account</Text>
      <Text style={styles.authFieldText}>
        First name
      </Text>
      <View style={[styles.authInputField, firstNameValid ? styles.validField : null]}>
        <TextInput
          style={styles.authInputFieldText}
          value={firstName}
          onChangeText={handleFirstNameChange}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => lastNameRef.current.focus()}
        />
      </View>
      <Text style={styles.authFieldText}>
        Last name
      </Text>
      <View style={[styles.authInputField, lastNameValid ? styles.validField : null]}>
        <TextInput
          ref={lastNameRef}
          style={styles.authInputFieldText}
          value={lastName}
          onChangeText={handleLastNameChange}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current.focus()}
        />
      </View>
      <Text style={styles.authFieldText}>
        Email address
      </Text>
      <View style={[styles.authInputField, emailValid ? styles.validField : null]}>
        <TextInput
          ref={emailRef}
          style={styles.authInputFieldText}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current.focus()}
        />
      </View>
      <Text style={styles.authFieldText}>
        Password
      </Text>
      <View style={[styles.authInputField, passwordValid ? styles.validField : null]}>
        <TextInput
          ref={passwordRef}
          style={styles.authInputFieldText}
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordVerifyRef.current.focus()}
        />
      </View>
      <Text style={styles.authFieldText}>
        Confirm password
      </Text>
      <View style={[styles.authInputField, (password === passwordVerify && passwordVerify !== '')
        ? styles.validField
        : null]}>
        <TextInput
          ref={passwordVerifyRef}
          style={styles.authInputFieldText}
          value={passwordVerify}
          onChangeText={setPasswordVerify}
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="done"
          // onSubmitEditing={handleRegister}
        />
      </View>
      {!allFieldsFilled
        ? <Pressable style={styles.authButton} onPress={() => {
          Alert.alert('Please fill in all necessary fields.')
        }}>
          <Text style={styles.authButtonText}>Register</Text>
        </Pressable>
        : <Pressable onPress={handleRegister} style={styles.authButtonReady}>
          <Text style={styles.authButtonReadyText}>Register</Text>
        </Pressable>}
    </View>
  )
}

export default Register
