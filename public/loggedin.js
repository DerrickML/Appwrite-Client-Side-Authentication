// Function to check session status
function checkSessionStatus(sessionStatus) {
    if (!sessionStatus || !sessionStatus.$id || !sessionStatus.current) {
        console.log('No session, session id not found, or session not current. Redirecting to login page.');
        alert('No session, session id not found, or session not current. Redirecting to login page.');
        window.location.href = 'index.html';
    } else {
        console.log(`Session is active with id: ${sessionStatus.$id} - loading page.`);
        alert(`Session is active with id: ${sessionStatus.$id} - loading page.`);
    }
}

// Function to handle errors
function handleErrors(error) {
    console.error('Failed to check login status:', error);
    alert('Failed to check login status:', error);
    window.location.href = 'index.html';
}

// Check session status on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
    const sessionStatus = JSON.parse(localStorage.getItem('sessionData'));
    try {
        checkSessionStatus(sessionStatus);
    } catch (error) {
        handleErrors(error);
    }
});