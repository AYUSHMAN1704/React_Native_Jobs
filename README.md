# React Native Jobs App

A full-stack React Native application that helps users find and apply for jobs. It features a custom backend connected to a Neon PostgreSQL database, secure JWT authentication, and real-time job fetching via the JSearch API.

## 🚀 Features

- **Custom User Authentication:** Full auth flow (Sign Up, Log In, Log Out) secured with JSON Web Tokens (JWT) and Bcrypt password hashing.
- **Protected Routing:** Expo Router is configured to automatically redirect unauthenticated users to the login screen, and logged-in users to the main app.
- **First-Time Username Setup:** After signing up, users are prompted to choose a unique `@username`, with smart suggestions generated from their email.
- **Live Job Data:** Integrates with the [JSearch API via RapidAPI](https://rapidapi.com/letscrape-6bRBa3QG1q/api/jsearch) to display real, live job listings (Popular & Nearby jobs).
- **Search Functionality:** Users can search for specific job titles or keywords and view paginated results.
- **Job Details:** Comprehensive job view featuring tabs for About, Qualifications, and Responsibilities.
- **Applied Jobs Tracking:** Users can apply for jobs directly from the app. Applications are securely saved to the Neon PostgreSQL database and can be reviewed or removed from the dedicated "Applied Jobs" screen.

## 🛠️ Tech Stack

### Frontend
- **React Native** & **Expo** (managed workflow)
- **Expo Router** for file-based routing and navigation
- **Expo SecureStore** for safe local JWT storage
- **Custom React Hooks** (e.g., `useFetch` for API calls)

### Backend
- **Node.js** & **Express** server
- **PostgreSQL** hosted on [Neon](https://neon.tech/)
- **pg** (node-postgres) for database queries
- **jsonwebtoken** for secure session management
- **bcryptjs** for hashing passwords

## 📂 Project Structure

```
.
├── app/
│   ├── (auth)/             # Authentication screens (Login, Register)
│   ├── (app)/              # Protected main app screens (Home, Search, Details, Applied Jobs)
│   └── _layout.js          # Root layout with auth routing logic
├── backend/
│   ├── server.js           # Express API server connecting to Neon Postgres
│   └── .env                # Backend environment variables (DATABASE_URL)
├── components/             # Reusable UI components (Cards, Headers, Footer)
├── context/
│   └── AuthContext.js      # Global state for user session and authentication
├── hook/
│   └── useFetch.js         # Custom hook for fetching jobs from RapidAPI
└── constants/              # Theme colors, fonts, icons, and images
```

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd React_Native_Jobs
```

### 2. Frontend Setup
Install frontend dependencies:
```bash
npm install
```

Create a `.env` file in the root directory for the JSearch API key:
```env
EXPO_PUBLIC_RAPID_API_KEY=your_rapidapi_key_here
```

### 3. Backend Setup
Navigate to the backend directory and install its dependencies:
```bash
cd backend
npm install express cors pg bcryptjs jsonwebtoken dotenv
```

Create a `.env` file inside the `backend/` directory:
```env
DATABASE_URL=your_neon_postgres_connection_string
```

### 4. Running the App

Start the backend server:
```bash
cd backend
node server.js
```

In a new terminal window, start the Expo app:
```bash
npm run android
# OR
npm run ios
# OR
npm start
```

*Note: The frontend is currently configured to point to `http://10.0.2.2:3000` (the Android emulator's localhost alias) for API requests. If running on iOS or a physical device, update `API_URL` in `context/AuthContext.js` to your machine's local IP address.*
