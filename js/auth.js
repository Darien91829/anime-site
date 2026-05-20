// js/auth.js
// State engine logic for handling site registration and credential login functions

let currentAuthMode = 'login'; // Tracks display orientation: 'login' or 'register'

document.addEventListener('DOMContentLoaded', () => {
    initAuthTriggers();
    checkExistingUserSession();
});

function initAuthTriggers() {
    const modal = document.getElementById('authModal');
    const closeBtn = document.getElementById('closeAuthBtn');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');

    // Action triggers matching both Header profile node and Sidebar node options
    const profileTrigger = document.getElementById('headerProfileTrigger');
    const sidebarLoginTrigger = document.getElementById('sidebarLoginTrigger');

    if (profileTrigger) {
        profileTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthInterface();
        });
    }

    if (sidebarLoginTrigger) {
        sidebarLoginTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthInterface();
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });

    // Toggle mask visibility state for the password security keys input
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function () {
            const passwordInput = document.getElementById('authPassword');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    }
}

function openAuthInterface() {
    // If user is already active, click logs them out instead
    if (localStorage.getItem('da9_userSession')) {
        if (confirm('🔒 Sign Out from your current dude9anime profile account sessions?')) {
            localStorage.removeItem('da9_userSession');
            location.reload();
        }
        return;
    }
    document.getElementById('authModal').classList.add('open');
}

/**
 * Handles tab layout styling changes and visibility parameters inside the wrapper.
 */
function switchAuthMode(mode) {
    currentAuthMode = mode;
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const usernameField = document.getElementById('usernameField');
    const submitBtn = document.getElementById('authSubmitBtn');
    const alertBox = document.getElementById('authAlert');

    alertBox.style.display = 'none';

    if (mode === 'register') {
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        usernameField.style.display = 'block';
        document.getElementById('authUsername').required = true;
        submitBtn.textContent = 'Register Core Profile';
    } else {
        tabRegister.classList.remove('active');
        tabLogin.classList.add('active');
        usernameField.style.display = 'none';
        document.getElementById('authUsername').required = false;
        submitBtn.textContent = 'Access Dashboard';
    }
}

/**
 * Processes incoming form validations and saves parameters securely inside browser memory.
 */
function handleAuthSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const alertBox = document.getElementById('authAlert');

    alertBox.style.display = 'block';
    alertBox.className = 'auth-alert'; // reset modifiers

    if (currentAuthMode === 'register') {
        const username = document.getElementById('authUsername').value.trim();
        
        if (password.length < 6) {
            alertBox.classList.add('error');
            alertBox.textContent = '❌ Security key error: Passwords must be at least 6 tokens long.';
            return;
        }

        // Save local database register elements
        localStorage.setItem('da9_savedUser', username);
        localStorage.setItem('da9_savedEmail', email);
        localStorage.setItem('da9_savedPass', password);

        alertBox.classList.add('success');
        alertBox.textContent = '✨ Profile created! Redirecting to credentials console...';

        setTimeout(() => {
            switchAuthMode('login');
        }, 1500);

    } else {
        // Authenticating account matches
        const savedEmail = localStorage.getItem('da9_savedEmail') || 'admin@dude9anime.com';
        const savedPass = localStorage.getItem('da9_savedPass') || 'password123';
        const savedUser = localStorage.getItem('da9_savedUser') || 'SaitamaFan';

        if (email === savedEmail && password === savedPass) {
            alertBox.classList.add('success');
            alertBox.textContent = `🚀 Verification Complete. Welcome back, ${savedUser}!`;
            
            localStorage.setItem('da9_userSession', savedUser);

            setTimeout(() => {
                document.getElementById('authModal').classList.remove('open');
                checkExistingUserSession();
            }, 1200);
        } else {
            alertBox.classList.add('error');
            alertBox.textContent = '❌ Credentials error: Invalid structural sequence matching parameters.';
        }
    }
}

/**
 * Checks for stored user data and updates interface components across pages on boot load.
 */
function checkExistingUserSession() {
    const userSession = localStorage.getItem('da9_userSession');
    const sidebarLoginTrigger = document.getElementById('sidebarLoginTrigger');
    const profileIcon = document.getElementById('headerProfileTrigger');

    if (userSession) {
        // Update user elements to active login view
        if (sidebarLoginTrigger) {
            sidebarLoginTrigger.innerHTML = `<i class="fas fa-sign-out-alt"></i> Sign Out (${userSession})`;
            sidebarLoginTrigger.style.color = 'var(--accent-green)';
        }
        if (profileIcon) {
            profileIcon.className = "fas fa-user-check";
            profileIcon.style.color = "var(--accent-green)";
            profileIcon.title = `Active Session: ${userSession}`;
        }
    }
}
