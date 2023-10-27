import { client, account } from './appwriteConfig.js';

// DOM Elements
const elements = {
    signupForm: document.getElementById('signupForm'),
    loginForm: document.getElementById('loginForm'),
    signupEmail: document.getElementById('signupEmail'),
    signupPassword: document.getElementById('signupPassword'),
    signupPhone: document.getElementById('signupPhone'),
    signupUsername: document.getElementById('signupUsername'),
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    signupLoader: document.getElementById('signupLoader'),
    loginLoader: document.getElementById('loginLoader')
};

// Event Listeners
elements.signupForm.addEventListener('submit', onSignupSubmit);
elements.loginForm.addEventListener('submit', onLoginSubmit);

async function onSignupSubmit(e) {
    e.preventDefault();

    const signupData = {
        email: elements.signupEmail.value,
        password: elements.signupPassword.value,
        phone: elements.signupPhone.value,
        username: elements.signupUsername.value
    };

    try {
        console.log('SignUp email: ' + signupData.email);
        await performSignup(signupData);
        await performLogin(signupData.email, signupData.password);
        await updatePhone(signupData.phone, signupData.password);
        const accountDetails = await fetchAccountDetails();
        alert('Debugging at Signup ...');
        handleAccountDetails(accountDetails, 'home.html');
    } catch (error) {
        alert('Error at Signup: ' + error.message);
    }
}

async function onLoginSubmit(e) {
    e.preventDefault();

    const loginData = {
        email: elements.loginEmail.value,
        password: elements.loginPassword.value
    };

    try {
        await performLogin(loginData.email, loginData.password);
        const accountDetails = await fetchAccountDetails();
        handleAccountDetails(accountDetails, 'home.html');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function performSignup({ email, password, username }) {
    localStorage.clear();
    const response = await account.create('unique()', email, password, username);
    console.log('Signup is successful:', response);
    return response;
}

async function performLogin(email, password) {
    localStorage.clear();
    const response = await account.createEmailSession(email, password);
    console.log('Logging in successful:', response);
    localStorage.setItem('sessionData', JSON.stringify(response));
    return response;
}

async function updatePhone(phone, password) {
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
        localStorage.setItem(
            'userInfo',
            JSON.stringify({
                uID,
                name: accountDetails.name,
                labels: accountDetails.labels,
                email: accountDetails.email,
                phone: accountDetails.phone,
                emailVerification: accountDetails.emailVerification,
                phoneVerification: accountDetails.phoneVerification
            })
        );

        alert('Logging in ...');
        window.location.href = redirectURL;
    } else {
        alert(JSON.stringify(accountDetails));
    }
}