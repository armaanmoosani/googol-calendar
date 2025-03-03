function loginAjax() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const recaptchaResponse = document.getElementById("login-recaptcha-token").value;
    const token = document.getElementById("login-token").value;

    const data = {
        username: username,
        password: password,
        recaptchaResponse: recaptchaResponse,
        token: token
    };
    fetch("login.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                document.getElementById("myNav").style.height = "0%";
                checkLoginStatus();
            } else {
                document.getElementById("message").textContent = result.message;
            }
        })
        .catch(err => {
            console.error("Login error:", err);
            document.getElementById("message").textContent = "An error occurred. Please try again.";
        });
}

function checkLoginStatus() {
    fetch('check_login.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.getElementById("open-login").style.display = "none";
                document.getElementById("open-signup").style.display = "none";
                loginCurtain.classList.remove("active");
                signupCurtain.classList.remove("active");
                document.getElementById("logout").style.display = "block";
            } else {
                document.getElementById("open-login").style.display = "block";
                document.getElementById("open-signup").style.display = "block";
                document.getElementById("logout").style.display = "none";
            }
        })
        .catch(error => {
            console.error("Error checking login status:", error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
    fetch('get_token.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById("login-token").value = data.token;
            document.getElementById("signup-token").value = data.token;
        })
        .catch(error => console.error("Token fetch error:", error));
});

function signupAjax() {
    const newuser = document.getElementById("newuser").value;
    const newpassword = document.getElementById("newpassword").value;
    const confirmpassword = document.getElementById("confirmpassword").value;
    const recaptchaResponse = document.getElementById("signup-recaptcha-token").value;
    const token = document.getElementById("signup-token").value;

    if (newpassword.length < 10) {
        document.getElementById("signup-message").textContent = "Password must be at least 10 characters.";
        return;
    }
    if (!/[A-Z]/.test(newpassword) || !/[0-9]/.test(newpassword)) {
        document.getElementById("signup-message").textContent = "Password must contain an uppercase letter and a number.";
        return;
    }
    if (newpassword !== confirmpassword) {
        document.getElementById("signup-message").textContent = "Passwords do not match.";
        return;
    }
    const data = {
        newuser: newuser,
        newpassword: newpassword,
        recaptchaResponse: recaptchaResponse,
        token: token
    };
    fetch("newaccount.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const signupCurtain = document.getElementById("signupCurtain");
                signupCurtain.classList.remove("active");
                checkLoginStatus();
            } else {
                document.getElementById("signup-message").textContent = result.message;
            }
        })
        .catch(err => {
            console.error("Signup error:", err);
            document.getElementById("signup-message").textContent = "An error occurred. Please try again.";
        });
}

document.getElementById("logout").addEventListener("click", function () {
    fetch('logout.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.token) {
                    document.getElementById("login-token").value = data.token;
                    document.getElementById("signup-token").value = data.token;
                }
                checkLoginStatus();
            }
        })
        .catch(error => {
            console.error("Error during logout:", error);
        });
});

function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

document.getElementById("open-login").addEventListener("click", function () {
    const loginCurtain = document.getElementById("loginCurtain");
    const signupCurtain = document.getElementById("signupCurtain");
    loginCurtain.classList.toggle("active");
    signupCurtain.classList.remove("active");
});

document.getElementById("open-signup").addEventListener("click", function () {
    const signupCurtain = document.getElementById("signupCurtain");
    const loginCurtain = document.getElementById("loginCurtain");
    signupCurtain.classList.toggle("active");
    loginCurtain.classList.remove("active");
});

document.getElementById("open").addEventListener("click", openNav, false);
document.getElementById("close").addEventListener("click", closeNav, false);

//cite: https://developers.google.com/recaptcha/docs/v3
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    grecaptcha.ready(function () {
        grecaptcha.execute('6LcS4OIqAAAAAHmo-mzM7UWBlhfmxvyh7SNs2_us', { action: 'login' })
            .then(function (token) {
                document.getElementById("login-recaptcha-token").value = token;
                loginAjax();
            });
    });
});
document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();
    grecaptcha.ready(function () {
        grecaptcha.execute('6LcS4OIqAAAAAHmo-mzM7UWBlhfmxvyh7SNs2_us', { action: 'signup' })
            .then(function (token) {
                document.getElementById("signup-recaptcha-token").value = token;
                signupAjax();
            });
    });
});