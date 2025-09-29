# SchedUCLA

This is a full-stack web application for planning and discovering events at UCLA.

Authors:
-   **Ian Utnehmer** ([@ian-utnehmer](https://github.com/ian-utnehmer))
-   **Samuel Ma** ([@samuelkma](https://github.com/samuelkma))
-   **Ethan Joshua Catay** ([@etnjcty](https://github.com/etnjcty))


## How to Run the App Locally

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/scheducla.git
cd scheducla
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Set up environmental variables

```bash
Create a .env in project root. Then, add the following:
# Place your service account .json in project root. You may want to add it to .git\info\exclude.
FIREBASE_SERVICE_ACCOUNT_PATH="ABSOLUTE_PATH_TO_SERVICE_ACCOUNT_FILE.json"
FIREBASE_PROJECT_ID="your_project_id" # For the server

# Vite config
VITE_GOOGLE_MAPS_API_KEY=your_api_key
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
VITE_FIREBASE_MEASUREMENT_ID="your_measurement_id"



```

### 4. Start backend server

```bash
cd ../server
node server.js
```

### 5. Start frontend React app

```bash
cd ../client
npm run dev
```

## Notes

- If the Google Map shows a watermark saying "For development purposes only", make sure your API key has billing enabled and the correct Maps API activated.
- You must be logged in to create an event.
- Events are created by clicking directly on the map.
