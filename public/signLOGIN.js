
function toggleLoader(loaderId, toggle) {
    const loader = document.getElementById(loaderId);
    loader.style.display = toggle ? 'inline-block' : 'none';
  }
  
  //Trigger the verification process.
  // async function triggerEmailVerification() {
  //     try {
  //         const response = await fetch('/trigger-verification', { method: 'POST' });
  //         if (!response.ok) throw new Error('Failed to trigger verification');
  //         alert('Verification email sent');
  //     } catch (error) {
  //         console.error(error);
  //         alert('Failed to trigger email verification');
  //     }
  // }
  
  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const phone = document.getElementById('signupPhone').value;
    const username = document.getElementById('signupUsername').value;
  
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phone', phone);
    formData.append('username', username);
  
    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });
        const data = await response.json();
        if (data.message === 'Signup successful') {
            // triggerEmailVerification();  // Trigger email verification
            $('#signupModal').modal('hide');
            $('#loginModal').modal('show');
        } else {
            alert(JSON.stringify(data));
        }
    } catch (error) {
        alert('Error signing up: ' + error.message);
    }
    toggleLoader('signupLoader', false);
  });
  
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${email}&password=${password}`,
        });
        const data = await response.json();
        if (data.message === 'Login successful') {
            // triggerEmailVerification();  // Trigger email verification
            window.location.href = '/home';
        } else {
            alert(JSON.stringify(data));
        }
    } catch (error) {
        alert('Error logging in: ' + error.message);
    }
    toggleLoader('loginLoader', false);
  });