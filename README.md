# Contest Tracker

## Overview

The Contest Tracker is a web application designed to track programming contests from various platforms such as Codeforces, LeetCode, and CodeChef. It provides users with the ability to view upcoming and past contests, bookmark contests, and link YouTube video solutions to past contests.

## Project Structure

The project is divided into four main directories:

1. **backend**: Contains the server-side code, including API routes, controllers, models, and middleware.
2. **contests-scrapper**: Contains the scrapers for fetching contest data from different platforms and updating the database.
3. **frontend**: Contains the client-side code, built with React and Vite.
4. **yt-playlist-fetcher**: Contains the code for fetching YouTube playlist videos and matching them with past contests.

## Backend

### API Endpoints

#### Authentication

- **POST /api/auth/signup**: Register a new user.
- **POST /api/auth/login**: Login an existing user.

#### Contests

- **GET /api/contests**: Fetch upcoming contests with pagination.
- **GET /api/contests/past**: Fetch past contests with pagination.
- **POST /api/contests/bookmark**: Bookmark a contest.
- **GET /api/contests/bookmarks**: Get bookmarked contests.
- **DELETE /api/contests/bookmark**: Remove a bookmarked contest.
- **GET /api/contests/:contestId**: Fetch contest details by contestId.
- **PUT /api/contests/:contestId/youtube-link**: Update contest YouTube URL by contestId.

### Models

- **User**: Represents a user with fields for name, email, password, and bookmarks.
- **Contest**: Represents a contest with fields for name, platform, URL, start time, end time, and YouTube URL.

### Middleware

- **authMiddleware**: Middleware for authenticating users using JWT tokens.

### Controllers

- **contestController**: Contains the logic for fetching contests from the database.

## Contests Scrapper

### Services

- **connectDB**: Service for connecting to the MongoDB database.
- **contestsService**: Service for fetching contests from different platforms and updating the database.

### Scrapers

- **codeforcesScraper**: Scraper for fetching contests from Codeforces.
- **codechefScraper**: Scraper for fetching contests from CodeChef.
- **leetcodeScraper**: Scraper for fetching contests from LeetCode.

## Frontend

### Pages

- **Home**: Displays upcoming contests with filters and pagination.
- **PastContests**: Displays past contests with filters and pagination.
- **Login**: Login page for users.
- **Signup**: Signup page for new users.
- **LinkSolution**: Page for linking YouTube video solutions to past contests.

### Components

- **Navbar**: Navigation bar with links to different pages and theme toggle.
- **ContestCard**: Card component for displaying contest details.
- **PlatformFilter**: Component for filtering contests by platform.
- **Pagination**: Component for pagination.
- **ProtectedRoute**: Component for protecting routes that require authentication.

### Context

- **AuthContext**: Context for managing user authentication state.
- **ThemeContext**: Context for managing theme (dark/light) state.

## YouTube Playlist Fetcher

### Services

- **connectDB**: Service for connecting to the MongoDB database.
- **youtubeService**: Service for fetching videos from YouTube playlists.
- **fileService**: Service for reading and writing data to JSON files.

### Handlers

- **dataHandler**: Handler for fetching and storing YouTube playlist videos.

### Comparators

- **codeforcesComparator**: Comparator for matching Codeforces contests with YouTube videos.
- **codechefComparator**: Comparator for matching CodeChef contests with YouTube videos.
- **leetcodeComparator**: Comparator for matching LeetCode contests with YouTube videos.

## Environment Variables

The following environment variables are required for the project:

- **MONGO_URI**: MongoDB connection URI.
- **JWT_SECRET**: Secret key for JWT authentication.
- **YOUTUBE_API_KEY**: API key for YouTube Data API.
- **CODEFORCES_YT_PLAYLIST_ID**: YouTube playlist ID for Codeforces.
- **CODECHEF_YT_PLAYLIST_ID**: YouTube playlist ID for CodeChef.
- **LEETCODE_YT_PLAYLIST_ID**: YouTube playlist ID for LeetCode.

## Running the Project

### Backend

1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Contests Scrapper

1. Navigate to the `contests-scrapper` directory.
2. Install dependencies: `npm install`
3. Start the scrapper: `npm start`

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### YouTube Playlist Fetcher

1. Navigate to the `yt-playlist-fetcher` directory.
2. Install dependencies: `npm install`
3. Start the fetcher: `npm start`
