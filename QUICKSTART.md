# 🚀 Quick Start Guide - K-POP Math MVP

## ✅ Setup Complete!

Your project is now ready to run at: `c:\kpop-math-mvp`

---

## 📋 Current Status

- ✅ Project moved to local directory
- ✅ Node.js and npm installed
- ✅ Dependencies installed (540 packages)
- ✅ `.env.local` file created
- ⚠️ **Next: Configure Supabase credentials**

---

## 🔧 Step 1: Set Up Supabase

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project (choose a name, password, region)
4. Wait for project to be ready (~2 minutes)

### Get Your Credentials

1. In your Supabase project dashboard, click **Settings** (gear icon)
2. Go to **API** section
3. Copy these values:

   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Update `.env.local`

Open `c:\kpop-math-mvp\.env.local` and replace:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

With your actual values from Supabase.

---

## 🗄️ Step 2: Run Database Migrations

### Option A: Using Supabase Dashboard (Easiest)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the content from:
   - `c:\kpop-math-mvp\supabase\migrations\001_initial_schema.sql`
4. Click **Run**
5. Repeat for:
   - `002_rls_policies.sql`
   - `003_seed_data.sql`

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

---

## 🎮 Step 3: Run the Development Server

In your terminal (in the `c:\kpop-math-mvp` directory):

```bash
npm run dev
```

You should see:

```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

Open your browser to: **http://localhost:3000**

---

## 🧪 Step 4: Test the Application

### 1. Landing Page
- Visit http://localhost:3000
- Should see the K-POP Math landing page
- Click "Start Learning Free"

### 2. Sign Up
- Fill in: First Name, Last Name, Email, Password
- Click "Sign Up"
- Should redirect to Dashboard

### 3. Dashboard
- View your stats (0 XP, 0/1 lessons, etc.)
- See the NewJeans lesson card
- Click "Start Lesson"

### 4. Complete a Lesson
- **Tier 1**: Read introduction → Click "Let's Learn!"
- **Tier 2**: Read 3 steps → Click "Next"
- **Tier 3**: Answer multiple choice → Click "Check Answer"
- **Tier 4**: Fill in the blank → Click "Check Answer"
- **Tier 5**: See celebration with confetti! 🎉

### 5. Verify Progress
- Return to Dashboard
- Check XP increased
- See lesson marked as completed ✅

---

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
# Use a different port
npm run dev -- -p 3001
```

### Dependencies issues?
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection errors?
- Double-check your `.env.local` credentials
- Make sure migrations ran successfully
- Check Supabase project is active

---

## 📚 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Check TypeScript types
```

---

## 🎯 What's Next?

After you have the app running:

1. **Add More Lessons**: Create new lessons in Supabase with different K-pop artists
2. **Customize Styling**: Edit `app/globals.css` for your brand
3. **Add Features**: Badges, leaderboards, social sharing
4. **Deploy**: Push to GitHub and deploy on Vercel

---

## 📞 Need Help?

- Check [README.md](file:///c:/kpop-math-mvp/README.md) for detailed documentation
- Review [walkthrough.md](file:///C:/Users/Root/.gemini/antigravity/brain/a9edf584-9459-459d-a5b5-40530cc6cbc9/walkthrough.md) for implementation details
- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs

---

**🎉 You're all set! Happy coding!**
