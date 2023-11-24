// Import statements
import {
  account,
  databases,
  database_id,
  parentsTable_id
} from './appwriteConfig.js'

//VARS
let accountDetails

// DOM Elements
const elements = {
  signupForm: document.getElementById('signupForm'),
  loginForm: document.getElementById('loginForm'),
  signupEmail: document.getElementById('signupEmail'),
  signupPassword: document.getElementById('signupPassword'),
  signupPhone: document.getElementById('signupPhone'),
  firstName: document.getElementById('firstName'),
  secondName: document.getElementById('secondName'),
  loginEmail: document.getElementById('loginEmail'),
  signupPassCode: document.getElementById('signupPassCode'),
  loginPassword: document.getElementById('loginPassword'),
  signupLoader: document.getElementById('signupLoader'),
  loginLoader: document.getElementById('loginLoader')
}

// Utility Functions
function toggleLoader (loaderElement, show) {
  loaderElement.style.visibility = show ? 'visible' : 'hidden'
}

// Encrypt Pass-code
async function encryptPasscode (passcode) {
  const response = await fetch('https://mf7l86-3000.csb.app/encrypt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ passcode: passcode })
  })
  const data = await response.json()
  return data.encryptedData
}

async function fetchAccountDetails () {
  console.log('Fetching User Account Details')
  const response = await account.get()
  console.log('The User Account Details:', response)
  return response
}

function handleAccountDetails (accountDetails, redirectURL) {
  const uID = accountDetails.$id
  console.log(uID)

  if (accountDetails.status) {
    localStorage.setItem(
      'userInfo',
      JSON.stringify({
        uID,
        name: accountDetails.name,
        labels: accountDetails.labels,
        email: accountDetails.email,
        phone: accountDetails.phone,
        emailVerification: accountDetails.emailVerification,
        phoneVerification: accountDetails.phoneVerification
      })
    )

    window.location.href = redirectURL
  } else {
    // Handle the case where account details are not in the expected status
  }
}

// Authentication Functions
async function performSignup ({ email, password, firstName }) {
  localStorage.clear()
  const response = await account.create('unique()', email, password, firstName)
  console.log('Signup is successful:', response)
  return response
}

async function performLogin ({ email, password }) {
  localStorage.clear()

  const response = await account.createEmailSession(email, password)
  console.log('Logging in successful:', response)
  localStorage.setItem('sessionData', JSON.stringify(response))

  accountDetails = await fetchAccountDetails()

  alert('Login func run successfully')
  return response
}

async function updatePhone ({phone, password}) {
  const response = await account.updatePhone(phone, password)
  console.log('Phone update status:', response)
  return response
}

// Document Creation Function on server-side
async function createParentDoc({parent_ID, firstName, secondName, email, phoneNumber, passCode}) {
  // const response = await fetch('http://localhost:3000/createParentDoc', {
    const response = await fetch('https://mf7l86-3000.csb.app/createParentDoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ parent_ID, firstName, secondName, email, phoneNumber, passCode })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

// Event Handlers
async function onSignupSubmit(e) {
  e.preventDefault()
  const submitButton = e.target.querySelector('button[type="submit"]')
  submitButton.disabled = true
  toggleLoader(elements.signupLoader, true)

  const signupData = {
    email: elements.signupEmail.value,
    password: elements.signupPassword.value,
    firstName: elements.firstName.value,
    secondName: elements.secondName.value,
    phone: elements.signupPhone.value,
    passCode: elements.password.value,
    parent_ID: accountDetails.$id,
  }

  try {
    // create account
    const signUpStatus = await performSignup(signupData)
    console.log('SignUp status: ' + signUpStatus.status)
    alert('Account Creation Finished! ... SignUp status: ' + signUpStatus.status)

    // Create account session
    const loginResponse = await performLogin(signupData)
    console.log('login data: ' + loginResponse)
    alert('Logged in successfully')

    // Update phone number
    const phoneUpdateResponse = await updatePhone(signupData)
    console.log('update phone: ' + phoneUpdateResponse)

    //Create account doc in parent collection
    const parentDocResponse = await createParentDoc(signupData)
    console.log('create parent doc: ' + parentDocResponse)    

    //Redirect to profile page
    handleAccountDetails(accountDetails, 'profileSelect.html')

  } catch (error) {
    alert('Error at Signup: ' + error.message)
  } finally {
    toggleLoader(elements.signupLoader, false)
    submitButton.disabled = false
  }
}

async function onLoginSubmit(e) {
  e.preventDefault()
  const submitButton = e.target.querySelector('button[type="submit"]')
  submitButton.disabled = true
  toggleLoader(elements.loginLoader, true)

  const loginData = {
    email: elements.loginEmail.value,
    password: elements.loginPassword.value
  }

  try {
    await performLogin(loginData)
    handleAccountDetails(accountDetails, 'profileSelect.html')
  } catch (error) {
    alert('Error: ' + error.message)
  } finally {
    toggleLoader(elements.loginLoader, false)
    submitButton.disabled = false
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  toggleLoader(elements.signupLoader, false)
  toggleLoader(elements.loginLoader, false)
})

elements.signupForm.addEventListener('submit', onSignupSubmit)
elements.loginForm.addEventListener('submit', onLoginSubmit)