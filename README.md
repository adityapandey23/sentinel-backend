# Sentinel Backend

This is the backend service for the Sentinel application.

## Prerequisites

- **Docker**: Ensure you have Docker and Docker Compose installed on your machine.

## Getting Started

To start the application, simply run the following command in the root directory:

```bash
docker compose up -d
```

This command will start the backend service along with its dependencies (database and cache) in detached mode. The backend will be available at `http://localhost:8000`.

## Local Development & Tunneling (Important)

To avoid issues with external services like `ip-api.com`, it is highly recommended to use **ngrok** for tunneling.

### Prerequisites for Tunneling

- **ngrok**: You can download it [here](https://ngrok.com/download) (Free tier is sufficient).

### Steps to Tunnel

1. Ensure your backend is running (`docker compose up -d`).
2. Run the following command to expose port 8000:

   ```bash
   ngrok http 8000
   ```

3. You will receive a public forwarding URL (e.g., `https://<random-id>.ngrok-free.app`).
4. Use this URL to access the backend API from your frontend client, Postman, or other tools.
