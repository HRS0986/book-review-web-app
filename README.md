# Book Review Hub

A full-stack web application for browsing, adding, editing, and deleting book reviews.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)

## Features

- **CRUD Functionality**: Create, Read, Update, and Delete book reviews.
- **Responsive Design**: Intuitive and accessible UI for various devices.
- **Rating System**: Add ratings (1-5 stars) for books.
- **Automatic Timestamps**: Reviews are timestamped with the date of creation.
- **Sorting and Filtering Option**: Implement filtering option based on rating and sorting by date added.

## Tech Stack

### Frontend
- **Framework**: React with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS with ShadcnUI

### Backend
- **Framework**: Python FastAPI

### Database
- **Database**: MySQL
- **Containerization**: Docker

## Backend Setup

### Prerequisites
- Install [Python 3.12.5](https://www.python.org/downloads/)
- Install Docker for database setup

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/HRS0986/book-review-web-app.git
   ```

2. Navigate to the backend directory:
   ```bash
   cd book-review-web-app
   cd Backend
   ```

3. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```

4. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Mac/Linux:
     ```bash
     source venv/bin/activate
     ```

5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

6. Run docker-compose to start the database:
   ```bash
   docker-compose up -d
   ```

7. Start the backend server on port 8000:
   ```bash
   uvicorn app.main:app --port 8000 --reload
   ```

## Frontend Setup

### Prerequisites
- Install [Node.js](https://nodejs.org/) for React development

### Installation Steps

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```