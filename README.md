## README

# Daily Expenses Sharing Application Backend

This project is the backend service for a daily expenses sharing application. The backend is built using Node.js, Express.js, and MongoDB. It manages user details, validates inputs, and handles expenses that can be split by exact amounts, percentages, or equally among participants.

## Objective

The objective of this project is to design and implement a backend for a daily expenses sharing application. This application allows users to add expenses and split them based on three different methods: exact amounts, percentages, and equal splits. It also manages user details, validates inputs, and generates downloadable balance sheets.

## Features

- **User Management:**
    - Register a new user
    - Login a user
    - Logout a user
    - Retrieve authenticated user's profile

- **Expense Management:**
    - Add a new expense
    - Retrieve all expenses
    - Retrieve an expense by ID
    - Update an expense
    - Delete an expense
    - Retrieve individual user expenses

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user and expense data.
- **Mongoose**: ODM library for MongoDB and Node.js.
- **bcrypt**: Library to hash passwords.
- **Cloudinary**: Cloud service for managing and delivering images and videos (integrate if needed for user avatars).

## API Endpoints

### User Endpoints

- **POST /register**
    - Registers a new user.
    - Body: `{ name, email, mobileNumber, password, gender, avatar }`

- **POST /login**
    - Logs in a user.
    - Body: `{ email, password }`

- **GET /me**
    - Retrieves authenticated user's profile.

- **GET /logout**
    - Logs out a user.

### Expense Endpoints

- **POST /expenses**
    - Adds a new expense.
    - Body: `{ description, amount, splitMethod, participants, createdBy }`

- **GET /expenses**
    - Retrieves all expenses.

- **GET /expenses/:id**
    - Retrieves an expense by ID.

- **PUT /expenses/:id**
    - Updates an expense.
    - Body: `{ description, amount, splitMethod, participants }`

- **DELETE /expenses/:id**
    - Deletes an expense.

- **GET /expenses/user/:userId**
    - Retrieves individual user expenses.

## Data Models

### User Model

```js
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },
    mobileNumber: { type: String, unique: true, required: true, trim: true, minlength: 10, maxlength: 15 },
    password: { type: String, required: true, select: false },
    avatar: { type: String },
    gender: { type: String, enum: ["male", "female"] }
}, { timestamps: true });
```

### Expense Model

```js
const expenseSchema = new mongoose.Schema({
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    splitMethod: { type: String, enum: ["equal", "exact", "percentage"], required: true },
    participants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, min: 0 },
        percentage: { type: Number, min: 0, max: 100 },
        status: { type: String, enum: ["pending", "settled"], default: "pending" }
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
```

## Setup and Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following environment variables:
      ```
      PORT=3000
      MONGODB_URI=<your-mongodb-uri>
      JWT_SECRET=<your-jwt-secret>
      ```

4. Start the server:
   ```sh
   npm start
   ```

5. The server will start on `http://localhost:3000`.
