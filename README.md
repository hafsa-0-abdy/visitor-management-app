
# Royal Park Estate Security System

**Date:** 06/05/2025  
**By:** Hafsa Abdirizack Mohamed

## Description

The **Royal Park Estate Security System** is a comprehensive web application designed to enhance security in residential estates through streamlined visitor management. It provides an intuitive platform for residents to pre-register visitors, security staff to verify and process visitor arrivals, and administrators to oversee the entire system. With features such as visitor registration, real-time notifications, and activity logging, the system improves communication between residents and security staff, ensuring a safer living environment.

## Problem Statement

Many residential estates face security challenges that impact resident safety:
- **Inefficient Visitor Processing:** Manual visitor registration leads to delays at entry points and security vulnerabilities
- **Poor Communication:** Lack of proper channels between residents and security staff causes confusion and unauthorized entries
- **Limited Oversight:** Without proper tracking systems, estate management lacks visibility into security operations
- **Inadequate Record Keeping:** Paper-based systems make it difficult to maintain and retrieve visitor history

## Proposed Solution

To address these challenges, the app offers the following features:

### For Residents
- **Visitor Pre-registration:** Register expected visitors with details like name, purpose, and expected arrival time
- **Visitor History:** Track past visitors and their status
- **Real-time Notifications:** Receive alerts when visitors arrive at the estate

### For Security Staff (Watchmen)
- **Visitor Verification:** Easily verify pre-registered visitors upon arrival
- **Check-in Processing:** Mark visitor status as arrived, denied, or departed
- **Real-time Dashboard:** View pending visitor information at a glance

### For Administrators
- **User Management:** Comprehensive control over resident and security staff accounts
- **Activity Logging:** Track all system activities for security auditing
- **System Configuration:** Configure security parameters and notification settings

## Features

- **Visitor Management** – Pre-register, track, and verify visitors with detailed information
- **Role-based Access** – Different interfaces for residents, security staff, and administrators
- **Real-time Notifications** – Instant alerts for visitor arrivals and security events
- **Activity Tracking** – Comprehensive logging of all system activities
- **Responsive Design** – Mobile-friendly interface for access anywhere

## Technologies Used

- **Frontend:**
  - React.js
  - React Router for navigation
  - Context API for state management
  - Tailwind CSS for styling
  - Shadcn UI for component library
  - Recharts for dashboard analytics

- **Other Tools:**
  - Local storage for demo data persistence
  - Responsive design for multiple device support

## Setup/Installation Instructions

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd royal-park-estate-security-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Access the Application
Open your browser and navigate to `http://localhost:5173`

## Demo Credentials

For demonstration purposes, you can use these credentials:

### Admin Login
- Email: admin@royalpark.com
- Password: admin123

### Resident Login
- Email: resident@royalpark.com
- Password: resident123

### Watchman Login
- Email: watchman@royalpark.com
- Password: watchman123

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/          # Layout components like Header, Footer
│   └── ui/              # Shadcn UI components
├── contexts/            # React context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components for each route
├── lib/                 # Utility functions
└── types/               # TypeScript type definitions
```

## How It Works

1. **Residents** register expected visitors with details like name, phone, expected arrival time, and purpose of visit.

2. **Security Staff** at the gate receive notifications of expected visitors and can verify them upon arrival.

3. **Administrators** have full system oversight, including user management and activity logs.

## Future Plans

- **Mobile App Integration:** Dedicated mobile applications for residents and security staff
- **Biometric Verification:** Enhanced security with fingerprint or facial recognition
- **Automated Number Plate Recognition:** Streamline vehicle entry for registered visitors
- **Integration with Smart Home Systems:** Connect with estate smart gate and intercom systems
- **Advanced Analytics:** Provide insights into visitor patterns and security trends

## Known Bugs

The app currently functions as expected. If you encounter any issues, please report them in the repository's Issues section.


## GitHub Repository

[View the Source Code on GitHub](https://github.com/hafsa-0-abdy/visitor-management-app)

## Support & Contact Details

For any issues, suggestions, or feedback, reach out to:
📧 Email: hafsaabdirizack0@gmail.com

## License

Licensed under the MIT License.

(c) 2025 Hafsa Abdirizack Mohamed
