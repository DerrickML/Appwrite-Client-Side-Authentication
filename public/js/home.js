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

function onDocumentLoaded () {
    console.log(userInfo)
  console.log('userName:', userInfo?.name)
  updateUsernameDisplay(userInfo?.name)
}

function updateUsernameDisplay (name) {
  usernameDisplay.innerText = name ? `${name}!` : 'User!'
}

function formatStudentClass(studClass) {
    switch (studClass) {
        case 'Primary 7':
            return 'Primary_7';
        case 'Senior 4':
            return 'Senior_4';
        case 'Senior 6':
            return 'Senior_6';
        default:
            return studClass; // return original value if no match
    }
}

function saveStudentProfile() {
    // Get the values from the form fields
    const firstName = document.getElementById('firstName').value;
    const secondName = document.getElementById('secondName').value;
    const otherName = document.getElementById('otherName').value;
    const schoolName = document.getElementById('schoolName').value;
    const schoolAddress = document.getElementById('schoolAddress').value;
    const gender = document.getElementById('gender').value;
    let studClass = document.getElementById('studentClass').value; // Made it let since we'll be modifying it
    const studentPassCode = document.getElementById('studentPassCode').value;

    // Format the studClass value
    studClass = formatStudentClass(studClass);

    // Assuming you have a parentID value, for this example, I'll set it to a placeholder value
    const parentID = userInfo.uID;
    console.log('ParentID: ' + parentID);

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
        studentPassCode
    );
}

async function createStudent (
  parentID,
  firstName,
  secondName,
  otherName,
  schooolName,
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
        firstName: firstName,
        secondName: secondName,
        otherName: otherName,
        schooolName: schooolName,
        schoolAddress: schoolAddress,
        gender: gender,
        class: studClass,
        studPassCode: studentPassCode
      }
    )
    // Handle the response, e.g., close the modal or show a success message
  } catch (error) {
    console.error('Error creating student:', error)
    // Inform the user about the error
    alert('There was an error creating the student profile. Please try again.')
  }
}
