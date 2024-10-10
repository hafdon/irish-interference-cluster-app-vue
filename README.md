# Irish Word Audio Player

A Vue 3 application that allows users to search for Irish words, view related words within the same cluster, and play regional audio pronunciations. The app features autocomplete suggestions, responsive design, and dynamic error handling for an enhanced user experience.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Autocomplete Search:** Provides real-time suggestions as users type, enhancing search efficiency.
- **Cluster-Based Word Display:** Shows all words within the same cluster as the searched word.
- **Regional Audio Playback:** Offers audio pronunciations for Connacht, Munster, and Ulster regions.
- **Dynamic Error Handling:** Utilizes toast notifications to inform users of any issues without disrupting the workflow.
- **Responsive Design:** Ensures optimal viewing and interaction across various devices and screen sizes.

## Technologies Used

- **Vue 3:** Frontend framework for building user interfaces.
- **Vite:** Fast and modern build tool for Vue.js projects.
- **Tailwind CSS:** Utility-first CSS framework for responsive and customizable styling.
- **vue3-simple-typeahead:** Autocomplete component for Vue 3.
- **Axios:** Promise-based HTTP client for API requests.
- **Howler.js:** JavaScript library for audio playback.
- **Vue Toastification:** Toast notification library for Vue 3.
- **JSON Server:** Mock REST API for serving word data.

## Installation

### Prerequisites

- **Node.js & npm:** Ensure you have Node.js (v14 or later) and npm installed. [Download Node.js](https://nodejs.org/)

### Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/irish-word-audio-player.git
   cd irish-word-audio-player
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

- 2b. **(Optional) Check vite installation location**

  ```bash
  # Check local installation
  npm list vite

  # Check global installation (Prefer using local)
  npm list -g vite
  ```

3. **Set Up JSON Server:**

   - Ensure `json-server` is installed globally. If not, install it:

     ```bash
     npm install -g json-server
     ```

   - Start the JSON server to serve `db.json`:

     ```bash
     json-server --watch db.json --port 3000
     ```

     The API will be accessible at `http://localhost:3000/interferesIds`.

4. **Start the Vue Application:**

   In a separate terminal window, run:

   ```bash
   npm run dev

   # to run using the Nginx server as api
   npm run dev:nginx

   # to run using json-server as api
   npm run dev:jsonServer

   ```

   The app will typically be available at `http://localhost:5173/`.

## Usage

1. **Open the Application:**

   Navigate to `http://localhost:5173/` in your web browser.

2. **Search for an Irish Word:**

   - Begin typing an Irish word in the search bar.
   - Select a suggestion from the autocomplete dropdown or press Enter to search.

3. **View Cluster Words:**

   - After searching, the app displays all words within the same cluster as the searched word.
   - Each word is accompanied by buttons for Connacht, Munster, and Ulster pronunciations.

4. **Play Audio:**

   - Click on a regional button to play the corresponding audio pronunciation.
   - If an audio file is unavailable, the button will be disabled, and a toast notification will inform you of the issue.

## Project Structure

```
irish-word-audio-player/
├── db.json
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.vue
│   └── main.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

- **`db.json`**: Contains mock data for JSON Server.
- **`src/`**: Contains Vue components and assets.
  - **`App.vue`**: Main application component.
  - **`main.js`**: Entry point of the Vue application.
- **Configuration Files**: Tailwind CSS, PostCSS, and Vite configurations.

## Troubleshooting

- **Autocomplete Not Showing Suggestions:**

  - Ensure JSON Server is running and accessible at `http://localhost:3000/interferesIds`.
  - Verify that `allWords` is correctly fetched by checking the network tab in developer tools.

- **Tailwind CSS Styles Not Applying:**

  - Confirm that Tailwind directives are included in `src/index.css`.
  - Ensure `index.css` is imported in `main.js`.
  - Restart the development server after making changes to Tailwind configurations.

- **Audio Not Playing:**

  - Check if the audio URL is correct by testing it directly in the browser.
  - Ensure there are no CORS issues preventing audio from loading.
  - Verify that the `howler` library is correctly handling audio events.

- **Toast Notifications Not Appearing:**
  - Ensure Vue Toastification is correctly installed and configured in `main.js`.
  - Verify that `useToast` is imported and initialized in `App.vue`.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

2. **Create a Feature Branch:**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes:**

   ```bash
   git commit -m "Add your message here"
   ```

4. **Push to the Branch:**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).
