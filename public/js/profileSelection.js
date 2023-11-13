// profileSelection.js
import {
  client,
  account,
  databases,
  Permission,
  Role,
  Query,
  database_id,
  studentTable_id,
  parentsTable_id
} from './appwriteConfig.js'

// Declare profiles globally
let profiles = []
const profileLoader = document.getElementById('profileLoader')

function toggleLoader (loaderElement, show) {
    loaderElement.style.visibility = show ? 'visible' : 'hidden'
  }

// Function to query the parents table for admin profile
async function getAdminProfile () {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const adminId = userInfo.uID
  try {
    const result = await databases.listDocuments(database_id, parentsTable_id, [
      Query.equal('parID', adminId)
    ])
    if (result.documents.length > 0) {
      const adminProfile = result.documents[0]
      return {
        id: adminProfile.$id,
        name: `${adminProfile.firstName} ${adminProfile.secondName}`,
        initials: `${adminProfile.firstName[0]}${adminProfile.secondName[0]}`,
        passcode: adminProfile.passCode,
        redirectUrl: 'home.html'
      }
    }
  } catch (error) {
    console.error('Error fetching admin profile:', error)
  }
  return null
}

// Function to query the students table for student profiles
async function getStudentProfiles () {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const adminId = userInfo.uID
  try {
    const result = await databases.listDocuments(database_id, studentTable_id, [
      Query.equal('parID', adminId)
    ])
    return result.documents.map(student => ({
      id: student.$id,
      name: `${student.firstName} ${student.secondName}`,
      initials: `${student.firstName[0]}${student.secondName[0]}`,
      passcode: student.studPassCode,
      redirectUrl: 'student.html'
    }))
  } catch (error) {
    console.error('Error fetching student profiles:', error)
  }
  return []
}

// Function to populate profiles on the page
async function populateProfiles () {
  const profileList = document.getElementById('profileList')
  const adminProfile = await getAdminProfile()
  console.log('Admin profile:', adminProfile)
  const studentProfiles = await getStudentProfiles()
  profiles = adminProfile ? [adminProfile, ...studentProfiles] : studentProfiles

  profiles.forEach(profile => {
    const colDiv = document.createElement('div')
    colDiv.className = 'col-auto mb-3' // Bootstrap classes for grid columns and margin bottom

    const profileElement = document.createElement('div')
    profileElement.className = 'profile text-center' // Center text for names
    profileElement.innerHTML = `
        <div class="profile-circle" onclick="selectProfile('${profile.id}')">${profile.initials}</div>
        <div class="profile-name">${profile.name}</div>
      `
    colDiv.appendChild(profileElement)
    profileList.appendChild(colDiv)
  })
}

// Function to handle profile selection
window.selectProfile = async profileId => {
  const selectedProfile = profiles.find(profile => profile.id === profileId)
  if (!selectedProfile) {
    console.error('Profile not found')
    return
  }

  // Show modal to enter passcode
  const passcodeModal = new bootstrap.Modal(
    document.getElementById('passcodeModal')
  )
  passcodeModal.show()

  // Add event listener to the verify button
  document
    .getElementById('verifyPasscodeBtn')
    .addEventListener('click', async () => {
        // const submitButton = e.target.querySelector('button[type="button"]')
        // submitButton.disabled = true
        toggleLoader(profileLoader, true)
      
      const userPasscode = document.getElementById('passcodeInput').value
      // Fetch the profile passcode from Appwrite or use the one from the selectedProfile
      const encryptedPasscode = selectedProfile.passcode

      // Send the encrypted passcode and the entered passcode to the server for verification
      try {
        const response = await fetch(
          'https://mf7l86-3000.csb.app/verify-passcode',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ encryptedPasscode, userPasscode })
          }
        )
        const verificationResult = await response.json()

        // Check if verification was successful
        if (verificationResult.verified) {
          // Changed from 'success' to 'verified'
          // Redirect to the appropriate page based on verification
          window.location.href = selectedProfile.redirectUrl
        } else {
          // Handle incorrect passcode
          alert('Incorrect passcode. Please try again.')
        }
      } catch (error) {
        console.error('Error verifying passcode:', error)
      }finally {
        toggleLoader(profileLoader, false)
        // submitButton.disabled = false
      }
    })
}

// Call populateProfiles on page load
document.addEventListener('DOMContentLoaded', populateProfiles)
