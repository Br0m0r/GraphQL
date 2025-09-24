# GraphQL Profile Page Project - Implementation Guide

## Project Overview
Create a profile page application that authenticates users and displays their school data from the GraphQL API, with SVG-based data visualizations. The application should be hosted online and meet all audit requirements.

## Technology Recommendations
- **Frontend**: Vanilla JavaScript with HTML/CSS
- **GraphQL**: Fetch API for GraphQL requests
- **Authentication**: Local storage for JWT management
- **SVG**: Manual implementation for graphs
- **Hosting**: GitHub Pages, Netlify, or Vercel

## Step-by-Step Implementation Guide

### 1. Project Setup (Simplest Approach)
- Create a basic folder structure:
  - `index.html` (Login page)
  - `profile.html` (Profile page)
  - `css/` folder for stylesheets
  - `js/` folder for JavaScript files
  - `js/auth.js` (Authentication handling)
  - `js/graphql.js` (GraphQL queries)
  - `js/profile.js` (Profile page logic)
  - `js/graphs.js` (SVG graph generation)

### 2. Authentication System Implementation
- **Login Page Requirements**:
  - Create a form accepting username/email and password
  - Submit credentials using Basic authentication (base64 encoded)
  - Send POST request to `https://((DOMAIN))/api/auth/signin`
  - Store JWT token in localStorage upon successful login
  - Display appropriate error messages for invalid credentials
  - Redirect to profile page after successful login

- **Authentication Logic**:
  - Function to encode credentials in base64
  - Function to send login request with proper headers
  - Function to store and retrieve JWT from localStorage
  - Function to check if user is authenticated
  - Logout function that clears JWT and redirects to login

### 3. GraphQL Integration
- **Core Query Types** (all three are mandatory):
  - Basic query: `{ user { id login } }`
  - Query with arguments: `{ object(where: { id: { _eq: 3323 }}) { name type } }`
  - Nested query: `{ result { id user { id login } } }`

- **Data Retrieval Strategy**:
  - Create functions to execute GraphQL queries with JWT Bearer token
  - Implement error handling for failed queries
  - Parse and transform response data for display and visualization
  - Create helper functions for data aggregation (e.g., total XP calculation)

### 4. Profile Page Structure
- **Header Section**:
  - User identification
  - Logout button

- **Three Information Sections** (choose from):
  - Basic user info (ID, login)
  - XP amount and history
  - Grades overview
  - Audit statistics
  - Skills progression

- **Statistics Section** (mandatory):
  - Container for SVG graphs
  - Display at least two different SVG-based graphs
  - Include legends and explanations for the graphs

### 5. SVG Graph Implementation
- **Graph Types** (implement at least two):
  - XP over time (line chart)
  - Project pass/fail ratio (pie chart)
  - Audit ratio (donut chart)
  - Skills distribution (bar chart)
  - Exercise attempts (histogram)

- **SVG Implementation Requirements**:
  - Generate SVG elements programmatically using JavaScript
  - Create reusable functions for common SVG elements (axes, labels, etc.)
  - Implement data scaling functions for proper visualization
  - Add interactivity (tooltips on hover, etc.) if time permits
  - Include proper legends and labels

### 6. Data Transformation
- **Aggregation Functions**:
  - Calculate total XP from transactions
  - Determine pass/fail ratios for projects
  - Format dates for time-based visualizations
  - Group data by categories (projects, exercises, etc.)

- **Graph Data Preparation**:
  - Transform raw API data into formats suitable for SVG graphs
  - Calculate percentages, ratios, and other derived values
  - Sort and filter data as needed for visualization

### 7. Hosting Setup
- **Preparation**:
  - Ensure all paths are relative for hosting compatibility
  - Test the application locally before deployment
  - Create a README file with project information

- **Deployment Options**:
  - GitHub Pages: Simple static site hosting directly from repository
  - Netlify: Drag-and-drop deployment or connect to repository
  - Vercel: Similar to Netlify with simple configuration

## Detailed Requirements to Pass Audit

### 1. Authentication
- **Login Page**:
  - Must accept both username:password and email:password
  - Must show appropriate error message for invalid credentials
  - Must successfully authenticate with valid credentials
  - Must securely store JWT token

- **Logout Functionality**:
  - Must clear JWT token
  - Must redirect to login page
  - Must prevent access to profile without authentication

### 2. Profile Sections
- **Layout Requirements**:
  - Must have exactly three information sections
  - Must have one additional statistics section with graphs
  - All sections must be clearly labeled and organized

- **Data Accuracy**:
  - All displayed information must match data from GraphQL API
  - Data must be properly formatted and labeled
  - Loading states should be implemented for data fetching

### 3. GraphQL Queries
- **Query Types**:
  - Must implement all three required query types (normal, with arguments, nested)
  - Queries must be efficient and fetch only necessary data
  - Must handle authentication errors and token expiration

### 4. SVG Graphs
- **Graph Requirements**:
  - Must include at least two different types of SVG graphs
  - Graphs must be generated using SVG elements (not chart libraries)
  - Graphs must accurately represent the queried data
  - Graphs should include labels, legends, and appropriate scales

### 5. Hosting
- **Deployment Requirements**:
  - Application must be accessible online
  - All features must work in the hosted environment
  - Authentication flow must work correctly on the hosted site

## Data Sources from GraphQL API

### Key Tables and Fields
- **User Table**: Basic user information
  - id, login

- **Transaction Table**: XP and other transactions
  - id, type, amount, objectId, userId, createdAt, path

- **Progress Table**: User progress records
  - id, userId, objectId, grade, createdAt, updatedAt, path

- **Result Table**: Project and exercise results
  - id, objectId, userId, grade, type, createdAt, updatedAt, path

- **Object Table**: Information about exercises and projects
  - id, name, type, attrs

## Implementation Tips

### Authentication
- Use `btoa()` for base64 encoding of credentials
- Store JWT in localStorage with proper error handling
- Check token existence before API calls

### GraphQL Queries
- Use the Fetch API for GraphQL requests
- Set Authorization header with Bearer token
- Structure queries to minimize data transfer

### SVG Creation
- Use `document.createElementNS()` for SVG elements
- Implement proper scaling functions for data visualization
- Add event listeners for interactive elements

### Data Processing
- Parse dates with `new Date()` for time-based charts
- Use reduce functions for data aggregation
- Implement helper functions for common calculations

### Responsive Design
- Use CSS flexbox/grid for layout
- Add media queries for different screen sizes
- Test on multiple devices if possible

## Final Checklist Before Submission
- [ ] Login works with both username and email
- [ ] Invalid credentials show appropriate error
- [ ] Profile page shows three information sections
- [ ] Statistics section contains at least two SVG graphs
- [ ] All data displayed matches the GraphQL API data
- [ ] All three query types are implemented
- [ ] Logout functionality works correctly
- [ ] Application is successfully hosted and accessible online
- [ ] UI is clean and organized
- [ ] Code is well-structured and maintainable

This guide provides a framework for implementing the GraphQL profile page while allowing flexibility in the specific implementation details. Focus on satisfying the audit requirements while keeping the solution as simple as possible.