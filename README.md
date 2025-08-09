## Project: React + TypeScript + Vite (Tailwind, SWR, shadcn-style UI)

This is a Vite + React (TypeScript) frontend with Tailwind CSS v4, shadcn-style UI components, SWR for data fetching, React Hook Form + Yup for validation, and a simple auth context with protected routes.

### Prerequisites
- Node.js >= 18
- npm >= 9 (or pnpm/yarn if you prefer)

### Getting Started
1) Install dependencies:
```bash
npm install
```

2) Configure API base URL (if needed):
- The app uses a centralized base URL for all API calls defined in `src/constants.ts`.
```ts
// src/constants.ts
export const base_url = "http://localhost:3000/api"
```
Update this if your backend runs elsewhere.

3) Run the dev server:
```bash
npm run dev
```

4) Build for production:
```bash
npm run build
```

5) Preview the production build locally:
```bash
npm run preview
```

### Scripts
- `npm run dev` — Start Vite dev server
- `npm run build` — Type-check and build
- `npm run preview` — Preview the built app
- `npm run lint` — Run ESLint

### Routing Overview
Implemented via `react-router-dom` in `src/App.tsx`:
- Public:
  - `/login`
- Manager (protected):
  - `/manager` — Dashboard (lists projects)
  - `/projects/create` — Create Project form
  - `/projects/:projectId` — Project details
- Engineer (protected):
  - `/engineer/dashboard` — Engineer assignments
- Profile:
  - `/profile/me`

Navbar adapts the title by role (Engineer/Manager Dashboard). Role label shows near the user name.

### Auth Context
`src/providers/UserProvider.tsx` exposes a `UserContext` with:
- `user: User | null`
- `isLoading: boolean`
- `handleNewUser(newUser: User | null)` — set/clear user (used for login/logout)

Usage example:
```tsx
import { useContext } from 'react'
import { UserContext, type UserContextType } from './src/providers/UserProvider'

const { user, handleNewUser } = useContext(UserContext) as UserContextType
```

Protected routes use `ProtectedRoute` (`src/components/ProtectedRoute.tsx`).

### Data Fetching (SWR + centralized fetcher)
All API requests are routed through `src/lib/fetcher.ts`, which:
- Prefixes relative URLs with `base_url` from `src/constants.ts`
- Sends credentials (cookies) with every request
- Throws typed errors with `info` and `status` when responses are not OK

Examples:
```ts
import useSWR from 'swr'
import { fetcher, postFetcher } from './src/lib/fetcher'

// GET
const { data, error, isLoading } = useSWR('/projects', fetcher)

// POST
await postFetcher('/projects', { name: 'New', ... })
```

### Forms & Validation (React Hook Form + Yup)
The Create Project form (`/projects/create`) uses RHF + Yup for validation and shows good UX:
- Disabled past start dates (UI and schema)
- Disabled form while submitting
- Spinner + success/error banners
- Maps form fields to backend payload (requiredSkills, teamSize)

Minimal example:
```tsx
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({ name: yup.string().required() })
const { handleSubmit, register, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
```

### UI & Styling
- Tailwind CSS v4 configured in `src/index.css`
- shadcn-style components under `src/components/ui` (e.g., `button`, `input`, `card`, etc.)
- Responsive layouts for Login, Dashboard grid, and Create Project

### Cookies, CORS, and Auth
The centralized fetcher uses `credentials: 'include'`, so ensure your backend sets proper CORS headers and cookie flags:
- `Access-Control-Allow-Credentials: true`
- Allowed origin must match the frontend dev server

### Troubleshooting
- “Missing required fields” on create: ensure payload field names match backend expectations. The form maps to `{ name, description, startDate, endDate, status, requiredSkills, teamSize }`.
- Not redirected to the created project: confirm the API returns the new ID at `data._id` or `data.id`.
- 401s: verify cookies are sent and backend CORS is configured for credentials.
- Update `base_url` if your backend is not on `http://localhost:3000/api`.

### Tech Stack
- React 19, TypeScript, Vite 7
- Tailwind CSS 4
- SWR for data fetching
- React Hook Form + Yup
- Radix + shadcn-style UI

---
Maintained by the frontend team. PRs welcome.
