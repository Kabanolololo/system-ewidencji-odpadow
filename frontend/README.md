
# README - React Frontend Setup & Run Guide

Thank you for using this React frontend project! Below you will find instructions on how to install, run, and develop the React application.

---

# 1. Requirements

Make sure you have the following installed:

- Node.js (v14 or newer recommended)
- npm (comes with Node.js) or yarn
- Git

---

# 2. Clone the Repository

Open your terminal or command line and run:

```bash
git clone https://github.com/Kabanolololo/system-ewidencji-odpadow
cd frontend
```

---

# 3. Install Dependencies

Install the necessary packages using npm or yarn:

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

This will install all dependencies listed in `package.json`, including React Router.

---

# 4. Run the Application

Start the React development server with:

Using npm:

```bash
npm run dev
```

Or using yarn:

```bash
yarn dev
```

The app will be available at:

```
http://localhost:3000
```

React Router is already configured to enable SPA (Single Page Application) behavior.

---

# 5. Build for Production

To create an optimized production build, run:

Using npm:

```bash
npm run build
```

Or using yarn:

```bash
yarn build
```

This will generate static files in the `build/` directory, ready to be served by any static file server or integrated with your FastAPI backend.

---

# 6. Additional Notes

- This frontend communicates with the FastAPI backend via API calls (make sure your backend is running and accessible).
- If you want to customize routes or add new pages, edit the React Router configuration inside the `src` directory.
- For deployment, serve the contents of the `build/` folder using a static server or integrate with FastAPI's static files serving.

---

If you encounter any issues or need further assistance, feel free to open an issue or contact the project maintainer.
