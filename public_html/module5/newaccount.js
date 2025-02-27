function signupAjax() {
    const newuser = document.getElementById("newuser").value;
    const newpassword = document.getElementById("newpassword").value;
    const confirmpassword = document.getElementById("confirmpassword").value;
    const recaptchaResponse = document.getElementById("recaptcha-token").value;
    const token = document.getElementById("token").value;

    if (newpassword.length < 10) {
        document.getElementById("message").textContent = "Password must be at least 10 characters.";
        return;
    }
    if (!/[A-Z]/.test(newpassword) || !/[0-9]/.test(newpassword)) {
        document.getElementById("message").textContent = "Password must contain an uppercase letter and a number.";
        return;
    }
    if (newpassword !== confirmpassword) {
        document.getElementById("message").textContent = "Passwords do not match.";
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
                window.location.replace(result.redirect);
            } else {
                document.getElementById("message").textContent = result.message;
            }
        })
        .catch(err => {
            console.error("Signup error:", err);
            document.getElementById("message").textContent = "An error occurred. Please try again.";
        });
}

document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();
    grecaptcha.ready(function () {
        grecaptcha.execute('6LcS4OIqAAAAAHmo-mzM7UWBlhfmxvyh7SNs2_us', { action: 'signup' })
            .then(function (token) {
                document.getElementById("recaptcha-token").value = token;
                signupAjax();
            });
    });
});