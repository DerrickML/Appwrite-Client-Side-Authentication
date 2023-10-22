import { client, account } from './appwriteConfig.js';
import './logout.js';

// DOM Elements
const homeButton = document.getElementById('homeButton');
const verifyButton = document.getElementById('verifyButton');
const usernameElement = document.getElementById('username');
const userEmailElement = document.getElementById('userEmail');
const userPhoneElement = document.getElementById('userPhone');
const userLabelElement = document.getElementById('userLabel');
const userLabelParaElement = document.getElementById('userLabelPara');
const adminLinkElement = document.getElementById('admin-link');
const verificationStatusElement = document.getElementById('verificationStatus');
const verificationSectionElement = document.getElementById('verificationSection');

// Event Listeners
document.addEventListener('DOMContentLoaded', onDocumentLoaded);
homeButton?.addEventListener('click', () => window.location.href = 'home.html');
verifyButton?.addEventListener('click', handleVerificationClick);

function onDocumentLoaded() {
    try {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (user) {
            populateUserInfo(user);
            checkVerificationStatus(user);
        } else {
            console.error('No user information found in localStorage.');
        }
    } catch (error) {
        console.error('Failed to fetch user info:', error.message);
    }
}

function populateUserInfo(user) {
    usernameElement.innerText = user.name;
    userEmailElement.innerText = user.email;
    userPhoneElement.innerText = user.phone;
    populateUserLabels(user.labels);
    populateAdminLink(user.labels);
}

function populateUserLabels(labels) {
    if (labels && labels.length > 0) {
        userLabelElement.innerHTML = labels.join(', ');
    } else {
        userLabelParaElement.style.display = 'none';
    }
}

function populateAdminLink(labels) {
    if (labels && labels.includes('admin')) {
        adminLinkElement.innerHTML = '<a href="admin.html" class="btn btn-primary">View All Users</a>';
    }
}

function checkVerificationStatus(user) {
    if (user?.emailVerification) {
        verificationStatusElement.textContent = 'Verified ✅';
    } else {
        verificationSectionElement.style.display = 'block';
    }
}

async function handleVerificationClick() {
    try {
        await verify();
    } catch (error) {
        console.error('Error:', error);
        alert('Error sending verification email: ' + error.message);
    }
}

async function verify() {
    try {
        const response = await account.createVerification('http://localhost:5501/verify.html');
        console.log(response);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
