let isUserLoggedIn = false;
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
                updateCalendar();
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
    console.log("Entered check");
    fetch('check_login.php', {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.getElementById("event-creator").style.display = "none";
                document.getElementById("open-login").style.display = "none";
                document.getElementById("open-signup").style.display = "none";
                loginCurtain.classList.remove("active");
                signupCurtain.classList.remove("active");
                document.getElementById("logout").style.display = "block";
                isUserLoggedIn = true;
                console.log("Entered true");
                updateCalendar();
            } else {
                document.getElementById("event-creator").style.display = "none";
                document.getElementById("open-login").style.display = "block";
                document.getElementById("open-signup").style.display = "block";
                document.getElementById("logout").style.display = "none";
                isUserLoggedIn = false;
                console.log("Entered false");
                updateCalendar();
            }
        })
        .catch(error => {
            console.error("Error checking login status:", error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
    fetch('get_token.php', {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
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
    fetch('logout.php', {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.token) {
                    document.getElementById("login-token").value = data.token;
                    document.getElementById("signup-token").value = data.token;
                }
                document.getElementById("myNav").style.height = "0%";
                checkLoginStatus();
            }
            updateCalendar();
        })
        .catch(error => {
            console.error("Error during logout:", error);
        });
});
// cite: https://www.w3schools.com/howto/howto_js_curtain_menu.asp
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

//slider is defined in a range of minutes. I want to display the range as a time not the exact minute account, hence this helper i used.
function minutesToTime(minutes) {
    let h = Math.floor(minutes / 60);
    let m = minutes % 60;

    let period;
    if (h >= 12) {
        period = "PM";
    } else {
        period = "AM";
    }

    let hour12 = h % 12;
    if (hour12 === 0) {
        hour12 = 12;
    }

    let minuteStr;
    if (m < 10) {
        minuteStr = "0" + m;
    } else {
        minuteStr = m.toString();
    }

    return hour12 + ":" + minuteStr + " " + period;
}

let currentMonth = new Month(new Date().getFullYear(), new Date().getMonth());
let currentSelectedDate = null;
function updateCalendar() {
    //populates the calendar
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let calendarBody = document.getElementById("calendarBody");
    let monthYearHeader = document.getElementById("monthYear");
    calendarBody.textContent = ""; //clears calendar before populating
    monthYearHeader.textContent = months[currentMonth.month] + " " + currentMonth.year;

    let weeks = currentMonth.getWeeks();
    for (let w in weeks) {
        let row = document.createElement("tr"); //creates a new row for each week in that particular month
        let days = weeks[w].getDates();

        for (let d = 0; d < 7; d++) {
            let cell = document.createElement("td");

            if (days[d]) {
                let day = days[d];
                cell.textContent = day.getDate();
                cell.setAttribute("data-date", day.toISOString());

                if (day.getMonth() === currentMonth.month) {
                    if (day.toDateString() === new Date().toDateString()) {
                        cell.classList.add("today");
                    }
                } else {
                    cell.classList.add("other-month");
                }
                //checks if logged in with an ajax request to server which then allows a user to create an event
                if (isUserLoggedIn) {
                    cell.addEventListener("click", function () {
                        let clickedDate = this.getAttribute("data-date");
                        const widget = document.getElementById("event-creator");
                        if (currentSelectedDate === clickedDate) {
                            widget.style.display = "none";
                            currentSelectedDate = null;
                        }
                        else {
                            currentSelectedDate = clickedDate;
                            $("#time-range-slider").slider("values", [480, 1020]);
                            $("#time-range-display").val(minutesToTime(480) + " - " + minutesToTime(1020));

                            //source/inspo for styling: https://stackoverflow.com/questions/73515135/how-to-set-multiple-elements-style-via-getboundingclientrect
                            const cellRect = this.getBoundingClientRect();
                            const containerRect = document.getElementById("calendar-container").getBoundingClientRect();
                            if (d <= 3) {
                                widget.style.left = (cellRect.right - containerRect.left + 100) + "px";
                            }
                            else {
                                widget.style.left = (cellRect.left - containerRect.left - 180) + "px";
                            }
                            widget.style.top = (cellRect.top - containerRect.top) + "px";
                            widget.style.display = "block";
                        }
                    });
                }
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}
document.getElementById("next_month_btn").addEventListener("click", function () {
    currentMonth = currentMonth.nextMonth();
    updateCalendar();
});

document.getElementById("prev_month_btn").addEventListener("click", function () {
    currentMonth = currentMonth.prevMonth();
    updateCalendar();
});
//jquery ui slider source: https://api.jqueryui.com/slider/
$(function () {
    $("#time-range-slider").slider({
        range: true,
        min: 0,
        max: 1439,
        step: 1,
        values: [480, 1020],
        slide: function (event, ui) {
            $("#time-range-display").val(minutesToTime(ui.values[0]) + " - " + minutesToTime(ui.values[1]));
        }
    });
    $("#time-range-display").val(
        minutesToTime($("#time-range-slider").slider("values", 0)) +
        " - " +
        minutesToTime($("#time-range-slider").slider("values", 1))
    );
});

document.getElementById("create-event").addEventListener("submit", function (e) {
    e.preventDefault();
    fetch("create-event.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                document.getElementById("myNav").style.height = "0%";
                checkLoginStatus();
                updateCalendar();
            } else {
                document.getElementById("message").textContent = result.message;
            }
        })
        .catch(err => {
            console.error("Login error:", err);
            document.getElementById("message").textContent = "An error occurred. Please try again.";
        });

});