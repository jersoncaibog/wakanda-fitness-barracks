# Wakanda Fitness Barracks - RFID Attendance System

A simple RFID-based attendance tracking system for a local fitness center. This is a freelance/sideline project built with vanilla JavaScript, HTML, and CSS.

## Features

- RFID-based member check-in
- Member management (Add, Edit, Delete)
- Attendance records tracking
- Dashboard with real-time statistics
- Dark/Light theme support
- Responsive design for all devices

## Tech Stack

- Frontend:
  - HTML5
  - CSS3 (with Bootstrap 5)
  - Vanilla JavaScript
  - Font Awesome icons
- Backend:
  - Node.js
  - Express.js
  - MariaDB

## Local Development Setup

1. Install dependencies:

   ```bash
   # Install backend dependencies
   cd backend
   npm install
   ```

2. Configure database:

   - Create a MariaDB database
   - Copy `.env.example` to `.env` and update the database credentials
   - Run the schema and sample data SQL files from `backend/src/config/`

3. Start the server:

   ```bash
   # From the backend directory
   npm run dev
   ```

4. Open `index.html` in your browser or use a local server

## Project Structure

- `/assets` - Frontend assets (CSS, JS, images)
- `/components` - Reusable HTML components
- `/backend` - Node.js/Express backend
  - `/src/config` - Database and server configuration
  - `/src/controllers` - Request handlers
  - `/src/models` - Database models
  - `/src/routes` - API routes

## Note

This is a freelance/sideline project created for a local fitness center. It's designed to be simple and efficient, focusing on core functionality without unnecessary complexity.
