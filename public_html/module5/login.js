function loginAjax() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const recaptchaResponse = document.getElementById("recaptcha-token").value;
    const token = document.getElementById("token").value;

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
                window.location.replace(result.redirect);
            } else {
                document.getElementById("message").textContent = result.message;
            }
        })
        .catch(err => {
            console.error("Login error:", err);
            document.getElementById("message").textContent = "An error occurred. Please try again.";
        });
}

document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    grecaptcha.ready(function () {
        grecaptcha.execute('6LcS4OIqAAAAAHmo-mzM7UWBlhfmxvyh7SNs2_us', { action: 'login' })
            .then(function (token) {
                document.getElementById("recaptcha-token").value = token;
                loginAjax();
            });
    });
});