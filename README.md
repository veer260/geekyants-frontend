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


AI in My Development Workflow
Which AI tools I used and how
ChatGPT (GPT-5) – for generating boilerplate code, exploring different approaches to UI design, and quickly prototyping React/TypeScript components using react-hook-form, yup, and shadcn/ui.

GitHub Copilot – for inline code completions, repetitive function scaffolding, and faster refactoring during iterative changes.

Cursor IDE’s AI integration – for context-aware refactoring and searching through the codebase without leaving the editor.

vercel's v0 – for creating UI mockups to visualize components before building them.

Specific examples of how AI accelerated my development
Form Creation – In the “Create Project” page, AI generated a full form with validation (React Hook Form + Yup) in minutes, including multiple fields and a custom multi-select UI for skills.

ShadCN Integration – Instead of manually reading docs for each component, AI provided pre-wired imports and Tailwind classes for consistent styling.


Challenges I faced with AI-generated code and how I resolved them
Over-generalized code – AI sometimes provided generic examples that didn’t fully match my existing architecture. I resolved this by pasting relevant parts of my code so AI could tailor its suggestions.

Missing type safety – Early AI outputs had loose typing (any), which I replaced with proper TypeScript interfaces and yup inference.

Library version mismatches – AI occasionally used outdated shadcn or react-hook-form syntax. I cross-checked with documentation and updated the code accordingly.

Unoptimized re-renders – Some AI solutions caused unnecessary re-renders. I fixed this by memoizing computed values and using React.useCallback where needed.

My approach to validating and understanding AI suggestions
Read and reason – I never paste AI code blindly. I first read through it, ensuring I understand every line and why it’s there.

Check documentation – I verify APIs against the official docs for libraries like React, Tailwind, shadcn, and react-hook-form.

Small tests – I integrate AI code in small parts and run local tests to confirm it works as expected before scaling it up.

Refactor for clarity – Even if AI output works, I rewrite sections for readability and maintainability.

Version control – I commit frequently so I can revert easily if AI suggestions cause regressions.
