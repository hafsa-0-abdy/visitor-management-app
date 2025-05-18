
# Royal Park Estate Security System
## Habsa Abdirizack 
## 06/05/2025

A comprehensive web application for managing visitor access in a residential estate. This system helps residents, security staff, and administrators work together to enhance estate security through streamlined visitor management.

## Features

### For Residents
- Pre-register expected visitors with detailed information
- View visitor history and track visitor status
- Receive real-time notifications when visitors arrive

### For Security Staff (Watchmen)
- Track and verify expected visitors
- Mark visitor arrival status and process check-ins
- Real-time dashboard with pending visitor information

### For Administrators
- Comprehensive user management
- Activity tracking and security logs
- System configuration and oversight

## Technology Stack

- React.js for the frontend interface
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Shadcn UI for component library
- Recharts for dashboard analytics

## Installation and Setup

1. Clone the repository
```bash
git clone <your-repository-url>
cd royal-park-estate-security-system
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
