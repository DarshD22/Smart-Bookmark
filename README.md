# Smart Bookmark Manager

A minimal bookmark manager with auto-refresh built with Next.js 14, Supabase, and Google OAuth.

## Features

- 🔐 Google OAuth authentication
- 📚 Private bookmarks per user
- ⚡ Auto-refresh updates across tabs (polls every 2 seconds)
- 🎨 Clean, minimal UI with Tailwind CSS
- 🚀 Deploy to Vercel in minutes

## Tech Stack

- **Next.js 14** (App Router)
- **Supabase** (Auth + Postgres)
- **TypeScript**
- **Tailwind CSS**

## Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Google Cloud project with OAuth configured

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd bookmark-app
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)

2. Go to **Project Settings** → **API** and copy:
   - Project URL
   - Anon/public key

3. Go to **SQL Editor** and run the SQL from `supabase-setup.sql`:

```sql
-- This creates the bookmarks table with RLS policies
-- Copy and paste the entire content from supabase-setup.sql
```

4. Enable Google OAuth:
   - Go to **Authentication** → **Providers**
   - Enable Google
   - You'll add the Client ID and Secret in the next step

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)

2. Create a new project or select existing one

3. Enable Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click Enable

4. Create OAuth credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: "Smart Bookmark Manager"
   
5. Add Authorized redirect URIs:
   ```
   https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
   http://localhost:3000/auth/v1/callback
   ```
   (Replace `<your-supabase-project-ref>` with your actual Supabase project reference)

6. Copy the **Client ID** and **Client Secret**

7. Back in Supabase:
   - Go to **Authentication** → **Providers** → **Google**
   - Paste the Client ID and Client Secret
   - Save

### 4. Environment Variables

Create `.env.local` in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace with your actual values from Supabase.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

### 3. Update Google OAuth Redirect URIs

After deployment, add your Vercel URL to Google Cloud Console:

1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add to Authorized redirect URIs:
   ```
   https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
   ```

## Project Structure

```
/app
  /login
    page.tsx          # Google OAuth login page
  /dashboard
    page.tsx          # Protected dashboard with bookmarks
  layout.tsx          # Root layout
  page.tsx            # Home page (redirects to login)
  globals.css         # Global styles with Tailwind

/components
  Navbar.tsx          # Navigation with logout
  BookmarkForm.tsx    # Add new bookmark form
  BookmarkList.tsx    # List with real-time updates

/lib
  supabaseClient.ts   # Supabase browser client

supabase-setup.sql    # Database schema and policies
```

## How Auto-Refresh Works

The app uses polling to keep bookmarks synchronized across tabs:

1. Every 2 seconds, the app fetches the latest bookmarks from Supabase
2. When a bookmark is added/deleted in one tab
3. Other tabs will pick up the change within 2 seconds
4. No need for Supabase Realtime subscription (works on all Supabase plans)

## Features Explained

### Authentication
- Only Google OAuth is supported
- Sessions are persisted automatically
- Dashboard routes are protected (redirect to login if not authenticated)

### Bookmarks
- Each user can only see their own bookmarks (enforced by RLS)
- Bookmarks are sorted by creation date (newest first)
- URLs open in new tabs

### Auto-Refresh Updates
- Add a bookmark → appears in other tabs within 2 seconds
- Delete a bookmark → removed from other tabs within 2 seconds
- Uses automatic polling every 2 seconds (no manual refresh needed)

## Troubleshooting

### "Invalid login credentials" error
- Check that Google OAuth is properly configured in Supabase
- Verify redirect URIs match exactly

### Bookmarks not appearing
- Check browser console for errors
- Verify RLS policies are enabled
- Check that you're logged in with the correct account

### Auto-refresh not working
- The app polls every 2 seconds automatically
- Open two tabs and add a bookmark - it should appear in the other tab within 2 seconds
- Check browser console for errors
- Make sure both tabs are logged in with the same account
- Check that your network connection is stable

## License

MIT