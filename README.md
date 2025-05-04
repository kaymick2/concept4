# Informatic - Job Search Platform

## Overview

Informatic is a modern job search platform built with React and AWS services, designed to connect job seekers with employers in the technology sector. The platform implements separate authentication systems for regular users and employers, comprehensive job posting capabilities, and advanced profile management features.

## Core Features

### Job Seekers
- Secure user authentication through AWS Cognito
- Comprehensive profile creation and management system
- Advanced job search functionality with filtering capabilities
- Personalized job listing management with save feature
- Cloud-based profile picture storage using AWS S3
- Dedicated access to Research Experience for Undergraduates (REU) opportunities

### Employers
- Dedicated employer authentication system
- Complete job posting management interface
- Customizable company profile system
- Integrated applicant tracking functionality
- Enhanced signup process with additional company attributes

## Technical Architecture

### Frontend Technologies
- React 19.0.0: Core UI framework
- React Router DOM 7.3.0: Client-side routing
- React Bootstrap 2.10.9: UI component library
- AWS Amplify UI React 6.9.3: AWS service integration
- Bootstrap 5.3.3: Responsive styling framework
- Vite 6.2.0: Build and development tooling

### Backend Services
- AWS Cognito: User authentication and authorization
- Amazon S3: Secure file storage and management
- AWS Amplify: Backend service integration
- DynamoDB: NoSQL database for scalable data storage

## Development Setup

### Prerequisites
- Node.js (LTS version)
- npm package manager
- AWS account with appropriate permissions

### Installation
1. Clone the repository
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Configure AWS Amplify:
   - Regular user configuration: `src/amplify-config.js`
   - Employer configuration: `src/amplify-employer-config.js`

### Development Workflow
- Start development server:
  ```bash
  npm run dev
  ```
- Build production version:
  ```bash
  npm run build
  ```

## Project Structure

```
concept4/
├── src/
│   ├── components/
│   │   ├── Authenticator/    # Authentication components
│   │   ├── Home/             # Home page components
│   │   ├── JobPages/         # Job-related components
│   │   └── Profile/          # User profile components
│   ├── context/              # React context providers
│   ├── utils/                # Utility functions
│   ├── amplify-config.js     # AWS configuration for users
│   └── amplify-employer-config.js # AWS configuration for employers
├── public/                   # Static assets
└── package.json             # Project dependencies
```

## Authentication Implementation

### User Authentication
- Email-based registration and verification
- Password requirements: Minimum 8 characters
- Multi-factor authentication: Disabled
- Required attributes: Email address

### Employer Authentication
- Enhanced registration process
- Required attributes:
  - Email address
  - Physical address
  - Company name (Nickname)
- Separate authentication pool for enhanced security

## AWS Configuration

### Cognito User Pools
- Regular Users: us-east-2_JT1Zv1m5E
- Employers: us-east-2_7LkBrXGsh

### S3 Configuration
- Bucket: userprofilepics-informatic
- Region: us-east-2

## Development Tools

### Available Scripts
- `npm run dev`: Launch development server
- `npm run build`: Create production build
- `npm run preview`: Preview production build
- `npm run lint`: Execute ESLint checks

## Contributing Guidelines

Contributors should:
- Adhere to existing code style conventions
- Submit pull requests for new features or bug fixes
- Include appropriate documentation updates

## License

This project is private and confidential. All rights reserved.