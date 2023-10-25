import { client, account } from './appwriteConfig.js';
import './logout.js';

// DOM Elements
const homeButton = document.getElementById('homeButton');
const verifyEmailButton = document.getElementById('verifyEmailButton');
const verifyPhoneButton = document.getElementById('verifyPhoneButton');
const secretCodeButton = document.getElementById('secretCodeButton');
const usernameElement = document.getElementById('username');
const userEmailElement = document.getElementById('userEmail');
const userPhoneElement = document.getElementById('userPhone');
const userLabelElement = document.getElementById('userLabel');
const userLabelParaElement = document.getElementById('userLabelPara');
const adminLinkElement = document.getElementById('admin-link');
const emailVerificationStatusElement = document.getElementById('emailVerificationStatus');
const phoneVerificationStatusElement = document.getElementById('phoneVerificationStatus');

// Event Listeners
document.addEventListener('DOMContentLoaded', onDocumentLoaded);
homeButton?.addEventListener('click', () => window.location.href = 'home.html');
verifyEmailButton?.addEventListener('click', handleEmailVerificationClick);
verifyPhoneButton?.addEventListener('click', handlePhoneVerificationClick);
secretCodeButton?.addEventListener('click', handleSecretCodeVerificationClick);

//Verification code
var secretCode = document.getElementById('verificationCode').value;

//User data
const user = JSON.parse(localStorage.getItem('userInfo'));

function onDocumentLoaded() {
    try {
        console.log('User Information: ' + user);
        if (user) {
            populateUserInfo(user);
            checkEmailVerificationStatus(user);
            checkPhoneVerificationStatus(user);
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

function checkEmailVerificationStatus(user) {

    //check email verification status
    console.log('Email Verification:', user?.emailVerification);
    if (user?.emailVerification) {
        emailVerificationStatusElement.textContent = 'Verified ✅';
    } else {
        emailVerificationStatusElement.textContent = 'Not Verified ❌';
        verifyEmailButton.style.display = 'block';
    }
}

function checkPhoneVerificationStatus(user) {
    //Check phone verification status
    console.log('Phone Verification:', user?.phoneVerification);
    if (user?.phoneVerification) {
        phoneVerificationStatusElement.textContent = 'Verified ✅';
    } else {
        phoneVerificationStatusElement.textContent = 'Not Verified ❌';
        verifyPhoneButton.style.display = 'block';
    }
}

async function handleEmailVerificationClick() {
    try {
        await verifyEmail();
    } catch (error) {
        console.error('Error:', error);
        alert('Error sending verification email: ' + error.message);
    }
}

async function handlePhoneVerificationClick() {
    try {
        await verifyPhone();
    } catch (error) {
        console.error('Error:', error);
        alert('Error sending verification email: ' + error.message);
    }
}

async function handleSecretCodeVerificationClick() {
    try {
        const userID = user.$id;
        await verificationCode(userID, secretCode);
    } catch (error) {
        console.error('Error:', error);
        alert('Error sending verification email: ' + error.message);
    }
}

async function verifyEmail() {
    try {
        const response = await account.createVerification('https://v1q1.c10.e2-4.dev/tests/appwrite-client-side/public/verify.html');
        console.log('Sending verification link ...')
        console.log(response);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function verifyPhone() {
    try {
        const response = await account.createPhoneVerification();
        console.log('Sending verification link ...')
        console.log(response);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function verificationCode(userID, secretCode){
    try {
        const response = await account.updatePhoneVerification(userID, secretCode);
        console.log('Verifying ...')
        console.log(response);
    } catch (error) {
        console.log('Verification Failed!');
        alert('Verification Failed');
        console.log(error);
        throw error;
    }   
}

