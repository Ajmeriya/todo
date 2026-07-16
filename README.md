# Todo

Todo list app with a Spring Boot backend and a React frontend.

## Structure

- `backend/` Spring Boot REST API with H2 database
- `frontend/` React + Vite user interface

## Run Backend

```bash
cd backend
mvn spring-boot:run
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend uses `http://localhost:5173` and talks to the backend on `http://localhost:8080`.
