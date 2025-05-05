# jobsearch - Modern Job Search Platform

## Overview

jobsearch is a modern, user-friendly job search platform built with React and AWS services. It focuses on providing a seamless experience for job seekers with features like job saving, profile management, and direct application links.

## Core Features

### For Job Seekers
- Secure authentication through AWS Cognito
- Personalized user profiles with customizable information
- Job search functionality with detailed job listings
- Save interesting jobs for later review
- Cloud-based profile picture storage using AWS S3
- Direct application links to job postings
- Mobile-responsive design with modern UI

### User Interface
- Clean, modern design with Comfortaa font styling
- Responsive image carousel showcasing platform features
- Intuitive navigation and user-friendly layout
- Consistent color scheme with signature green accent (#AAB493)

### Job Listings
- Featured jobs section on homepage
- Detailed job descriptions with company information
- Job location and company details
- Direct links to original job postings
- Save job functionality for registered users

## Technical Stack

### Frontend Technologies
- React: Core UI framework
- React Router DOM: Client-side routing
- React Bootstrap: UI component library
- AWS Amplify UI React: AWS service integration
- Vite: Build and development tooling

### Backend Services
- AWS Cognito: User authentication
- Amazon S3: Profile picture storage
- AWS Amplify: Backend integration
- DynamoDB: Data storage

## Project Structure

```
src/
├── components/
│   ├── Authenticator/    # Authentication components
│   ├── Home/             # Homepage and navigation
│   ├── JobPages/         # Job listing components
│   └── Profile/          # User profile management
├── context/              # React context providers
├── utils/                # Utility functions and services
└── assets/              # Static assets and images
```

## Development Setup

### Prerequisites
- Node.js (LTS version)
- npm package manager
- AWS account with appropriate permissions

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

### Available Scripts
- `npm run dev`: Launch development server
- `npm run build`: Create production build
- `npm run preview`: Preview production build

## Features Implementation

### Job Data Service
- Cached job data for improved performance
- Random selection of featured jobs
- Error handling for failed API requests

### User Interface
- Responsive carousel with overlay text
- Custom styling with Comfortaa font
- Consistent color scheme throughout
- Mobile-first responsive design

### Profile Management
- Profile picture upload capability
- Saved jobs management
- User authentication state management

## AWS Configuration

### Cognito Setup
- User authentication pool
- Required attributes: Email address
- Password requirements: Minimum 8 characters

### S3 Configuration
- Bucket: userprofilepics-informatic
- Region: us-east-2

## Contributing

Contributors should:
- Follow existing code style and conventions
- Test changes thoroughly before submitting
- Update documentation as needed

## License

This project is private and confidential. All rights reserved.