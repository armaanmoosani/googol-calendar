let isUserLoggedIn = false;
let currentMonth = new Month(new Date().getFullYear(), new Date().getMonth());
let currentSelectedDate = null;
let editTag = "";

function loginAjax() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let recaptchaResponse = document.getElementById("login-recaptcha-token").value;
    let token = document.getElementById("login-token").value;

    const data = {
        username: username,
        password: password,
        recaptchaResponse: recaptchaResponse,
        token: token
    };

    fetch("login.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
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

function signupAjax() {
    let newuser = document.getElementById("newuser").value;
    let newpassword = document.getElementById("newpassword").value;
    let confirmpassword = document.getElementById("confirmpassword").value;
    let recaptchaResponse = document.getElementById("signup-recaptcha-token").value;
    let token = document.getElementById("signup-token").value;

    if (newpassword.length < 10) {
        document.getElementById("signup-message").textContent = "Password must be at least 10 characters.";
        return;
    }
    if (!/[A-Z]/.test(newpassword) || !/[0-9]/.test(newpassword)) {
        document.getElementById("signup-message").textContent =
            "Password must contain an uppercase letter and a number.";
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
                let signupCurtain = document.getElementById("signupCurtain");
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

function checkLoginStatus() {
    fetch("check_login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.getElementById("event-creator").classList.remove("active");
                document.getElementById("open-login").style.display = "none";
                document.getElementById("open-signup").style.display = "none";
                document.getElementById("loginCurtain").classList.remove("active");
                document.getElementById("signupCurtain").classList.remove("active");
                document.getElementById("logout").style.display = "block";
                document.getElementById("dropdown").style.display = "inline-flex";
                isUserLoggedIn = true;
                updateCalendar();
            } else {
                document.getElementById("event-widget").classList.remove("show");
                document.getElementById("myNav").style.height = "0%";
                document.getElementById("event-creator").classList.remove("active");
                document.getElementById("open-login").style.display = "block";
                document.getElementById("open-signup").style.display = "block";
                document.getElementById("logout").style.display = "none";
                document.getElementById("dropdown").style.display = "none";
                document.querySelectorAll(".calendar-event").forEach(element => {
                    element.remove();
                });
                isUserLoggedIn = false;
                updateCalendar();
            }
        })
        .catch(error => {
            console.error("Error checking login status:", error);
        });
}

function logoutUser() {
    fetch("logout.php", {
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
                checkLoginStatus();
            }
        })
        .catch(error => {
            console.error("Error during logout:", error);
        });
}

/* cite: https://www.w3schools.com/howto/howto_js_curtain_menu.asp */
function openNav() {
    document.getElementById("myNav").style.height = "100%";
    document.body.style.overflow = 'hidden';
}

/* cite: https://www.w3schools.com/howto/howto_js_curtain_menu.asp */
function closeNav() {
    document.getElementById("myNav").style.height = "0%";
    signupCurtain.classList.remove("active");
    loginCurtain.classList.remove("active");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("newuser").value = "";
    document.getElementById("newpassword").value = "";
    document.getElementById("confirmpassword").value = "";
    document.getElementById("signup-message").textContent = "";
    document.getElementById("message").textContent = "";
    document.body.style.overflow = 'auto';
}

function minutesToTime(minutes) {
    let h = Math.floor(minutes / 60);
    let m = minutes % 60;
    let period = h >= 12 ? "PM" : "AM";
    let hour12 = h % 12;
    if (hour12 === 0) {
        hour12 = 12;
    }
    let minuteStr = m.toString();
    if (m < 10) {
        minuteStr = "0" + m;
    }
    return hour12 + ":" + minuteStr + " " + period;
}

function timeTo12hrFormat(timeString) {
    let parts = timeString.split(":");
    let hours = parseInt(parts[0], 10);
    let minutes = parts[1];
    let suffix = "AM";
    if (hours >= 12) {
        suffix = "PM";
        if (hours > 12) hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }
    return `${hours}:${minutes} ${suffix}`;
}

function renderCalendar() {
    let months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let calendarBody = document.getElementById("calendarBody");
    let monthYearHeader = document.getElementById("monthYear");
    calendarBody.textContent = "";
    monthYearHeader.textContent = months[currentMonth.month] + " " + currentMonth.year;

    let weeks = currentMonth.getWeeks();
    for (let w in weeks) {
        let row = document.createElement("tr");
        let days = weeks[w].getDates();

        for (let d = 0; d < 7; d++) {
            let cell = document.createElement("td");

            if (days[d]) {
                let day = days[d];
                cell.textContent = day.getDate();
                cell.setAttribute("data-date", day.toISOString().split("T")[0]);

                if (day.getMonth() === currentMonth.month) {
                    if (day.toDateString() === new Date().toDateString()) {
                        cell.classList.add("today");
                    }
                } else {
                    cell.classList.add("other-month");
                }
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}


//cite: https://www.w3schools.com/w3css/w3css_animate.asp
let calendarElement = document.querySelector(".calendar");
function changeMonth(isNext) {
    if (isNext) {
        calendarElement.classList.add("calendar-slide-left");
    } else {
        calendarElement.classList.add("calendar-slide-right");
    }

    calendarElement.addEventListener('transitionend', function onTransitionEnd() {
        calendarElement.classList.remove("calendar-slide-left", "calendar-slide-right");
        if (isNext) {
            currentMonth = currentMonth.nextMonth();
        } else {
            currentMonth = currentMonth.prevMonth();
        }
        updateCalendar();
        calendarElement.removeEventListener('transitionend', onTransitionEnd);
    });
}


document.getElementById("next_month_btn").addEventListener("click", function () {
    document.getElementById("event-creator").classList.remove("active");
    document.getElementById("event-widget").classList.remove("show");
    changeMonth(true);
});

document.getElementById("prev_month_btn").addEventListener("click", function () {
    document.getElementById("event-creator").classList.remove("active");
    document.getElementById("event-widget").classList.remove("show");
    changeMonth(false);
});

function attachCellListeners() {
    let cells = document.querySelectorAll(".calendar td");
    cells.forEach(function (cell, index) {
        cell.addEventListener("click", function (e) {
            e.stopPropagation();
            let widget = document.getElementById("event-creator");
            let clickedDate = this.getAttribute("data-date");
            if (widget.classList.contains("active")) {
                widget.classList.remove("active");
                currentSelectedDate = null;
                return;
            }
            currentSelectedDate = clickedDate;
            $("#time-range-slider").slider("values", [480, 1020]);
            $("#time-range-display").val(
                minutesToTime(480) + " - " + minutesToTime(1020)
            );
            let cellRect = this.getBoundingClientRect();
            let containerRect = document.getElementById("calendar-container").getBoundingClientRect();
            if (index % 7 <= 3) {
                widget.style.left = (cellRect.right - containerRect.left + 158) + "px";
            } else {
                widget.style.left = (cellRect.left - containerRect.left - 115) + "px";
            }
            widget.style.top = (cellRect.top - containerRect.top) + "px";
            widget.classList.add("active");
            document.getElementById("event-widget").classList.remove("show");
        });
    });
}

function fetchAndDisplayEvents() {
    fetch("display-event.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: currentMonth.year, month: currentMonth.month + 1 })
    })
        .then(response => response.json())
        .then(data => {
            let eventsArray = [];
            if (data && data.length > 0) {
                eventsArray = data;
            } else if (data && data.events && data.events.length > 0) {
                eventsArray = data.events;
            }
            let selectedTags = [];
            document.querySelectorAll("#tags input[type='checkbox']:checked").forEach(checkbox => {
                selectedTags.push(checkbox.value);
            });
            document.querySelectorAll(".calendar-event").forEach(eventElem => eventElem.remove());

            if (eventsArray.length > 0) {
                document.getElementById("event-display").style.display = "block";
            } else {
                document.getElementById("event-display").style.display = "none";
            }
            eventsArray.forEach(function (event) {
                let cell = document.querySelector('td[data-date="' + event.event_date + '"]');
                if (!(selectedTags.some(tag => event.tags.includes(tag)))) {
                    return;
                }
                if (cell) {
                    let eventElem = document.createElement("div");
                    let startTime12hr = timeTo12hrFormat(event.start_time);
                    eventElem.classList.add("calendar-event");
                    eventElem.textContent = `${startTime12hr}  ${event.title}`;
                    switch (event.tags) {
                        case 'personal':
                            eventElem.classList.add("personal");
                            break;
                        case 'work':
                            eventElem.classList.add("work");
                            break;
                        case 'school':
                            eventElem.classList.add("school");
                            break;
                        case 'other':
                            eventElem.classList.add("other");
                            break;
                    }
                    cell.appendChild(eventElem);
                    eventElem.addEventListener("click", function (e) {
                        e.stopImmediatePropagation();
                        openEventWidget(event, eventElem, e);
                    });
                    document.getElementById("close-widget").addEventListener("click", function () {
                        document.getElementById("event-widget").classList.remove("show");
                    })
                    let contextMenu = document.getElementById("event-context-menu");
                    eventElem.addEventListener("contextmenu", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const deleteEventBtn = document.getElementById("delete-event");
                        deleteEventBtn.removeEventListener("click", deleteEventHandler);

                        function deleteEventHandler() {
                            deleteEvent(event.id, eventElem);
                        }
                        deleteEventBtn.addEventListener("click", deleteEventHandler);
                        const eventRect = eventElem.getBoundingClientRect();
                        contextMenu.style.top = (eventRect.bottom + 5) + "px";
                        contextMenu.style.left = eventRect.left + 75 + "px";
                        contextMenu.classList.add("show");
                    });
                    document.addEventListener("click", function () {
                        contextMenu.classList.remove("show");
                    });
                }
            });
        })
        .catch(error => {
            console.error("Error fetching events:", error);
        });
}

document.querySelectorAll("#tags input[type='checkbox']").forEach(function (checkbox) {
    checkbox.addEventListener("change", fetchAndDisplayEvents);
});

function deleteEvent(eventId, eventElem) {
    let csrf = document.getElementById("login-token").value;
    fetch("delete-event.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            event_id: eventId,
            csrf, csrf
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                eventElem.remove();
            } else {
                console.error("Error deleting event:", data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}


function updateCalendar() {
    renderCalendar();
    if (isUserLoggedIn) {
        attachCellListeners();
        fetchAndDisplayEvents();
    } else {
        document.getElementById("event-display").style.display = "none";
    }
}

function openEventWidget(event, eventElem, clickEvent) {
    clickEvent.stopPropagation();
    const widget = document.getElementById("event-widget");
    const widgetTitle = document.getElementById("widget-title");
    const widgetDate = document.getElementById("widget-date");
    const widgetTime = document.getElementById("widget-time");
    const clockIcon = document.createElement("i");
    clockIcon.className = "fa fa-clock";
    const dateParts = event.event_date.split("-");
    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]);
    const day = Number(dateParts[2]);
    const date = new Date(year, month - 1, day);
    const widgetLocation = document.getElementById("widget-location");
    //cite: https://www.w3schools.com/jsref/jsref_tolocalestring.asp
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });
    const monthDay = date.toLocaleString('en-US', { month: 'long', day: 'numeric' });
    const calendarIcon = document.createElement("i");
    calendarIcon.className = "fa fa-calendar-alt";
    widgetTitle.textContent = event.title;
    widgetDate.textContent = '';
    widgetDate.appendChild(calendarIcon);
    widgetDate.appendChild(document.createTextNode(` ${weekday}, ${monthDay}`));
    const eventTime = `${timeTo12hrFormat(event.start_time)} - ${timeTo12hrFormat(event.end_time)}`;
    widgetTime.textContent = "";
    widgetTime.appendChild(clockIcon);
    widgetTime.appendChild(document.createTextNode(" " + eventTime));
    if (event.location != null && event.location.trim() != "") {
        const locationIcon = document.createElement("i");
        locationIcon.className = "fas fa-map-marker-alt";
        widgetLocation.textContent = '';
        widgetLocation.appendChild(locationIcon);
        widgetLocation.appendChild(document.createTextNode(` ${event.location}`));
    } else {
        widgetLocation.textContent = "";
    }

    widget.setAttribute("data-event-id", event.id);
    widget.setAttribute("data-event-date", event.event_date);
    widget.setAttribute("data-start-time", event.start_time);
    widget.setAttribute("data-end-time", event.end_time);
    widget.setAttribute("data-tag", event.tags);
    widget.setAttribute("data-location", event.location);
    const container = document.getElementById("calendar-container");
    if (container) {
        const containerRect = container.getBoundingClientRect();
        widget.style.top = (clickEvent.clientY - containerRect.top + 30) + "px";
        widget.style.left = (clickEvent.clientX - containerRect.left) + "px";
    } else {
        widget.style.top = (clickEvent.clientY + 5) + "px";
        widget.style.left = clickEvent.clientX + "px";
    }

    widget.classList.add("show");
    document.getElementById("event-details").style.display = "block";
    document.getElementById("event-creator").classList.remove("active");
    document.getElementById("event-display").style.display = "block";
    document.getElementById("share-event").style.display = "none";
    widget.style.display = "block";
}
document.getElementById("share-event-btn").addEventListener("click", function (event) {
    document.getElementById("share-event").style.display = "flex";
    document.getElementById("event-display").style.display = "none";
    document.getElementById("event-details").style.display = "none";
    fetchUsers();
});
document.getElementById("edit-event-btn").addEventListener("click", function (event) {
    document.getElementById("event-display").style.display = "none";
    document.getElementById("event-editor").style.display = "flex";
    document.getElementById("save-event").style.display = "inline-flex";
    document.getElementById("cancel-edit").style.display = "inline-flex";
    document.getElementById("event-details").style.display = "none";


    const widget = document.getElementById("event-widget");
    const title = document.getElementById("widget-title").textContent;
    const eventDate = widget.getAttribute("data-event-date");
    const startTime = widget.getAttribute("data-start-time");
    const endTime = widget.getAttribute("data-end-time");
    const eventId = widget.getAttribute("data-event-id");
    let eventTag = widget.getAttribute("data-tag");
    editTag = eventTag;
    const eventLocation = widget.getAttribute("data-location");


    document.getElementById("widget-title-input").value = title;
    document.getElementById("widget-date-input").value = eventDate;
    document.getElementById("widget-start-time-input").value = startTime;
    document.getElementById("widget-end-time-input").value = endTime;
    document.getElementById("event-id").value = eventId;
    if (eventLocation == "null") {
        document.getElementById("edit-event-location").value = "";
    }
    else {
        document.getElementById("edit-event-location").value = eventLocation;
    }

    initMapEditor();
    const dropdownLabel = document.getElementById("dropdown-label-edit");
    let foundTag = false;
    document.querySelectorAll("#tags-dropdown-edit a").forEach(function (link) {
        if (link.getAttribute("data-value") === eventTag) {
            link.classList.add("active");
            dropdownLabel.textContent = link.textContent;
            foundTag = true;
        } else {
            link.classList.remove("active");
        }
    });
    if (!foundTag) {
        document.getElementById("dropdown-label-edit").textContent = "Select a tag";
    }
});

document.getElementById("edit-dropdown").addEventListener("click", function (e) {
    e.stopPropagation();
    const dropdown = document.getElementById("tags-dropdown-edit");
    const arrow = document.getElementById("tag-arrow-edit");

    if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
        arrow.textContent = "▼";
    } else {
        dropdown.classList.add("show");
        arrow.textContent = "▲";
    }
});

document.querySelectorAll("#tags-dropdown-edit a").forEach(function (link) {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        editTag = this.getAttribute("data-value");
        document.getElementById("dropdown-label-edit").textContent = this.textContent;
        document.getElementById("tags-dropdown-edit").classList.remove("show");
        document.getElementById("tag-arrow-edit").textContent = "▼";
        document.querySelectorAll("#tags-dropdown-edit a").forEach((el) => el.classList.remove("active"));
        this.classList.add("active");
    });
});

document.getElementById("save-event").addEventListener("click", function (e) {
    e.preventDefault();
    const updatedTitle = document.getElementById("widget-title-input").value;
    const updatedDate = document.getElementById("widget-date-input").value;
    const updatedStartTime = document.getElementById("widget-start-time-input").value;
    const updatedEndTime = document.getElementById("widget-end-time-input").value;
    const updatedLocation = document.getElementById("edit-event-location").value
    const eventId = document.getElementById("event-id").value;
    const csrf = document.getElementById("edit-token").value;
    const tag = editTag;

    document.getElementById("event-editor").style.display = "none";
    document.getElementById("save-event").style.display = "none";
    document.getElementById("cancel-edit").style.display = "none";
    if (marker) {
        const locationTitle = marker.getTitle();
        document.getElementById('edit-event-location').value = locationTitle;
        document.getElementById('map-modal').style.display = 'none';
    }

    grecaptcha.ready(function () {
        grecaptcha.execute("6LcS4OIqAAAAAHmo-mzM7UWBlhfmxvyh7SNs2_us", { action: "edit_event" })
            .then(function (token) {
                document.getElementById("edit-recaptcha-token").value = token;
            });
    });

    fetch("edit-event.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: updatedTitle,
            date: updatedDate,
            start_time: updatedStartTime,
            end_time: updatedEndTime,
            event_id: eventId,
            tag: tag,
            csrf: csrf,
            location: updatedLocation
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("event-widget").classList.remove("show");
                updateCalendar();
            }
            else {
                console.error("Fail", data);
                document.getElementById("event-widget").classList.remove("show");
                updateCalendar();
            }
        })
        .catch(error => console.error("Error saving event:", error));
});
document.getElementById("cancel-edit").addEventListener("click", function () {
    document.getElementById("event-editor").style.display = "none";
    document.getElementById("save-event").style.display = "none";
    document.getElementById("cancel-edit").style.display = "none";
    document.getElementById("event-details").style.display = "block";
});

/* jQuery UI Slider cite: https://api.jqueryui.com/slider/ */
function initSlider() {
    $(function () {
        $("#time-range-slider").slider({
            range: true,
            min: 0,
            max: 1439,
            step: 5,
            values: [480, 1020],
            slide: function (event, ui) {
                $("#time-range-display").val(
                    minutesToTime(ui.values[0]) +
                    " - " +
                    minutesToTime(ui.values[1])
                );
            }
        });
        $("#time-range-display").val(
            minutesToTime($("#time-range-slider").slider("values", 0)) +
            " - " +
            minutesToTime($("#time-range-slider").slider("values", 1))
        );
    });
}

function fetchToken() {
    fetch("get_token.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("login-token").value = data.token;
            document.getElementById("signup-token").value = data.token;
            document.getElementById("creator-token").value = data.token;
            document.getElementById("edit-token").value = data.token;
            document.getElementById("share-token").value = data.token;
        })
        .catch(error => console.error("Token fetch error:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
    fetchToken();
    initSlider();
});

//reCAPTCHA cite: https://developers.google.com/recaptcha/docs/v3
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    grecaptcha.ready(function () {
        grecaptcha.execute("6LcS4OIqAAAAAHmo-mzM7UWBlhfmxvyh7SNs2_us", { action: "login" })
            .then(function (token) {
                document.getElementById("login-recaptcha-token").value = token;
                loginAjax();
            });
    });
});

document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();
    grecaptcha.ready(function () {
        grecaptcha.execute("6LcS4OIqAAAAAHmo-mzM7UWBlhfmxvyh7SNs2_us", { action: "signup" })
            .then(function (token) {
                document.getElementById("signup-recaptcha-token").value = token;
                signupAjax();
            });
    });
});

document.getElementById("logout").addEventListener("click", logoutUser);

document.getElementById("open-login").addEventListener("click", function () {
    let loginCurtain = document.getElementById("loginCurtain");
    let signupCurtain = document.getElementById("signupCurtain");
    loginCurtain.classList.toggle("active");
    signupCurtain.classList.remove("active");
    document.getElementById("newuser").value = "";
    document.getElementById("newpassword").value = "";
    document.getElementById("confirmpassword").value = "";
    document.getElementById("signup-message").textContent = "";
});

document.getElementById("open-signup").addEventListener("click", function () {
    let signupCurtain = document.getElementById("signupCurtain");
    let loginCurtain = document.getElementById("loginCurtain");
    signupCurtain.classList.toggle("active");
    loginCurtain.classList.remove("active");
    document.getElementById("username").value = "";
    document.getElementById("message").textContent = "";
    document.getElementById("password").value = "";
});

// Open and close navigation overlay cite: https://www.w3schools.com/howto/howto_js_curtain_menu.asp)
document.getElementById("open").addEventListener("click", openNav, false);
document.getElementById("close").addEventListener("click", closeNav, false);

let tag = "";
document.getElementById("create-dropdown").addEventListener("click", function (e) {
    e.stopPropagation();
    const dropdown = document.getElementById("tags-dropdown");
    const arrow = document.getElementById("tag-arrow");

    if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
        arrow.textContent = "▼";
    } else {
        dropdown.classList.add("show");
        arrow.textContent = "▲";
    }
});


document.querySelectorAll("#tags-dropdown a").forEach(function (link) {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        tag = this.getAttribute("data-value");
        document.getElementById("dropdown-label").textContent = this.textContent;
        document.getElementById("tags-dropdown").classList.remove("show");
        document.getElementById("tag-arrow").textContent = "▼";
    });
});

let map;
let marker;
let geocoder;
let locationInput;
//citation for google maps api setup and funvtion: https://developers.google.com/maps/documentation/javascript/place-autocomplete
async function initMapEditor() {
    const { Map } = await google.maps.importLibrary("maps");
    geocoder = new google.maps.Geocoder();
    locationInput = document.getElementById('edit-event-location');
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 38.6488, lng: 90.3108 },
        zoom: 12
    });

    const autocomplete = new google.maps.places.Autocomplete(locationInput);
    autocomplete.setFields(['place_id', 'geometry', 'name']);
    autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            map.setCenter(place.geometry.location);
            if (!marker) {
                marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name
                });
            } else {
                marker.setPosition(place.geometry.location);
            }
            locationInput.value = place.name;
        }
    });
}
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    geocoder = new google.maps.Geocoder();
    locationInput = document.getElementById('event-location');
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 38.6488, lng: 90.3108 },
        zoom: 12
    });

    const autocomplete = new google.maps.places.Autocomplete(locationInput);
    autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            map.setCenter(place.geometry.location);
            if (!marker) {
                marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name
                });
            } else {
                marker.setPosition(place.geometry.location);
            }
        }
    });
}

document.getElementById("create-event").addEventListener("submit", function (e) {
    e.preventDefault();
    let eventTitle = document.getElementById("title").value;
    let eventTimeRange = document.getElementById("time-range-display").value;
    let date = currentSelectedDate;
    let times = eventTimeRange.split(" - ");
    let startTime = times[0];
    let endTime = times[1];
    let csrf = document.getElementById("creator-token").value;
    let location = document.getElementById('event-location').value;
    if (marker) {
        const locationTitle = marker.getTitle();
        document.getElementById('event-location').value = locationTitle;
        document.getElementById('map-modal').style.display = 'none';
    }
    let data = {
        eventTitle: eventTitle,
        startTime: startTime,
        endTime: endTime,
        date: date,
        tag: tag,
        location: location,
        csrf: csrf
    };

    grecaptcha.ready(function () {
        grecaptcha.execute("6LcS4OIqAAAAAHmo-mzM7UWBlhfmxvyh7SNs2_us", { action: "create_event" })
            .then(function (token) {
                document.getElementById("creator-recaptcha-token").value = token;
            });
    });
    fetch("create-event.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                document.getElementById("event-creator").classList.remove("active");
                updateCalendar();
            } else {
                console.error("Creation Failed");
            }
        })
        .catch(err => {
            console.error("Database error:", err);
        });

});

const dropdown = document.getElementById('dropdown');
const tags = document.getElementById('tags');
dropdown.addEventListener('click', function () {
    tags.classList.toggle('show');

    const arrow = document.getElementById('arrow');
    if (tags.classList.contains('show')) {
        arrow.textContent = '∧';
    } else {
        arrow.textContent = '∨';

    }
});

document.addEventListener("click", function (e) {
    const widget = document.getElementById("event-widget");
    const eventCreator = document.getElementById("event-creator");
    const contextMenu = document.getElementById("event-context-menu");
    const autocompleteWidget = $(".ui-autocomplete");

    if (!e.target.closest("#event-widget") && !e.target.closest("#event-creator") && !autocompleteWidget.is(e.target) && !autocompleteWidget.has(e.target).length) {
        widget.style.display = "none";
        document.getElementById("event-display").style.display = "block";
        document.getElementById("event-editor").style.display = "none";
        document.getElementById("save-event").style.display = "none";
        document.getElementById("cancel-edit").style.display = "none";

        if (eventCreator && eventCreator.classList.contains("active") && !e.target.closest("#event-creator")) {
            eventCreator.classList.remove("active");
        }
    }

    if (contextMenu && !contextMenu.contains(e.target)) {
        contextMenu.classList.remove("show");
    }

    const dropdown = document.getElementById("tags-dropdown");
    const dropdownLabel = document.getElementById("dropdown-label");
    const tagArrow = document.getElementById("tag-arrow");

    if (dropdown && !e.target.closest("#dropdown-container") && dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
        tagArrow.textContent = "▼";
        dropdownLabel.textContent = "Select Tags";
    }
});

let usersList = [];
function fetchUsers() {
    let csrfToken = document.getElementById("share-token").value;
    fetch("fetch-users.php", {
        method: "POST",
        body: JSON.stringify({ csrf: csrfToken }),
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(data => {
            usersList = data.users;
            initializeAutocomplete();
        })
        .catch(error => console.error("Error fetching users:", error));
}
//cite: https://jqueryui.com/autocomplete/
function initializeAutocomplete() {
    $('#user-search').autocomplete({
        source: function (request, response) {
            const filteredUsers = usersList.filter(user =>
                user.username.toLowerCase().includes(request.term.toLowerCase())
            );
            response(filteredUsers.map(user => ({
                label: user.username,
                value: user.username,
                id: user.id
            })));
        },
        minLength: 2,
        select: function (event, ui) {
            $(this).val(ui.item.value);
            $(this).attr('data-user', ui.item.value);
            $(this).attr('data-user-id', ui.item.id);
            return false;
        }
    });
}
document.getElementById("share").addEventListener("submit", function (e) {
    e.preventDefault();
    const userId = $("#user-search").attr("data-user-id");
    const csrfToken = document.getElementById("share-token").value;
    const eventId = document.getElementById("event-widget").getAttribute("data-event-id");
    fetch("share-event.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            event_id: eventId,
            user_id: userId,
            csrf: csrfToken
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const successMessage = document.getElementById("share-success");
                successMessage.textContent = `Event shared with ${document.getElementById("user-search").value}`;
                successMessage.style.display = "block";

                document.getElementById("user-search").value = "";
                document.getElementById("user-search").removeAttribute("data-user-id");

            } else {
                alert("Error sharing event: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error sharing event:", error);
            alert("An error occurred while sharing the event");
        });
});