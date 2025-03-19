# <img src="https://github.com/Swarup-Ranjan-Mondal/contests-tracker/blob/main/frontend/public/icon.png" alt="Contest Tracker" height="36"> Contest Tracker

A web application that helps competitive programmers track upcoming and past contests from multiple platforms like **Codeforces, LeetCode, and CodeChef**. Users can bookmark contests and link YouTube video solutions to past contests for easy reference.

<p align="center">
  <span>
    <img src="https://assets.codeforces.com/users/kguseva/comments/cf.png" alt="Codeforces Logo" width="150" />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://cdn.codechef.com/sites/all/themes/abessive/cc-logo.png" alt="CodeChef Logo" width="150" />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://cdn-images-1.medium.com/max/1600/1*gBkMCGTAdSk4tu17SCa7RQ.png" alt="LeetCode Logo" width="150" />
  </span>
</p>

## 🚀 Features

📅 **Track Ongoing and Upcoming Contests** – Stay updated with upcoming contests across platforms.  
📜 **View Past Contests** – Browse past contests along with problem solutions.  
🔖 **Bookmark Contests** – Save contests for future reference.  
🎥 **YouTube Video Integration** – Link video explanations to past contests.  
🔐 **User Authentication** – Secure login and signup with JWT authentication.  
🌗 **Dark/Light Theme Support** – Toggle between themes for a personalized experience.

## 🎥 **Project Walkthrough Video**

<p align="center">
  <a href="https://drive.google.com/file/d/1kLOQIPR0KEIOSD4jKhlWLDwzdwDC8-p_/view?usp=sharing" target="_blank">
    <img src="https://drive.google.com/thumbnail?id=1uh7UGg8g0lH31qEMyiB7MkBMMQK5yUg_" alt="Watch Product Walkthrough Video" width="600"/>
  </a>
</p>

## 🏗️ **Project Structure**

The project is organized into **four main directories**, each serving a distinct purpose:

```bash
📦 Contest Tracker
├── 📂 backend              # Backend API and database logic
├── 📂 contests-scrapper    # Scrapers for fetching contest data
├── 📂 frontend             # React-based user interface
└── 📂 yt-playlist-fetcher  # YouTube video fetching and linking
```

## 📌 **Backend** (`backend/`)

The backend is responsible for handling API requests, managing user authentication, storing contest data, and supporting YouTube video link management. Built with **Node.js**, **Express.js**, and **MongoDB**.

### 🚀 **API Endpoints**

#### 🔑 **Authentication Endpoints**

- **`POST /api/auth/signup`** → 📝 **Register** a new user.
- **`POST /api/auth/login`** → 🔐 **Login** and authenticate an existing user.

#### 🗓️ **Contest Management Endpoints**

- **`GET /api/contests`** → 📅 Fetch upcoming contests with pagination.
- **`GET /api/contests/past`** → ⏳ Fetch past contests with pagination.
- **`POST /api/contests/bookmark`** → ⭐ Bookmark a contest.
- **`GET /api/contests/bookmarks`** → 📖 Retrieve all bookmarked contests.
- **`DELETE /api/contests/bookmark`** → ❌ Remove a bookmarked contest.
- **`GET /api/contests/:contestId`** → 🔎 Get details of a specific contest using its ID.
- **`PUT /api/contests/:contestId/youtube-link`** → 🎥 Link or update YouTube video solutions for a contest.

### 🗂️ **Database Models**

The backend uses **MongoDB** to store data efficiently.

- **🧑‍💼 User Model**

  - **Name** → User's full name.
  - **Email** → Unique identifier for each user.
  - **Password** → Securely stored using encryption.
  - **Bookmarks** → List of contest IDs bookmarked by the user.

- **🏁 Contest Model**
  - **Name** → Contest name.
  - **Platform** → Codeforces, CodeChef, or LeetCode.
  - **URL** → Link to the contest page.
  - **Start Time & End Time** → Timestamps for contest duration.
  - **YouTube URL** → Optional YouTube solution link.

### 🛡️ **Middleware**

Middleware ensures secure and authenticated access to protected routes using **JWT (JSON Web Token)**.

- **`authMiddleware.js`** → Validates user tokens, protecting contest-related routes and user-specific actions.
  - ✅ Checks if the JWT token is present and valid.
  - ✅ Ensures only authenticated users can bookmark contests or link YouTube videos.

## 📌 **Contests Scraper** (`contests-scrapper/`)

The **Contests Scraper** is a microservice that is responsible for **fetching contest data** from various coding platforms and storing it in the database. It ensures that users have access to the latest and most accurate contest information.

> Supported Platforms:  
> ✅ **Codeforces**  
> ✅ **CodeChef**  
> ✅ **LeetCode**

### ⚙️ **Services**

The scraper uses the following services for managing database connections and handling data:

- 🗄️ **`connectDB.js`** → Establishes a connection to the **MongoDB** database using Mongoose. Ensures stable and secure data management.
- 🔎 **`contestsService.js`** → Manages the entire scraping process, calls platform-specific scrapers, and updates contest information in the database.

### 🧑‍💻 **Scrapers**

Each platform has a dedicated scraper responsible for extracting contest data using platform APIs or web scraping.

- 🟢 **`codeforcesScraper.js`** →

  - Fetches **upcoming and past contests** from **Codeforces** using its public API.
  - Efficiently extracts contest name, contest URL, start time, and duration.

- 🟠 **`codechefScraper.js`** →

  - Fetches contest data from **past, present, and future contests** for **CodeChef**.
  - Efficiently extracts contest name, contest URL, contest start time, and contest end time.

- 🟡 **`leetcodeScraper.js`** →
  - Utilizes **LeetCode's API** and runs **GraphQL queries** to fetch **upcoming and past contests**.
  - Efficiently extracts contest title, contest URL, start time, and contest duration.

### 🕰️ **Automated Scheduling**

The scraper service uses **Node.js Cron Jobs** to keep the contest database up-to-date by running every 6 hours. It operates in the background using PM2, and the interval can be easily adjusted for timely updates.

## 📌 **Frontend** (`frontend/`)

The **Frontend** is built using **React + Vite** for fast performance and an intuitive user experience. It allows users to seamlessly track contests, bookmark them, and link YouTube solutions. The UI is responsive and supports both **light** and **dark** themes.

### 🧑‍💻 **Pages**

- 🏠 **Home** → View all **ongoing and upcoming contests** with easy filtering and search options.
- 📅 **Past Contests** → Browse **past contests** with the option to watch linked YouTube solutions.
- 🔐 **Login** → Secure **authentication page** for user login.
- ✍ **Signup** → Register new users with a simple sign-up form.
- 🔗 **Link Solution** → Attach **YouTube video solutions** to past contests for reference.

### 🧩 **Components**

- 🧭 **Navbar** → Responsive **navigation bar** with options for **theme toggle** and accessing user details.
- 🏷️ **ContestCard** → Displays detailed information about contests using a clean, card-based UI.
- 🛠️ **PlatformFilter** → Easily filter contests based on their platform (**Codeforces**, **LeetCode**, or **CodeChef**).
- 🔎 **Pagination** → Provides smooth and optimized pagination for large contest datasets.
- 🔒 **ProtectedRoute** → Ensures only **authenticated users** can access specific pages using JWT.

### 🧑‍🤝‍🧑 **Context Management**

The app uses **React Context API** for state management, ensuring a seamless user experience:

- 🛡️ **AuthContext** →

  - Manages user **authentication** state across the app.
  - Handles user login, registration, and logout functionality.

- 🌙 **ThemeContext** →
  - Allows users to toggle between **light** and **dark** themes.
  - Automatically persists theme preferences using local storage.

## 📌 **YouTube Playlist Fetcher** (`yt-playlist-fetcher/`)

The **YouTube Playlist Fetcher** is a microservice that is responsible for **fetching video solutions** from curated YouTube playlists. It intelligently matches these videos with their respective **past contests** using efficient algorithms. This feature helps users find reliable video solutions quickly.

> Platforms Supported for Video Matching:  
> ✅ **Codeforces**  
> ✅ **CodeChef**  
> ✅ **LeetCode**

### ⚙️ **Services**

The following services handle the **database connection** and the **YouTube API integration**:

- 🗄️ **`connectDB.js`** →

  - Establishes a stable connection to the **MongoDB** database.
  - Ensures smooth data storage and retrieval for matched videos.

- 📹 **`youtubeService.js`** →

  - Connects to the **YouTube Data API** using the provided API key.
  - Fetches videos from playlists and extracts metadata like title, description, and URL.

- 📁 **`fileService.js`** →
  - Handles the reading and writing of video data to **JSON files**.
  - Ensures efficient storage of video details for offline access.

### 🛠️ **Handlers**

- 🔎 **`dataHandler.js`** →
  - Controls the overall process of **fetching and storing YouTube videos**.
  - Ensures videos are processed, filtered, and associated with relevant contests.

### 🧑‍💻 **Comparators**

Specialized comparators efficiently **match contests with video solutions** using text similarity algorithms:

- 🟢 **`codeforcesComparator.js`** →

  - Matches videos with **Codeforces contests** using intelligent title matching.

- 🟠 **`codechefComparator.js`** →

  - Compares contest data and identifies relevant videos for **CodeChef contests**.

- 🟡 **`leetcodeComparator.js`** →
  - Fetches solutions from LeetCode playlists and links them to past **LeetCode contests**.

### 🕰️ **Automated Scheduling**

The scraper service uses **Node.js Cron Jobs** to fetch YouTube Video URLs from playlists automatically. It runs every **6 hours** to keep the database updated and operates in the background using **pm2**. The interval can be adjusted to run at specific desired intervals to ensure:

- ✅ **The contest database stays up-to-date**
- ✅ **Video links are fetched as soon as they are available**
- ✅ **Manual intervention is minimized**

Once a solution video is uploaded, the system will **automatically fetch and link it** to the respective contest without requiring any manual effort.

## ⚙️ Environment Variables

Set the following variables in a `.env` file before running the project:

```env
MONGO_URI=your-mongodb-connection-uri
JWT_SECRET=your-jwt-secret-key
YOUTUBE_API_KEY=your-youtube-data-api-key
CODEFORCES_YT_PLAYLIST_ID=your-codeforces-playlist-id
CODECHEF_YT_PLAYLIST_ID=your-codechef-playlist-id
LEETCODE_YT_PLAYLIST_ID=your-leetcode-playlist-id
```

## 🚀 **Running the Project**

Follow these steps to set up and run each part of the Contest Tracker project.

### 🛡️ **Backend**

1. 📁 Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. 📦 Install dependencies:
   ```bash
   npm install
   ```
3. 🏁 Start the server:
   ```bash
   npm start
   ```

### 🧹 **Contests Scraper**

1. 📁 Navigate to the `contests-scrapper` directory:
   ```bash
   cd contests-scrapper
   ```
2. 📦 Install dependencies:
   ```bash
   npm install
   ```
3. 🚀 Start the scraper:
   ```bash
   npm start
   ```

### 💻 **Frontend**

1. 📁 Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. 📦 Install dependencies:
   ```bash
   npm install
   ```
3. 🌐 Start the development server:
   ```bash
   npm run dev
   ```
4. 🔎 Access the app at:
   ```bash
   http://localhost:5173
   ```

### 🎥 **YouTube Playlist Fetcher**

1. 📁 Navigate to the `yt-playlist-fetcher` directory:
   ```bash
   cd yt-playlist-fetcher
   ```
2. 📦 Install dependencies:
   ```bash
   npm install
   ```
3. 🚀 Start the fetcher:
   ```bash
   npm start
   ```

✅ **Note:** Ensure your `.env` files are correctly configured in each directory before running the services.
