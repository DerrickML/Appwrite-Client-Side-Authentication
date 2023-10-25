import { client, account } from './appwriteConfig.js';

// DOM Elements
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupPhone = document.getElementById('signupPhone');
const signupUsername = document.getElementById('signupUsername');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupLoader = document.getElementById('signupLoader');
const loginLoader = document.getElementById('loginLoader');

//Vars defined globally for signup from the form
const email = signupEmail.value;
const password = signupPassword.value;
const phone = signupPhone.value;
const username = signupUsername.value;

// Event Listeners
signupForm.addEventListener('submit', onSignupSubmit);
loginForm.addEventListener('submit', onLoginSubmit);

// Function Definitions
function toggleLoader(loader, toggle) {
  loader.style.display = toggle ? 'inline-block' : 'none';
}

async function onSignupSubmit(e) {
  e.preventDefault();

  toggleLoader(signupLoader, true);

  try {
    await performSignup(email, password, username);
    await performLogin(email, password);
    const accountDetails = await fetchAccountDetails();
    alert('Debugging');
    handleAccountDetails(accountDetails, 'home.html');
  } catch (error) {
    alert('Error: ' + error.message);
  }

  toggleLoader(signupLoader, false);
}

async function onLoginSubmit(e) {
  e.preventDefault();

  const email = loginEmail.value;
  const password = loginPassword.value;

  toggleLoader(loginLoader, true);

  try {
    await performLogin(email, password);
    const accountDetails = await fetchAccountDetails();
    handleAccountDetails(accountDetails, 'home.html');
  } catch (error) {
    alert('Error: ' + error.message);
  }

  toggleLoader(loginLoader, false);
}

async function performSignup(email, password, name) {
  localStorage.clear();
  const response = await account.create('unique()', email, password, name);
  console.log('Signup is successful:', response);
  return response;
}

async function performLogin(email, password) {
  localStorage.clear();
  const response = await account.createEmailSession(email, password);
  console.log('Logging in successful:', response);
  localStorage.setItem('sessionData', JSON.stringify(response));
  if(phone==''){}
  else{
    await updatePhone(phone, password);
  }
  return response;
}

async function updatePhone(phone, password){
  const response = await account.updatePhone(phone, password);
  console.log('Phone update status:', response);
  return response;
}

async function fetchAccountDetails() {
  console.log('Fetching User Account Details');
  const response = await account.get();
  console.log('The User Account Details:', response);
  return response;
}

function handleAccountDetails(accountDetails, redirectURL) {
  const uID = accountDetails.$id;
  console.log(uID);

  if (accountDetails.status) {
    localStorage.setItem('userInfo', JSON.stringify({
      uID,
      name: accountDetails.name,
      labels: accountDetails.labels,
      email: accountDetails.email,
      phone: accountDetails.phone,
      emailVerification: accountDetails.emailVerification,
      phoneVerification: accountDetails.phoneVerification
    }));

    alert('Logging in ...');
    window.location.href = redirectURL;
  } else {
    alert(JSON.stringify(accountDetails));
  }
}
