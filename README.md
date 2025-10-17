# Clarifai Web Agent

This project is a lightweight, embeddable chatbot designed to be easily integrated into any website. It provides a simple chat interface for users to interact with a backend server, making it ideal for customer support, lead generation, or any other application that requires real-time communication.

<img width="1013" height="849" alt="Screenshot 2025-10-16 at 12 33 44" src="https://github.com/user-attachments/assets/01b97bf1-51f8-4364-b3b0-70064e744f3f" />

## Features

- **Lightweight and Embeddable:** The chatbot is designed to be minimal in size, ensuring it doesn't impact the performance of the host website.
- **Simple Integration:** Easily embed the chatbot into any website with a single script tag.
- **Chat-like Interface:** Provides a familiar chat interface for users to interact with.
- **Backend Agnostic:** The chatbot can be connected to any backend server that supports a simple JSON-based API.
- Backend included. We provide a NodeJS-based server as example (see `backend` folder)
    - Uses GPT-OSS model by default 
    - Markdown-to-HTML support (so user would see nice table for example)
    - Hard-coded system prompt
        - Protection against doing non-website-related LLM processing

## Getting Started

### Frontend

To use the chatbot, open the `index.html` file in your browser.

### Backend

The backend server is required for the chatbot to communicate with the Clarifai API. To set up and run the backend, follow these steps:

1.  **Navigate to the backend directory:**
    ```bash
    cd clarifai-web-agent/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set your Clarifai PAT:**
    Create a `.env` file in the `backend` directory and add your Clarifai Personal Access Token:
    ```
    CLARIFAI_PAT=REPLACE_WITH_YOUR_CLARIFAI_PAT
    ```
    Alternatively, you can set it as an environment variable in your shell.

4.  **Start the server:**
    ```bash
    npm start
    ```

The server will start on `http://localhost:3000`.


## Architecture vision
<img width="1357" height="797" alt="Screenshot 2025-10-17 at 13 41 31" src="https://github.com/user-attachments/assets/c8d236e8-a079-4bc9-9b42-a60fe651b3cb" />
