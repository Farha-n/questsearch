# QuestSearch

## Overview

QuestSearch is a web application designed to facilitate the search and retrieval of questions based on user queries. It leverages a modern tech stack, including React for the frontend and Node.js with Express for the backend, along with MongoDB for data storage and gRPC for efficient communication between services.

## Features

- *Search Functionality*: Users can search for questions using keywords, with results displayed in a paginated format.
- *Question Types*: Supports multiple question types, including Multiple Choice Questions (MCQ) and Multiple Correct Answers (MCM).
- *Real-time Feedback*: Users receive immediate feedback on their selected answers.
- *Responsive Design*: The application is designed to be user-friendly and responsive across various devices.

## Tech Stack

- *Frontend*: 
  - React
  - Axios
  - Vite (for development and build)

- *Backend*:
  - Node.js
  - Express
  - gRPC (for service communication)
  - MongoDB (for data storage)



### Architecture

The application follows a microservices architecture, where the frontend and backend are decoupled. The backend is responsible for handling data operations and business logic, while the frontend focuses on user interaction and presentation.

### Components

1. *Frontend*:
   - Built with React, providing a dynamic user interface.
   - Utilizes Axios for making HTTP requests to the backend.
   - Implements a search input for querying questions and displays results in a list format.

2. *Backend*:
   - Express server handles RESTful API requests.
   - gRPC service for efficient communication with the question search functionality.
   - MongoDB is used to store questions, with a schema designed to accommodate various question types and options.

### Data Flow

1. *User Interaction*: Users enter a search query in the frontend.
2. *API Request*: The frontend sends a POST request to the /search endpoint of the backend.
3. *gRPC Call*: The backend processes the request and makes a gRPC call to fetch questions from the database.
4. *Response Handling*: The backend returns the questions and total count to the frontend, which updates the UI accordingly.

## Installation

### Prerequisites

- Node.js
- MongoDB
- Access to a gRPC-compatible environment

### Setup

1. Clone the repository:
   bash
   git clone <repository-url>
   cd questsearch
   

2. Install dependencies for the frontend:
   bash
   cd frontend
   npm install
   

3. Install dependencies for the backend:
   bash
   cd backend
   npm install
   

4. Set up environment variables:
   - Create a .env file in the backend directory and add your MongoDB URI and ports.

5. Start the backend server:
   bash
   cd backend
   node index.js
   

6. Start the frontend development server:
   bash
   cd frontend
   npm run dev
   

## Usage

- Open your browser and navigate to http://localhost:5173 to access the application.
- Use the search bar to find questions based on your input.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.


## Acknowledgments

- Thanks to the contributors and the open-source community for their invaluable resources and support.
