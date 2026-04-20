# Project Architecture

This document describes the high-level architecture and technology stack of the `bedaie-test` (AI Content Studio) project.

## Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Frontend Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **AI Integration**:
  - Google Generative AI (Gemini)
  - Anthropic SDK (Claude)
  - OpenAI SDK (GPT)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown)

## Directory Structure

```text
├── app/                  # Next.js App Router (Pages, API routes, Layouts)
│   ├── actions/          # Next.js Server Actions
│   ├── api/              # API Endpoint handlers (e.g., /api/generate)
│   ├── login/            # Login page
│   ├── register/         # User registration page
│   ├── settings/         # Application settings page
│   └── globals.css       # Global stylesheet (Tailwind 4)
├── components/           # Reusable UI components
├── lib/                  # Utility functions and shared logic
│   ├── i18n.ts           # Localization and translation logic
│   ├── prisma.ts         # Prisma client initialization
│   └── models.ts         # AI model definitions and constants
├── prisma/               # Database schema and migrations
├── public/               # Static assets (images, icons)
├── store/                # Zustand State Stores (e.g., useSettingsStore.ts)
├── types/                # Global TypeScript type definitions
└── TSConfig / ESLint    # Configuration files
```

## Core Design Patterns

### 1. Centralized State
The application uses **Zustand** for managing client-side state, specifically for user preferences like AI provider settings, API keys, and localization. This state is often persisted to `localStorage`.

### 2. Multi-Provider AI Strategy
The application logic abstractions (specifically in `/app/api/generate/route.ts`) allow for switching between different AI providers (OpenAI, Gemini, Anthropic) using a unified prompt structure and response extraction logic.

### 3. Server-Side Persistance
Content generated via the AI studio is persisted to a **PostgreSQL** database via **Prisma**. Each generation is linked to a user account, supporting history tracking and re-retrieval.

### 4. Direct i18n
Localization is handled logic-side via `lib/i18n.ts`, providing a lightweight way to translate both the UI components and the instructions sent to the AI (ensuring output matches requested language).
