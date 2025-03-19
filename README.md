# Googol Calendar

Googol Calendar is an interactive, secure web-based calendar application that enables users to create, manage, and share events seamlessly. Built using PHP, MySQL, JavaScript, and CSS, this project emphasizes dynamic event management with strong security features and an intuitive user interface.

## Features

### Calendar Display
- **Grid Layout**: Displays months in a grid format (5-6 weeks per month, 7-day columns)
- **Infinite Navigation**: Users can navigate through past and future dates without limitations
- **Visual Highlights**: Clearly distinguishes the current date and out-of-month days
- **Aesthetic**: Visually appealing aesthetic and colors;smooth transitions for opening and closing widgets and switching months.

### Event Management
- **Create Events**: Easily add events with title, date, start/end times, location, and tags
- **Edit & Delete**: Use context menu and click event listeners for event modifications and deletions via AJAX without page reloads
- **Color-Coded Tags**: Events are color-coded by tag (Personal, Work, School, Other) for quick visual identification
- **Location Integration**: Autocomplete for locations via Google Places API, with location details stored and displayed

### User & Sharing Features
- **User Authentication**: Secure login/logout system with persistent sessions and server-side credential validation. User passwords are hashed and salted before being stored.
- **Event Sharing**: Share events with other users through an autocomplete-based interface that excludes the current user using jquery ui.
- **Data Isolation**: Users cannot access or modify events belonging to other users.

### Security & Performance
- **CSRF Protection**: All state-changing operations require a CSRF token
- **SQL Injection Prevention**: All database queries are executed using prepared statements
- **XSS Prevention**: User input is properly escaped before output
- **HTTP-Only Sessions**: Session cookies are configured as HTTP-only to prevent client-side script access
- **AJAX Operations**: All Create, Read, Update, and Delete actions occur asynchronously for a smooth user experience
- **W3C Standards**: HTML and CSS are validated to ensure best practices and accessibility

## System Requirements
- **Backend**: PHP 7.4+ and MySQL 5.7+
- **Frontend**: JavaScript and jquery/jquery ui library
