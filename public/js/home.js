// home.js
import './logout.js';

// DOM Elements
const profileButton = document.getElementById('profileButton');
const usernameDisplay = document.getElementById('username');

// Event Listeners
document.addEventListener('DOMContentLoaded', onDocumentLoaded);
profileButton?.addEventListener('click', () => window.location.href = 'profile.html');

function onDocumentLoaded() {
    // Retrieve user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log('userName:', userInfo?.name);
    updateUsernameDisplay(userInfo?.name);
}

function updateUsernameDisplay(name) {
    usernameDisplay.innerText = name ? `${name}!` : 'User!';
}