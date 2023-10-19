// Event listener for logout button
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/logout');
            if (response.ok) {
                window.location.href = '/';
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    });
}

// Event listener for profile button
const profileButton = document.getElementById('profileButton');
if (profileButton) {
    profileButton.addEventListener('click', () => {
        window.location.href = '/profile';
    });
}

// Event listener for home button
const homeButton = document.getElementById('homeButton');
if (homeButton) {
    homeButton.addEventListener('click', () => {
        window.location.href = '/home';
    });
}
