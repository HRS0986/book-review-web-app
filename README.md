# Book Review Application - Books Review Hub

This is a full-stack web application that allows users to browse, add, edit, and delete book reviews. The project demonstrates proficiency in web development, RESTful API design, and responsive user interfaces.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)
- [Database Model](#database-model)
- [UI Design](#ui-design)
- [Additional Notes](#additional-notes)

---

## Features

- *CRUD Functionality*: Create, Read, Update, and Delete book reviews.
- *Responsive Design*: Intuitive and accessible UI for various devices.
- *Rating System*: Add ratings (1-5 stars) for books.
- *Automatic Timestamps*: Reviews are timestamped with the date of creation.
- *Sorting and Filtering Option*: Implement filtering option based on rating and sorting by date added.
---

## Tech Stack

### Frontend
*Framework*: React with Vite

*Language*: TypeScript

*Styling*: Tailwind CSS with ShadcnUI

### Backend
*Framework*: Python FastAPI


### Database
*Database*: MySQL

*Containerization*: Docker

---

## Backend Setup

### Prerequisites
-   Install [Python 3.12.5](https://www.python.org/downloads/).
-   Install Docker for database setup.

### Setup and Installation
1. Clone the repository:
   	git clone https://github.com/HRS0986/book-review-web-app.git

2. Navigate to the backend directory:
	cd book-review-web-app
    cd Backend

2. Create a Python virtual environment:
python -m venv venv

3. Activate the virtual environment:
-   Windows:
venv\Scripts\activate

- Mac/Linux:
source venv/bin/activate

4. Install dependencies:
pip install -r requirements.txt

5. Run docker-compose file for start the database
docker-compose up -d

6. Start the backend server on port 8000:
uvicorn app.main:app --port 8000 --reload

---

## Frontend Setup

### Prerequisites
-   Install [Node.js](https://nodejs.org/) for React development.


### Setup and Installation
1. Navigate to the frontend directory:
cd Frontend

2. Install dependencies:
npm install

3. Start the frontend development server:
npm run dev