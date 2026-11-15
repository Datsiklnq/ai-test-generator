# AI Test Generator

A Next.js application for generating QA test cases and automation scripts with OpenAI.

## Stack

- Next.js 15 / React 19
- TypeScript
- OpenAI API
- Firebase Authentication and Admin SDK / Firestore
- Tailwind CSS

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. In Firebase Console, create a project, enable **Authentication → Email/Password**, and create a service account for the Admin SDK.

3. Create a `.env.local` file:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-4o-mini

   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_web_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_web_app_id

   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_service_account_email
   FIREBASE_PRIVATE_KEY="your_firebase_private_key"
   ```

   The `NEXT_PUBLIC_*` values come from your Firebase Web App config. The non-public values are for the server-side Firebase Admin SDK only. Never commit `.env.local` or service-account credentials.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000/login, create an account, and sign in.

## Authentication and saved data

- Email/password Firebase Authentication is required for generation and saved-item API requests.
- API routes verify Firebase ID tokens with the Admin SDK.
- Saved documents are tagged with the authenticated user's UID. List, update, and delete operations are scoped to that UID.
- The generation endpoint enforces a Firestore transaction-based limit of 10 requests per authenticated user per minute. This is a baseline limit; tune it for expected usage and add monitoring/abuse controls before public launch.
- Existing documents created before this change do not have a `userId` and will not appear in authenticated saved-item lists. Migrate ownership explicitly if those records need to be retained; do not assign them to users by guesswork.

## Generate tests

The generator uses `POST /api/generate` with a Firebase ID token:

```json
{
  "prompt": "Verify a user can sign in with valid credentials",
  "framework": "playwright"
}
```

Supported frameworks: `playwright`, `cypress`, and `selenium`. Playwright output is generated as TypeScript using the Playwright Test API.

The legacy `/api/generateTestCase` and `/api/generateTestScript` routes remain as backwards-compatible aliases and require the same authentication header.

## Current limitations

- Test script generation is implemented; actual test execution is not. `GET /api/runTest` returns HTTP 501 to make this explicit.
- Run lint, type checking, build, and end-to-end tests before merging or deploying.
