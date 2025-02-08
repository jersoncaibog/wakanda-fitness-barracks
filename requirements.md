# Project Requirements: RFID-Based Wakanda Fitness Barracks Attendance Web App

## Overview

This project involves building a simple web application using vanilla HTML and JavaScript to monitor daily attendance at a Wakanda Fitness Barracks. The system uses RFID for member identification and includes functionality for tracking membership status, membership expiration, and CRUD operations for both members and attendance records. The backend database will use MariaDB.

---

## Functional Requirements

### 1. RFID Integration

- **RFID Scanning**:
  - Retrieve member information using RFID tags.
  - Ensure compatibility with standard RFID readers.

### 2. Members Management

- **Create**:
  - Add new members with details (e.g., name, ID, RFID tag, membership status, expiration date).
- **Read**:
  - View member profiles and details.
- **Update**:
  - Edit member information (e.g., membership status, expiration date).
- **Delete**:
  - Remove member records from the system.

### 3. Attendance Records Management

- **Create**:
  - Add daily attendance records for members.
- **Read**:
  - View attendance records by date or member.
- **Update**:
  - Modify attendance records if needed.
- **Delete**:
  - Remove outdated or incorrect attendance records.

### 4. Pages

- **Members Page**:
  - List all members with their details (name, RFID, status, expiration).
  - Include search and filter functionality.
- **Records Page**:
  - Display daily attendance records.
  - Allow filtering by date or member.
- **About Us Page**:
  - Display information about the Wakanda Fitness Barracks.

---

## Non-Functional Requirements

### 1. Simplicity

- Focus on clean and straightforward functionality using vanilla HTML and JavaScript.

### 2. Scalability

- The app should handle a moderate number of members and records efficiently.

### 3. Usability

- Ensure the web app is user-friendly with an intuitive interface.
- Design for responsiveness on both desktop and mobile devices.

---

## Tech Stack

### Frontend

- **HTML**: Markup for the web pages.
- **CSS**: Styling for the web app.
- **Bootstrap**: Responsive design framework for UI components.
- **JavaScript**: Client-side functionality and interaction.

### Backend

- **MariaDB**: Database for storing member and attendance records.

### Other Tools

- **RFID Reader**: Hardware for scanning RFID tags.

---

## Database Schema

### Members Table

| Column            | Type     | Description                |
| ----------------- | -------- | -------------------------- |
| id                | INT (PK) | Unique identifier          |
| name              | VARCHAR  | Member's name              |
| rfid_tag          | VARCHAR  | RFID tag value             |
| membership_status | ENUM     | Active, Expired            |
| expiration_date   | DATE     | Membership expiration date |

### Records Table

| Column          | Type     | Description              |
| --------------- | -------- | ------------------------ |
| id              | INT (PK) | Unique identifier        |
| member_id       | INT (FK) | References Members table |
| attendance_date | DATE     | Date of attendance       |

---

## Milestones

### Phase 1: Setup and Basic Functionality

- Set up HTML, CSS, and JavaScript files.
- Implement RFID integration for identifying members.
- Create a simple MariaDB database with Members and Records tables.

### Phase 2: Page Development

- Develop the Members page with CRUD functionality.
- Develop the Records page for attendance tracking.
- Create an About Us page with static information.

### Phase 3: Testing and Refinements

- Test CRUD operations for members and records.
- Ensure RFID integration works seamlessly.
- Test responsiveness and usability.

### Phase 4: Deployment

- no deployment for now

---

## Project Structure

```plaintext
fitness-barracks-rfid/
├── index.html           # Main entry point (e.g., Dashboard or Home Page)
├── members.html         # Page for managing members
├── records.html         # Page for viewing attendance records
├── about.html           # Static page for About Us
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css # Bootstrap CSS for UI design
│   │   ├── styles.css       # Custom CSS for additional styling
│   ├── js/
│   │   ├── bootstrap.bundle.min.js # Bootstrap JS for interactivity
│   │   ├── main.js               # General logic for the app
│   │   ├── members.js            # Specific logic for the Members page
│   │   ├── records.js            # Specific logic for the Records page
│   │   ├── rfid.js               # Logic for RFID scanning integration
│   └── img/
│       ├── logo.png              # Wakanda Fitness Barracks logo
│       ├── favicon.ico           # Favicon for the app
│       ├── placeholder.jpg       # Placeholder images, if necessary
├── db/
│   ├── connection.sql      # SQL script for creating the database schema
│   ├── seed.sql            # SQL script for populating dummy data
├── backend/
│   ├── api/
│   │   ├── members-api.php # Handles CRUD for members
│   │   ├── records-api.php # Handles CRUD for records
│   └── db-config.php       # Database connection configuration
└── README.md               # Documentation and setup instructions
```

---

## Notes

- Use environment variables to manage database connection details securely.
- Avoid over-complicating the UI or features to maintain simplicity and usability.
