# AI Test Generator

A Next.js application for generating QA test cases and automation scripts with OpenAI.

## Stack

- Next.js 15 / React 19
- TypeScript
- OpenAI API
- Firebase Admin / Firestore
- Tailwind CSS

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-4o-mini
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_service_account_email
   FIREBASE_PRIVATE_KEY="your_firebase_private_key"
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000.

## Generate tests

The generator uses `POST /api/generate` with:

```json
{
  "prompt": "Verify a user can sign in with valid credentials",
  "framework": "playwright"
}
```

Supported frameworks: `playwright`, `cypress`, and `selenium`. Playwright output is generated as TypeScript using the Playwright Test API.

The legacy `/api/generateTestCase` and `/api/generateTestScript` routes remain as backwards-compatible aliases.

## Save generated output

Test cases and scripts are stored in the Firestore `testCases` collection with a `contentType` field (`testCase` or `testScript`). Both saved-items screens read from this same API.

## Important security work before deployment

The current application does not yet have a sign-in flow. The saved-items API uses Firebase Admin and is therefore not protected by Firestore client security rules. **Do not deploy this version with real or sensitive user data until Firebase Authentication is implemented and every API operation verifies the caller's ID token and scopes reads/updates/deletes to that user's UID.**

Also add rate limiting to the AI generation endpoint before exposing it publicly. Never commit service-account credentials or `.env.local`.

## Current limitations

- Test script generation is implemented; actual test execution is not. `GET /api/runTest` returns HTTP 501 to make this explicit.
- Run lint, type checking, build, and end-to-end tests before merging or deploying.
