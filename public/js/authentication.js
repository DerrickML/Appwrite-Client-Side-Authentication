import { client, account } from './appwriteConfig.js'

// Declare the variables at the top of your script
let signup_email, signup_password, signup_phone, signup_username

// DOM Elements
const signupForm = document.getElementById('signupForm')
const loginForm = document.getElementById('loginForm')
const signupEmail = document.getElementById('signupEmail')
const signupPassword = document.getElementById('signupPassword')
const signupPhone = document.getElementById('signupPhone')
const signupUsername = document.getElementById('signupUsername')
const loginEmail = document.getElementById('loginEmail')
const loginPassword = document.getElementById('loginPassword')
const signupLoader = document.getElementById('signupLoader')
const loginLoader = document.getElementById('loginLoader')

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeVariables)
signupForm.addEventListener('submit', onSignupSubmit)
loginForm.addEventListener('submit', onLoginSubmit)

// Function to initialize the global variables
function initializeVariables () {
  signup_email = signupEmail.value
  signup_password = signupPassword.value
  signup_phone = signupPhone.value
  signup_username = signupUsername.value
}

// Function Definitions
// function toggleLoader(loader, toggle) {
//   loader.style.display = toggle ? 'inline-block' : 'none';
// }

async function onSignupSubmit (e) {
  e.preventDefault()

  // toggleLoader(signupLoader, true);

  // Function call to update global variables
  initializeVariables()

  try {
    console.log('SignUp email: ' + signup_email)
    await performSignup(signup_email, signup_password, signup_username)
    await performLogin(signup_email, signup_password)
    await updatePhone(signup_phone, signup_password)
    const accountDetails = await fetchAccountDetails()
    alert('Debugging at Signup ...')
    handleAccountDetails(accountDetails, 'home.html')
  } catch (error) {
    alert('Error at Signup: ' + error.message)
  }

  // toggleLoader(signupLoader, false);
}

async function onLoginSubmit (e) {
  e.preventDefault()

  const email = loginEmail.value
  const password = loginPassword.value

  // toggleLoader(loginLoader, true);

  try {
    await performLogin(email, password)
    const accountDetails = await fetchAccountDetails()
    handleAccountDetails(accountDetails, 'home.html')
  } catch (error) {
    alert('Error: ' + error.message)
  }

  // toggleLoader(loginLoader, false);
}

async function performSignup (email, password, name) {
  localStorage.clear()
  const response = await account.create('unique()', email, password, name)
  console.log('Signup is successful:', response)
  return response
}

async function performLogin (email, password) {
  localStorage.clear()
  const response = await account.createEmailSession(email, password)
  console.log('Logging in successful:', response)
  localStorage.setItem('sessionData', JSON.stringify(response))
  return response
}

async function updatePhone (signup_phone, signup_password) {
  const response = await account.updatePhone(signup_phone, signup_password)
  console.log('Phone update status:', response)
  return response
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

    alert('Logging in ...')
    window.location.href = redirectURL
  } else {
    alert(JSON.stringify(accountDetails))
  }
}
