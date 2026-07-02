# Daiichi Chatbot — Deployment Guide

## What You Need
1. A **GitHub** account (github.com)
2. A **Vercel** account (vercel.com — sign up with GitHub, it's free)
3. Your **Gemini API key** (the same one you used for Hugging Face)

---

## Step-by-Step (Like Explaining to a Kid)

### Step 1: Put the code on GitHub
1. Go to github.com → click **"+"** → **"New repository"**
2. Name it: `daiichi-chatbot`
3. Make it **Public** (or Private, both work)
4. Click **"Create repository"**
5. Upload ALL the files from this folder to that repository
   - You can drag and drop files on the GitHub page
   - Make sure the folder structure stays the same:
     ```
     daiichi-chatbot/
     ├── package.json
     ├── next.config.mjs
     ├── pages/
     │   ├── _app.js
     │   ├── index.js
     │   └── api/
     │       └── chat.js
     └── styles/
         └── globals.css
     ```

### Step 2: Connect to Vercel
1. Go to **vercel.com** → Sign up with GitHub
2. Click **"Add New Project"**
3. Find your `daiichi-chatbot` repo → click **"Import"**
4. **IMPORTANT** — Before clicking Deploy, click **"Environment Variables"**
5. Add this:
   - Name: `GEMINI_API_KEY`
   - Value: *(paste your Gemini API key here)*
6. Click **"Deploy"**

### Step 3: Done!
- Vercel will build your site in about 1 minute
- You'll get a free link like: `daiichi-chatbot.vercel.app`
- Share this link with Dr. Gusyev!

---

## How to Update Later
- Just edit files on GitHub → Vercel automatically rebuilds
- No need to touch Vercel again

## If Something Breaks
- Check Vercel dashboard → "Deployments" → click the failed one → read the error
- Most common issue: forgot to add GEMINI_API_KEY in environment variables

---

## Credits
Built by Abdulrahman Alblooshi
IER, Fukushima University | Summer 2026
Supervised by Dr. Maksym Gusyev & Dr. Philip McCasland
