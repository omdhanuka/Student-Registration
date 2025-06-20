# Student Registration System

A simple React-based student registration system that allows management of course types, courses, course offerings, and student registrations.

## Features

### Course Types Management
- Create new course types (e.g., Individual, Group, Special)
- List existing course types
- Update course types
- Delete course types (with validation to prevent deletion if in use)

### Courses Management
- Create new courses (e.g., Hindi, English, Math)
- List existing courses
- Update courses
- Delete courses (with validation to prevent deletion if in use)

### Course Offerings Management
- Create course offerings by combining course types and courses
- List all available course offerings
- Update course offerings
- Delete course offerings (with validation to prevent deletion if in use)

### Student Registrations
- Register students for available course offerings
- List all registered students
- Filter registrations by course type
- View students registered for specific course offerings

## Technical Details

- Built with React 18 and React Router 6
- Data persistence using browser localStorage
- Styled with Tailwind CSS
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/your-username/student-registration-system.git
cd student-registration-system
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Deployment

The application can be deployed to various platforms:

### Deploying to Netlify

1. Create a Netlify account
2. Build the production version:
```
npm run build
```
3. Drag and drop the `build` folder to Netlify's dashboard
   
### Deploying to Vercel

1. Install Vercel CLI:
```
npm install -g vercel
```
2. Deploy:
```
vercel
```

## Project Structure

- `/src`: Source code
  - `/components`: React components
  - `/App.js`: Main application component with routing
  - `/index.js`: Application entry point

## Data Structure

All data is stored in the browser's localStorage with the following keys:
- `courseTypes`: Array of strings
- `courses`: Array of strings
- `courseOfferings`: Array of objects with `id`, `type`, `course`, and `date` properties
- `registrations`: Array of objects with `id`, `student`, `type`, `course`, and `date` properties

## Future Enhancements

Potential improvements for the system:
- User authentication and authorization
- Server-side storage with a database
- Export/import data functionality
- Dark mode support
