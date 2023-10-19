import './logout.js';

// Global variables to store all users and manage pagination
let allUsers = [];
let currentPage = 1;
const pageSize = 10;

// DOM Elements
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const userList = document.getElementById('user-list');
const spinner = document.getElementById('spinner');

// Event Listeners
document.addEventListener('DOMContentLoaded', onDocumentLoaded);
prevPageButton.addEventListener('click', prevPage);
nextPageButton.addEventListener('click', nextPage);

// Functions
function onDocumentLoaded() {
  populateUserInfo();
  loadUsers();
}

async function loadUsers() {
  spinner.style.display = 'block'; // Show spinner
  await fetchAllUsers();
  renderUsers();
  spinner.style.display = 'none'; // Hide spinner
}

async function fetchAllUsers() {
  try {
    const response = await fetch('/users');
    const data = await response.json();
    allUsers = data.users;
  } catch (error) {
    console.error('Error fetching all users:', error);
  }
}

function renderUsers() {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const usersToRender = allUsers.slice(startIndex, endIndex);

  userList.innerHTML = ''; // Clear previous user list
  usersToRender.forEach(renderUserRow);

  updatePaginationButtons();
}

function renderUserRow(user) {
  const labels = Array.isArray(user.labels) ? user.labels.join(', ') : 'N/A';
  const userRow = document.createElement('tr');
  userRow.innerHTML = `
    <td><input type="checkbox" value="${user.$id}" /></td>
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${user.phone}</td>
    <td>${labels}</td>
    <td>${user.emailVerification}</td>
    <td>${user.phoneVerification}</td>
  `;
  userList.appendChild(userRow);
}

function updatePaginationButtons() {
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage * pageSize >= allUsers.length;
}

function nextPage() {
  if (currentPage * pageSize < allUsers.length) {
    currentPage += 1;
    renderUsers();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage -= 1;
    renderUsers();
  }
}

function populateUserInfo() {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user) {
    document.getElementById('username').innerText = user.name;
  } else {
    console.error('Failed to fetch user info');
  }
}

/************** SERVER SIDE REQUIRED **************/
async function deleteSelectedUsers () {
  document.getElementById('spinner').style.display = 'block' // Show spinner
  const checkboxes = [
      ...document.querySelectorAll('input[type="checkbox"]:checked')
  ]
  const userIds = checkboxes.map(checkbox => checkbox.value)
  try {
      const response = await fetch('/delete-user', {
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
/********************************************************************************************************/

// Event listener for profile button
const profileButton = document.getElementById('profileButton')
if (profileButton) {
  profileButton.addEventListener('click', () => {
    window.location.href = 'profile.html'
  })
}

// Event listener for home button
const homeButton = document.getElementById('homeButton')
if (homeButton) {
  homeButton.addEventListener('click', () => {
    window.location.href = 'home.html'
  })
}
