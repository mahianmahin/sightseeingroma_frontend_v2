
# Gemini Project Documentation

This file provides a comprehensive overview of the Sightseeingroma frontend v2 project, designed to assist Gemini in understanding and interacting with the codebase.

## Project Overview

This project is a frontend application for Sightseeingroma, a platform for booking sightseeing tours in Rome. It is built with React and utilizes a variety of modern web technologies.

### Key Technologies

*   **Framework:** React.js
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS, DaisyUI
*   **Routing:** React Router
*   **HTTP Client:** Axios
*   **Authentication:** Firebase
*   **Analytics:** Chart.js, React Google Charts
*   **Linting:** ESLint

### Project Structure

The project is organized into the following main directories:

*   **`public/`**: Contains static assets that are publicly accessible, such as images, JSON data, and the main `index.html` file.
*   **`src/`**: The main source code directory, containing all React components, hooks, layouts, pages, routes, and utility functions.
    *   **`src/assets/`**: Static assets that are imported into the application, such as images and logos.
    *   **`src/Components/`**: Reusable React components that are used across different pages.
    *   **`src/hooks/`**: Custom React hooks for managing state and side effects.
    *   **`src/Layouts/`**: Main layout components that define the overall structure of the application.
    *   **`src/Page/`**: Top-level page components that correspond to different routes in the application.
    *   **`src/routes/`**: The main routing configuration for the application.
    *   **`src/utilities/`**: Utility functions and helper modules.

### Important Files

*   **`package.json`**: Defines the project's dependencies, scripts, and other metadata.
*   **`vite.config.js`**: The configuration file for the Vite build tool.
*   **`tailwind.config.js`**: The configuration file for Tailwind CSS.
*   **`eslint.config.js`**: The configuration file for ESLint.
*   **`src/main.jsx`**: The main entry point for the React application.
*   **`src/App.jsx`**: The root component of the application.
*   **`src/routes/Routes.jsx`**: The main routing configuration file.

### Available Scripts

The following scripts are available in `package.json`:

*   **`dev`**: Starts the development server.
*   **`build`**: Builds the application for production.
*   **`lint`**: Lints the codebase using ESLint.
*   **`preview`**: Starts a local server to preview the production build.

### API Documentation

The project includes API documentation in the following files:

*   **`analytics_api_documentation.md`**: Documentation for the analytics API.
*   **`analytics_api_implementation.md`**: Implementation details for the analytics API.
*   **`profile_paeg_API_documentation.md`**: Documentation for the profile page API.

This documentation should provide a solid foundation for Gemini to understand the project and assist with development tasks.
