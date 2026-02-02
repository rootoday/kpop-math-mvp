# 🐙 How to Save Your Project to GitHub

Since your project is now running locally at `c:\kpop-math-mvp`, here is how you can save it to GitHub.

---

## 🛠️ Step 1: Install Git (If you haven't)

If you don't have Git installed yet, download and install it from:
**[git-scm.com](https://git-scm.com/downloads)**

---

## ☁️ Step 2: Create a Repository on GitHub

1. Log in to your [GitHub account](https://github.com/).
2. Click the **"+"** icon in the top right and select **"New repository"**.
3. **Repository name**: `kpop-math-mvp`
4. **Public/Private**: Choose whichever you prefer.
5. **DO NOT** initialize with a README, license, or .gitignore (we already have them).
6. Click **"Create repository"**.

---

## 💻 Step 3: Push Your Code from Terminal

Open your terminal in the `c:\kpop-math-mvp` folder and run these commands:

### 1. Initialize Git
```bash
git init
```

### 2. Add all files
```bash
git add .
```

### 3. Commit your changes
```bash
git commit -m "Initial commit for K-POP Math MVP"
```

### 4. Set the branch to main
```bash
git branch -M main
```

### 5. Link to your GitHub Repo
*Replace `[YOUR_USERNAME]` with your actual GitHub username.*
```bash
git remote add origin https://github.com/[YOUR_USERNAME]/kpop-math-mvp.git
```

### 6. Push to GitHub
```bash
git push -u origin main
```

---

## ⚠️ Important: Protect Your Secrets

I have already created a `.gitignore` file for you, which ensures that your `.env.local` (containing your Supabase keys) **will not** be uploaded to GitHub.

**NEVER** upload your `.env.local` to a public repository!

If you want to share your project, other people should:
1. Clone your repo.
2. Create their own `.env.local` using your [QUICKSTART.md](file:///c:/kpop-math-mvp/QUICKSTART.md) instructions.

---

## 🚀 Step 4: Automate Deployment (Optional)

Once your code is on GitHub, you can:
1. Go to [Vercel.com](https://vercel.com).
2. Click **"Add New"** -> **"Project"**.
3. Import your `kpop-math-mvp` repository.
4. Add your Environment Variables (from `.env.local`) in the Vercel dashboard.
5. **Deploy!**

Your app will now be live on a real URL! 🎉
