import { client, account } from './appwriteConfig.js';

function toggleLoader (loaderId, toggle) {
  const loader = document.getElementById(loaderId)
  loader.style.display = toggle ? 'inline-block' : 'none'
}

document.getElementById('signupForm').addEventListener('submit', async e => {
  e.preventDefault()

  const email = document.getElementById('signupEmail').value
  const password = document.getElementById('signupPassword').value
  const phone = document.getElementById('signupPhone').value
  const username = document.getElementById('signupUsername').value

  const formData = new URLSearchParams()
  formData.append('email', email)
  formData.append('password', password)
  formData.append('phone', phone)
  formData.append('username', username)

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })
    const data = await response.json()
    if (data.message === 'Signup successful') {
      $('#signupModal').modal('hide')
      $('#loginModal').modal('show')
    } else {
      alert(JSON.stringify(data))
    }
  } catch (error) {
    alert('Error signing up: ' + error.message)
  }
  toggleLoader('signupLoader', false)
})

// Function to log in
async function login(email, password) {
  try {
    // Clear local storage
    localStorage.clear();

    let response = await account.createEmailSession(email, password);
    console.log('Logging in successful');
    console.log(response); // Success
    localStorage.setItem('sessionData', JSON.stringify(response));
    return response; // return the response for further use if needed
  } catch (error) {
    console.error(error); // Failure
    throw error; // re-throw the error for handling in the calling code
  }
}

// Function to fetch account details
async function fetchAccountDetails() {
  try {
    console.log('Fetching User Account Details');
    const response = await account.get();
    console.log('The User Account Details:');
    console.log(response); // Success
    return response; // return the response for further use if needed
  } catch (error) {
    console.error('Failed to get the User Account Details: ', error.message);
    throw error; // re-throw the error for handling in the calling code
  }
}

// Event listener for form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    await login(email, password); // Login and wait for it to complete
    const accountDetails = await fetchAccountDetails(); // Fetch account details and wait for it to complete
    
    const uID = accountDetails.$id; // Assign the id in the response to the variable uID
    console.log(uID);

    if (accountDetails.status) {
      // Save user data to localStorage
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          uID: uID,
          name: accountDetails.name,
          labels: accountDetails.labels,
          email: accountDetails.email,
          phone: accountDetails.phone,
          emailVerification: accountDetails.emailVerification,
          phoneVerification: accountDetails.phoneVerification,
        })
      );

      alert('Logging in ...');
      window.location.href = 'home.html';
    } else {
      alert(JSON.stringify(accountDetails));
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }

  toggleLoader('loginLoader', false);
});