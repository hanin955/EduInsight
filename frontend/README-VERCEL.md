Deploying the frontend to Vercel

1) Connect the repo to Vercel and set the root directory to `frontend`.
2) Vercel detects the project and uses `package.json`.

Build settings (if Vercel doesn't auto-detect):
- Build Command: `npm run build`
- Output Directory: `dist`

Environment Variables (set in Vercel > Settings > Environment Variables):
- `VITE_API_URL` = `https://<your-backend>.onrender.com/api`

Notes:
- The app reads the API base URL from `import.meta.env.VITE_API_URL` (fallback: http://localhost:5000/api).
- `vercel.json` is included to ensure the `dist` directory is used and SPA routes are served correctly.
