# Bitespeed Backend Task: Identity Reconciliation

## Project Overview

This project implements a simple identity reconciliation system using Node.js, Express, and SQLite. The purpose is to manage contact information and link related contacts to a primary contact.

## Project Structure

bitespeed-task/
├── dist/
├── node_modules/
├── src/
│ ├── db.ts
│ ├── index.ts
│ └── routes/
│ └── identify.ts
├── database.sqlite
├── tsconfig.json
├── package.json
├── package-lock.json

- **src/db.ts**: Sets up and initializes the SQLite database.
- **src/index.ts**: Configures and starts the Express server.
- **src/routes/identify.ts**: Implements the `/identify` endpoint for handling identity reconciliation.

## Setup and Running the Project

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)

### Installation

1. Clone the repository:
   git clone https://github.com/hrid-chakraborty/bitespeed-backend-task-hrid.git
   cd bitespeed-backend-task-hrid

2. Install dependencies:
   npm install

### Build and Run

1. Compile TypeScript to JavaScript:
   npx tsc

2. Run the compiled JavaScript code:
   node dist/index.js

The server should now be running on http://localhost:3000

### API Endpoints

POST /identify
Description: Identify and reconcile contacts based on email and phone number.

Request Body:

{
  "email": "example@example.com",
  "phoneNumber": "1234567890"
}

Response:

{
  "contact": {
    "primaryContactId": 1,
    "emails": ["example@example.com", "another@example.com"],
    "phoneNumbers": ["1234567890", "0987654321"],
    "secondaryContactIds": [2, 3]
  }
}

### Project Details

1. Database File: The SQLite database is stored in the database.sqlite file, create automatically in the project directory when the application is first run.
    
2. Initialization: The database is initialized with a contacts table if it does not already exist.
