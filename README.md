# EduInsight

## Deployment

EduInsight deploys as a Vite frontend and a Node/Express API backed by MongoDB.

### Backend on Render

1. Create a Render Blueprint from this repository. The root `render.yaml` configures the API service.
2. Set `MONGO_URI` to the MongoDB Atlas connection string.
3. Set `CLIENT_URL` to the deployed frontend origin, for example `https://eduinsight.vercel.app`.
4. Render generates `JWT_SECRET`; keep it private. `AI_API_KEY` is optional because the chatbot has a local fallback response.
5. Confirm `https://<backend-domain>/api/health` returns `{ "status": "ok" }`.

### Frontend on Vercel

1. Import the repository and set the project root directory to `frontend`.
2. Use `npm run build` as the build command and `dist` as the output directory.
3. Set `VITE_API_URL` to `https://<backend-domain>/api`.

The frontend Vercel configuration is in `frontend/vercel.json`. The backend stores uploaded files on its local filesystem, so production deployments need persistent disk storage or an object-storage adapter if uploads must survive redeploys or instance restarts.

### Local verification

```text
cd frontend && npm ci && npm run build
cd ../backend && npm ci --omit=dev && npm start
```

### Seed demo data

`backend/seed.js` clears the configured database before inserting demo departments, users, courses, lessons, quizzes, and related records. Run it only against a new or disposable database.

Locally, create `backend/.env` with a MongoDB connection string, then run:

```text
cd backend
npm ci --omit=dev
npm run seed
```

For the deployed Render database, open the backend service's Shell and run:

```text
npm run seed
```

The service must have `MONGO_URI` configured in Render first. Demo accounts use the password `Password123`; change these credentials before using seeded data in a real environment.