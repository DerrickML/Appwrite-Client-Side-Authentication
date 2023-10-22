import { client, account } from './appwriteConfig.js';

// Logout function
async function logout(sessionId) {
    try {
        console.log('Attempting logout with Session ID:', sessionId);
        // Clear local storage
        localStorage.setItem('sessionData', JSON.stringify({}));
        localStorage.setItem('userInfo', JSON.stringify({}));
        console.log('Local storage cleared successfully.');
        // Delete session
        const response = await account.deleteSession(sessionId);
        console.log('Logout successful:', response);
    } catch (error) {
        console.error('Logout failed:', error);
        alert('Logout failed');
    }
}

// Event listener for logout button
document.getElementById('logoutButton')?.addEventListener('click', async () => {
    const sessionData = JSON.parse(localStorage.getItem('sessionData'));
    if (sessionData?.$id) {
        try {
            await logout(sessionData.$id);
        } catch (error) {
            console.error('Logout failed:', error.message);
            alert('Logout failed:', error.message);
        }
    } else {
        console.error('No session ID found for logout.');
        alert('No session ID found for logout.');
    }
});

export default logout;