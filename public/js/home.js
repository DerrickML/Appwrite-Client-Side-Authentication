// home.js
import {
  client,
  account,
  databases,
  Permission,
  Role,
  Query,
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
document
  .getElementById('createStudentProfileModal')
  .addEventListener('show.bs.modal', resetModalContent)

function resetModalContent () {
  // Reset the form
  document.getElementById('studentForm').reset()

  // Show the form and the addProfile button
  document.getElementById('studentForm').style.display = 'block'
  document.getElementById('addProfile').style.display = 'block'

  // Hide the spinner and success message
  document.getElementById('spinnerContainer').style.display = 'none'
  document.getElementById('successMessage').style.display = 'none'
}

async function onDocumentLoaded () {
  console.log(userInfo)
  console.log('userName:', userInfo?.name)
  updateUsernameDisplay(userInfo?.name)

  // Fetch student profiles
  const profiles = await fetchStudentProfiles()

// Get the container
const container = document.querySelector('.row.justify-content-center');

// Generate and append profile cards
profiles.forEach(profile => {
  container.innerHTML += generateProfileCard(profile);
});
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
      },
      [
        Permission.read(Role.user(parentID)),
        Permission.update(Role.user(parentID)),
        Permission.delete(Role.user(parentID)),
      ]
    )
    // [
    //     Permission.read(Role.user(parentID), Role.team('admin')),
    //     Permission.update(Role.user(parentID), Role.team('admin')),
    //     Permission.delete(Role.user(parentID), Role.team('admin')),
    //   ]
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

/********* LOAD PROFILES *************/
function generateProfileCard(profile) {
  // Extract the first letter from the first and second names
  const initials = `${profile.firstName.charAt(0)}${profile.secondName.charAt(0)}`;
  // Generate a random color
  const randomColor = getRandomColor();

  // Generate the HTML for the profile card with a circle for the initials
  // Now wrapped in a col-auto
  return `
    <div class="col-auto mb-3">
        <div class="profile-card text-center">
            <div class="initials-circle" style="background-color: ${randomColor};">${initials}</div>
            <h3>${profile.firstName}</h3>
            <p>${profile.class}</p>
        </div>
    </div>
  `;
}

// Function to generate a random color in hexadecimal format
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

async function fetchStudentProfiles() {
    try {
      // Build the query to filter profiles by parentID
      const query = [
        Query.equal('parID', userInfo.uID)
      ];
  
      // Fetch the profiles using the query
      const response = await databases.listDocuments(database_id, studentTable_id, query);
      return response.documents;
  
    } catch (error) {
      console.error('Error fetching student profiles:', error);
      return [];
    }
  }  
/*************************************/
