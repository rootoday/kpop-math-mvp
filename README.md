# K-POP Math MVP

Learn algebra through K-pop! An interactive educational platform featuring tier-based learning with your favorite K-pop artists.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- Supabase account
- Vercel account (for deployment)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Run database migrations:**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Run migrations
   supabase db push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📦 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Import project in Vercel**
3. **Add environment variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. **Deploy!**

### Manual Build

```bash
npm run build
npm run start
```

## 🏗️ Project Structure

```
├── app/              # Next.js App Router pages
│   ├── api/          # API routes
│   ├── dashboard/    # Dashboard page
│   ├── lessons/      # Lesson pages
│   └── page.tsx      # Landing page
├── components/       # React components
├── lib/              # Utilities and configs
│   └── supabase/     # Supabase clients
├── types/            # TypeScript types
├── supabase/
│   └── migrations/   # Database migrations
└── public/           # Static assets
```

## 🔧 Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Deployment:** Vercel
- **AI:** Claude API (optional, for admin)

## 📝 License

MIT
