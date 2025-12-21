// Authentication form validation and UX
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const openLoginFromSignup = document.getElementById('open-login-from-signup');
    const openSignupFromLogin = document.getElementById('open-signup-from-login');

    // Helper to show toast if available
    function notify(message, type = 'info') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(message);
        }
    }

    // Signup validation
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Reset validation states
            Array.from(signupForm.elements).forEach(el => {
                el.classList && el.classList.remove('is-invalid');
            });

            const fullname = document.getElementById('signup-fullname');
            const email = document.getElementById('signup-email');
            const phone = document.getElementById('signup-phone');
            const password = document.getElementById('signup-password');
            const confirmPassword = document.getElementById('signup-confirm-password');

            let valid = true;

            if (!fullname.value.trim() || fullname.value.trim().length < 3) {
                fullname.classList.add('is-invalid');
                valid = false;
            }

            if (!email.value.trim() || !email.checkValidity()) {
                email.classList.add('is-invalid');
                valid = false;
            }

            if (!phone.value.trim() || !phone.checkValidity()) {
                phone.classList.add('is-invalid');
                valid = false;
            }

            if (!password.value || password.value.length < 6) {
                password.classList.add('is-invalid');
                valid = false;
            }

            if (!confirmPassword.value || confirmPassword.value !== password.value) {
                confirmPassword.classList.add('is-invalid');
                valid = false;
            }

            if (!valid) {
                return;
            }

            // Simulate successful registration
            notify('Registration successful! You can now login.', 'success');

            // Close modal
            const signupModalEl = document.getElementById('signupModal');
            if (signupModalEl) {
                const modal = bootstrap.Modal.getInstance(signupModalEl) || new bootstrap.Modal(signupModalEl);
                modal.hide();
            }

            signupForm.reset();
        });
    }

    // Login validation
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            Array.from(loginForm.elements).forEach(el => {
                el.classList && el.classList.remove('is-invalid');
            });

            const email = document.getElementById('login-email');
            const password = document.getElementById('login-password');

            let valid = true;

            if (!email.value.trim() || !email.checkValidity()) {
                email.classList.add('is-invalid');
                valid = false;
            }

            if (!password.value || password.value.length < 6) {
                password.classList.add('is-invalid');
                valid = false;
            }

            if (!valid) {
                return;
            }

            // Simulate successful login
            notify('Login successful! Welcome back.', 'success');

            const loginModalEl = document.getElementById('loginModal');
            if (loginModalEl) {
                const modal = bootstrap.Modal.getInstance(loginModalEl) || new bootstrap.Modal(loginModalEl);
                modal.hide();
            }

            loginForm.reset();
        });
    }

    // Switch between modals
    if (openLoginFromSignup) {
        openLoginFromSignup.addEventListener('click', (e) => {
            e.preventDefault();
            const loginModalEl = document.getElementById('loginModal');
            if (loginModalEl) {
                const modal = new bootstrap.Modal(loginModalEl);
                modal.show();
            }
        });
    }

    if (openSignupFromLogin) {
        openSignupFromLogin.addEventListener('click', (e) => {
            e.preventDefault();
            const signupModalEl = document.getElementById('signupModal');
            if (signupModalEl) {
                const modal = new bootstrap.Modal(signupModalEl);
                modal.show();
            }
        });
    }
});



