# Setup & Installation

This guide will help you get the AI Content Studio running on your local machine.

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A PostgreSQL database (e.g., [Supabase](https://supabase.com/))

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd bedaie-test
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```

   **Required Variables**:
   - `DATABASE_URL`: Connection string for your database (with pooling).
   - `DIRECT_URL`: Direct connection string for database migrations.
   - `NEXTAUTH_SECRET`: A secret string for session encryption.
   - `NEXTAUTH_URL`: The base URL of your app (default: `http://localhost:3000`).

   *Note: AI API keys are configured directly within the application settings UI.*

4. **Initialize Database**:
   Run the Prisma migrations to set up your database schema.
   ```bash
   npx prisma db push
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## AI Provider Configuration

Once the application is running:
1. Log in or Register a new account.
2. Navigate to the **Settings** page (sidebar).
3. Select your preferred AI Provider (OpenAI, Google Gemini, or Anthropic Claude).
4. Enter your API Key.
5. Save the settings.

You are now ready to generate content on the Home page.
