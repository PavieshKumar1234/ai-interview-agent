# InterviewPro

InterviewPro is a Vite + React + TypeScript prototype for an AI-assisted interview workspace.

## Run locally

```bash
pnpm install
pnpm dev
```

Open the Vite URL shown in the terminal. Production builds use `pnpm build` and can be previewed with `pnpm start`.

Set `VITE_API_URL` in `.env.local` when connecting the frontend to a backend API. The current landing page uses a lightweight mock UI while dashboard modules are migrated into the React Router shell.
