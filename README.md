# Supabase Audit UI

A modern, responsive frontend for auditing Supabase projects, featuring authentication, compliance checks, and an integrated AI chat assistant (Gemini Pro).

## Features
- Supabase authentication callback flow
- Compliance dashboard with real-time checks
- Beautiful, accessible UI with Tailwind CSS
- Animated skeleton loaders for cards
- Floating AI chat window (Gemini Pro)
- Toast notifications for feedback

## Tech Stack
- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- **TypeScript**
- **react-hot-toast** (notifications)
- **react-markdown** (AI chat rendering)
- **axios** (API calls)

## Getting Started

### 1. Install dependencies
```sh
npm install
# or
yarn install
```

### 2. Set up environment variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```
- Adjust the URL to point to your backend API.

### 3. Run the development server
```sh
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts
- `dev` - Start the development server
- `build` - Build for production
- `start` - Start the production server
- `lint` - Run ESLint
- `format` - Run Prettier

## AI Chat Feature
- Click the chat icon in the bottom right to open the AI chat window.
- The chat uses the Gemini Pro model via your backend (`/api/v1/chat`).
- Only the last 5 messages from each side are sent for context.
- Supports markdown in AI responses and a typing animation.

## Customization
- Update theme colors in `tailwind.config.js` and CSS as needed.
- Adjust the number of skeleton cards or chat history in the code.

## License
MIT
