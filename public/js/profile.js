import { client, account } from './appwriteConfig.js'
import './logout.js'

// DOM Elements
const homeButton = document.getElementById('homeButton')
const verifyEmailButton = document.getElementById('verifyEmailButton')
const verifyPhoneButton = document.getElementById('verifyPhoneButton')
const secretCodeModal = document.getElementById('secretCodeModal')
const secretCodeButton = document.getElementById('secretCodeButton')
const verifyCancelButton = document.getElementById('verifyCancelButton')
const usernameElement = document.getElementById('username')
const userEmailElement = document.getElementById('userEmail')
const userPhoneElement = document.getElementById('userPhone')
const userLabelElement = document.getElementById('userLabel')
const adminLinkElement = document.getElementById('admin-link')
const emailVerificationStatusElement = document.getElementById(
  'emailVerificationStatus'
)
const phoneVerificationStatusElement = document.getElementById(
  'phoneVerificationStatus'
)

// Event Listeners
document.addEventListener('DOMContentLoaded', onDocumentLoaded)
homeButton?.addEventListener(
  'click',
  () => (window.location.href = 'home.html')
)
verifyEmailButton?.addEventListener('click', handleEmailVerificationClick)
verifyPhoneButton?.addEventListener('click', handlePhoneVerificationClick)
secretCodeButton?.addEventListener('click', handleSecretCodeVerificationClick)

//User data
const user = JSON.parse(localStorage.getItem('userInfo'))
const userID = user.uID

function onDocumentLoaded () {
  try {
    console.log('User Information: ' + user)
    if (user) {
      populateUserInfo(user)
      checkEmailVerificationStatus(user)
      checkPhoneVerificationStatus(user)
    } else {
      console.error('No user information found in localStorage.')
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error.message)
  }
}

function populateUserInfo (user) {
  usernameElement.innerText = user.name
  userEmailElement.innerText = user.email
  userPhoneElement.innerText = user.phone
  populateUserLabels(user.labels)
  populateAdminLink(user.labels)
}

function populateUserLabels (labels) {
  console.log('Populating user labels: ' + labels.join(', '))
  if (labels && labels.length > 0) {
    userLabelElement.innerHTML = labels.join(', ')
  } else {
    userLabelElement.style.display = 'none'
  }
}

function populateAdminLink (labels) {
  if (labels && labels.includes('admin')) {
    adminLinkElement.innerHTML =
      '<a href="admin.html" class="btn btn-primary">View All Users</a>'
  }
}

function checkEmailVerificationStatus (user) {
  //check email verification status
  console.log('Email Verification:', user?.emailVerification)
  if (user?.emailVerification) {
    emailVerificationStatusElement.textContent = 'Verified ✅'
    verifyEmailButton.style.display = 'none'
  } else {
    emailVerificationStatusElement.textContent = 'Not Verified ❌'
    verifyEmailButton.style.display = 'block'
  }
}

function checkPhoneVerificationStatus (user) {
  //Check phone verification status
  console.log('Phone Verification:', user?.phoneVerification)
  if (user?.phoneVerification) {
    phoneVerificationStatusElement.textContent = 'Verified ✅'
    secretCodeModal.style.display = 'none'
  } else {
    phoneVerificationStatusElement.textContent = 'Not Verified ❌'
    verifyPhoneButton.style.display = 'block'
    secretCodeModal.style.display = 'block'
  }
}

async function handleEmailVerificationClick () {
  try {
    await verifyEmail()
  } catch (error) {
    console.error('Error:', error)
    alert('Error sending verification email: ' + error.message)
  }
}

async function handlePhoneVerificationClick () {
  console.log('HandlePhone Verif-- UserID: ' + user.uID)
  try {
    await verifyPhone()
  } catch (error) {
    console.error('Error:', error)
    alert('Error sending verification email: ' + error.message)
  }
}

async function handleSecretCodeVerificationClick () {
  const verificationCodeInput = document.getElementById('verificationCode')
  const loadingText = document.getElementById('loadingText')
  const errorText = document.getElementById('errorText')
  const verifyPhoneButton = document.getElementById('verifyPhoneButton')

  // Disable the input and show the loading animation
  verificationCodeInput.disabled = true
  loadingText.style.display = 'block'

  console.log('HandlePhoneCode Verif-- UserID: ' + user.uID)
  try {
    // Verification code
    const secretCode = verificationCodeInput.value
    await verificationCode(userID, secretCode)

    // On success
    alert('Your phone number is verified!')
    phoneVerificationStatusElement.textContent =
      'Changes will reflect on next login 🔄 '
    verifyPhoneButton.style.display = 'none'
    secretCodeModal.style.display = 'none'
    secretCodeButton.style.display = 'none'
    verifyCancelButton.textContent = 'Close'
  } catch (error) {
    console.error('Error:', error)
    errorText.textContent = 'Please check if the code is correct and try again.'
    errorText.style.display = 'block'
  } finally {
    // Re-enable the input and hide the loading animation
    verificationCodeInput.disabled = false
    loadingText.style.display = 'none'
  }
}

async function verifyEmail () {
  try {
    const response = await account.createVerification(
      'derrickml.github.io/Appwrite-Client-Side-Authentication/public/verify.html'
    )
    // const response = await account.createVerification(
    //   'http://localhost:5501/public/verify.html'
    // )
    // const response = await account.createVerification(
    //   'http://192.168.100.12:5501/public/verify.html'
    // )
    console.log('Sending verification link ...')
    console.log(response)
    emailVerificationStatusElement.textContent =
      'Changes will reflect on next login when email verification is accomplished 🔄 '
      verifyEmailButton.style.display = 'none'
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function verifyPhone () {
  try {
    const response = await account.createPhoneVerification()
    console.log('Sending verification link ...')
    console.log(response)
    verifyPhoneButton.style.display = 'none'
    secretCodeButton.style.display = 'block'

    // Open the modal on success
    // const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
    // modal.show();
  } catch (error) {
    console.log(error)
    alert(
      'Error occurred. Please try again later or check if the phone number is correct.'
    )
  }
}

async function verificationCode (userID, secretCode) {
  console.log('Verification code: ' + secretCode)
  console.log('User ID: ' + userID)
  try {
    const response = await account.updatePhoneVerification(userID, secretCode)
    console.log('Verifying ...')
    console.log(response)
  } catch (error) {
    console.log('Verification Failed!')
    alert('Verification Failed')
    console.log(error)
    throw error
  }
}
