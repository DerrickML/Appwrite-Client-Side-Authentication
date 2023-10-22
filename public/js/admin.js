import './logout.js'

// Global variables to store all users and manage pagination
let allUsers = []
let currentPage = 1
const pageSize = 10

// DOM Elements
const prevPageButton = document.getElementById('prevPage')
const nextPageButton = document.getElementById('nextPage')
const userList = document.getElementById('user-list')
const spinner = document.getElementById('spinner')
const profileButton = document.getElementById('profileButton')
const homeButton = document.getElementById('homeButton')

// Event Listeners
document.addEventListener('DOMContentLoaded', onDocumentLoaded)
prevPageButton.addEventListener('click', prevPage)
nextPageButton.addEventListener('click', nextPage)
if (profileButton)
  profileButton.addEventListener('click', () => navigateTo('profile.html'))
if (homeButton)
  homeButton.addEventListener('click', () => navigateTo('home.html'))

// Function Definitions
function onDocumentLoaded () {
  populateUserInfo()
  loadUsers()
  setupAdditionalListeners()
}

function setupAdditionalListeners () {
  document
    .getElementById('delete-button')
    .addEventListener('click', deleteSelectedUsers)
  document
    .getElementById('fetch-button')
    .addEventListener('click', fetchAllUsers)
}

async function loadUsers () {
  toggleSpinner(true)
  await fetchAllUsers()
  renderUsers()
  toggleSpinner(false)
}

function renderUsers () {
  if (!allUsers) {
    console.error('No users data available')
    return
  }
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = currentPage * pageSize
  const usersToRender = allUsers.slice(startIndex, endIndex)

  userList.innerHTML = '' // Clear previous user list
  usersToRender.forEach(renderUserRow)

  updatePaginationButtons()
}

function renderUserRow (user) {
  const labels = Array.isArray(user.labels) ? user.labels.join(', ') : 'N/A'
  const userRow = document.createElement('tr')
  userRow.innerHTML = `
    <td><input type="checkbox" value="${user.$id}" /></td>
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${user.phone}</td>
    <td>${labels}</td>
    <td>${user.emailVerification}</td>
    <td>${user.phoneVerification}</td>
  `
  userList.appendChild(userRow)
}

function updatePaginationButtons () {
  prevPageButton.disabled = currentPage === 1
  nextPageButton.disabled = currentPage * pageSize >= allUsers.length
}

function nextPage () {
  if (currentPage * pageSize < allUsers.length) {
    currentPage += 1
    renderUsers()
  }
}

function prevPage () {
  if (currentPage > 1) {
    currentPage -= 1
    renderUsers()
  }
}

function populateUserInfo () {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (user) {
    document.getElementById('username').innerText = user.name
  } else {
    console.error('Failed to fetch user info')
  }
}

async function fetchAllUsers () {
  try {
    const response = await fetch('https://mf7l86-3000.csb.app/users', { mode: 'cors' })
    // const response = await fetch('/users', { mode: 'cors' })
    const data = await response.json()
    allUsers = data.users
  } catch (error) {
    console.error('Error fetching all users:', error)
  }
}

function toggleSpinner (toggle) {
  spinner.style.display = toggle ? 'block' : 'none'
}

function navigateTo (url) {
  window.location.href = url
}

async function deleteSelectedUsers () {
  toggleSpinner(true)
  const checkboxes = [
    ...document.querySelectorAll('input[type="checkbox"]:checked')
  ]
  const userIds = checkboxes.map(checkbox => checkbox.value)

  document.getElementById('spinner').style.display = 'block' // Show spinner
  try {
    const response = await fetch('https://mf7l86-3000.csb.app/delete-user', { mode: 'cors' }, {
      // const response = await fetch('/delete-user', { mode: 'cors' }, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds }) // Send array of user IDs
    })
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error deleting users:', errorText)
    }
  } catch (error) {
    console.error('Error deleting users:', error)
  }
  await fetchAllUsers() // Refresh the user list
  renderUsers() // Render the updated user list
  document.getElementById('spinner').style.display = 'none' // Hide spinner
}
