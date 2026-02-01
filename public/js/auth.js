// Check if user is logged in and update UI
async function checkAuth() {
    const token = localStorage.getItem('token');
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    
    if (!token) {
        if (navAuth) navAuth.classList.remove('hidden');
        if (navUser) navUser.classList.add('hidden');
        return null;
    }

    try {
        const response = await api.getMe();
        const user = response.data;
        
        if (navAuth) navAuth.classList.add('hidden');
        if (navUser) navUser.classList.remove('hidden');
        
        const userNameEl = document.getElementById('userName');
        const userXpEl = document.getElementById('userXp');
        
        if (userNameEl) userNameEl.textContent = user.username;
        if (userXpEl) userXpEl.textContent = user.xp;
        
        return user;
    } catch (error) {
        // Token invalid, clear it
        localStorage.removeItem('token');
        if (navAuth) navAuth.classList.remove('hidden');
        if (navUser) navUser.classList.add('hidden');
        return null;
    }
}

function logout() {
    localStorage.removeItem('token');
    api.setToken(null);
    window.location.href = '/';
}

function requireAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
        return false;
    }
    return true;
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
