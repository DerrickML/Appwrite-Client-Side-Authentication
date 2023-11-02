// home.js
import {
  client,
  account,
  databases,
  database_id,
  studentTable_id
} from './appwriteConfig.js'
import './logout.js'

// Retrieve user info from localStorage
const userInfo = JSON.parse(localStorage.getItem('userInfo'))

// DOM Elements
const profileButton = document.getElementById('profileButton')
const usernameDisplay = document.getElementById('username')
const saveProfileButton = document.getElementById('addProfile')

// Event Listeners
document.addEventListener('DOMContentLoaded', onDocumentLoaded)
saveProfileButton?.addEventListener('click', saveStudentProfile)
profileButton?.addEventListener(
  'click',
  () => (window.location.href = 'profile.html')
)
document.getElementById('createStudentProfileModal').addEventListener('show.bs.modal', resetModalContent);

function resetModalContent() {
    // Reset the form
    document.getElementById('studentForm').reset();
    
    // Show the form and the addProfile button
    document.getElementById('studentForm').style.display = 'block';
    document.getElementById('addProfile').style.display = 'block';
    
    // Hide the spinner and success message
    document.getElementById('spinnerContainer').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

function onDocumentLoaded () {
  console.log(userInfo)
  console.log('userName:', userInfo?.name)
  updateUsernameDisplay(userInfo?.name)
}

function updateUsernameDisplay (name) {
  usernameDisplay.innerText = name ? `${name}!` : 'User!'
}

function formatStudentClass (studClass) {
  switch (studClass) {
    case 'Primary 7':
      return 'Primary_7'
    case 'Senior 4':
      return 'Senior_4'
    case 'Senior 6':
      return 'Senior_6'
    default:
      return studClass // return original value if no match
  }
}

async function saveStudentProfile () {
  // Hide the form and show the spinner, and hide the submit button too
  document.getElementById('studentForm').style.display = 'none'
  document.getElementById('addProfile').style.display = 'none'
  document.getElementById('spinnerContainer').style.display = 'block'

  // Get the values from the form fields
  const firstName = document.getElementById('firstName').value
  const secondName = document.getElementById('secondName').value
  const otherName = document.getElementById('otherName').value
  const schoolName = document.getElementById('schoolName').value
  const schoolAddress = document.getElementById('schoolAddress').value
  const gender = document.getElementById('gender').value
  let studClass = document.getElementById('studentClass').value // Made it let since we'll be modifying it
  const studentPassCode = document.getElementById('studentPassCode').value

  // Format the studClass value
  studClass = formatStudentClass(studClass)

  // ParentID value
  const parentID = userInfo.uID
  console.log('ParentID: ' + parentID)

  //Encrypted Pass-code
  const encryptedPassCode = await encryptPasscode(studentPassCode)

  // Call the createStudent function
  createStudent(
    parentID,
    firstName,
    secondName,
    otherName,
    schoolName,
    schoolAddress,
    gender,
    studClass,
    encryptedPassCode
  )
}

async function createStudent (
  parentID,
  firstName,
  secondName,
  otherName,
  schoolName,
  schoolAddress,
  gender,
  studClass,
  studentPassCode
) {
  try {
    const response = await databases.createDocument(
      database_id,
      studentTable_id,
      'unique()',
      {
        parID: parentID,
        class: studClass,
        firstName: firstName,
        secondName: secondName,
        otherName: otherName,
        gender: gender,
        schoolName: schoolName,
        schoolAddress: schoolAddress,
        studPassCode: studentPassCode
      }
    )
    // Hide the spinner and show the success message
    document.getElementById('spinnerContainer').style.display = 'none'
    document.getElementById('successMessage').style.display = 'block'

    console.log(response)
  } catch (error) {
    console.error('Error creating student:', error)

    // Hide the spinner and show the form again
    document.getElementById('spinnerContainer').style.display = 'none'
    document.getElementById('addProfile').style.display = 'block'
    document.getElementById('studentForm').style.display = 'block'

    // Inform the user about the error
    alert('There was an error creating the student profile. Please try again.')
  }
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
