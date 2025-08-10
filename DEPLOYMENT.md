# 🚀 Deployment Guide - Phaser Adventure Game

This guide will help you deploy your Phaser.js adventure game to Vercel with automatic GitHub CI/CD.

## 📋 Prerequisites

- GitHub account
- Vercel account
- Git installed locally

## 🔧 Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Phaser adventure game"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 2. Connect to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure project settings:**
   - Framework Preset: `Other`
   - Root Directory: `./` (leave empty)
   - Build Command: `npm run build` (or leave empty)
   - Output Directory: `./` (leave empty)
   - Install Command: `npm install` (or leave empty)

### 3. Get Vercel Tokens and IDs

After connecting your repository, you'll need these values for GitHub Actions:

1. **Go to [Vercel Account Settings](https://vercel.com/account/tokens)**
2. **Create a new token** (name it something like "GitHub Actions")
3. **Copy the token** - you'll need this for `VERCEL_TOKEN`

4. **Get Project ID:**
   - Go to your project in Vercel dashboard
   - Click on "Settings" tab
   - Copy the "Project ID" - you'll need this for `VERCEL_PROJECT_ID`

5. **Get Organization ID:**
   - In project settings, look for "General" section
   - Copy the "Team ID" - you'll need this for `VERCEL_ORG_ID`

### 4. Set Up GitHub Secrets

1. **Go to your GitHub repository**
2. **Click "Settings" tab**
3. **Click "Secrets and variables" → "Actions"**
4. **Add these repository secrets:**

```
VERCEL_TOKEN = your_vercel_token_here
VERCEL_ORG_ID = your_organization_id_here
VERCEL_PROJECT_ID = your_project_id_here
```

### 5. Test the Deployment

1. **Make a small change to your code**
2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Test deployment"
   git push
   ```
3. **Check GitHub Actions:**
   - Go to your repository
   - Click "Actions" tab
   - You should see the deployment workflow running
4. **Check Vercel:**
   - Go to your Vercel dashboard
   - You should see a new deployment

## 🔄 Automatic Deployment

Once set up, every time you push to the `main` branch, your game will automatically deploy to Vercel!

## 📁 Project Structure

```
phaser-adventure-game/
├── index.html              # Main game file
├── js/                     # Game scripts
│   ├── game.js
│   ├── scenes/
│   └── entities/
├── vercel.json            # Vercel configuration
├── package.json           # Project configuration
├── .github/workflows/     # GitHub Actions
│   └── deploy.yml
└── README.md              # Project documentation
```

## 🛠️ Configuration Files Explained

### `vercel.json`
- **Builds**: Tells Vercel how to build the project
- **Routes**: Handles routing (all routes go to index.html)
- **Headers**: Sets caching headers for optimal performance

### `.github/workflows/deploy.yml`
- **Triggers**: Runs on push to main/master branch
- **Steps**: Checks out code, sets up Node.js, installs Vercel CLI, deploys

### `package.json`
- **Scripts**: Defines build and deployment commands
- **Metadata**: Project information and dependencies

## 🚨 Troubleshooting

### Common Issues:

1. **Build fails:**
   - Check that all files are committed to GitHub
   - Verify `vercel.json` is in the root directory

2. **Deployment not triggering:**
   - Check GitHub Actions permissions
   - Verify secrets are set correctly
   - Ensure you're pushing to the correct branch

3. **Game not loading:**
   - Check browser console for errors
   - Verify all JavaScript files are being served
   - Check Vercel deployment logs

### Debug Commands:

```bash
# Test locally
npm start

# Check Vercel status
vercel ls

# Deploy manually
vercel --prod
```

## 🌐 Custom Domain (Optional)

1. **Go to Vercel project settings**
2. **Click "Domains"**
3. **Add your custom domain**
4. **Follow DNS configuration instructions**

## 📊 Performance Optimization

The configuration includes:
- **Caching headers** for static assets
- **Compression** (handled by Vercel)
- **CDN distribution** (automatic with Vercel)

## 🎮 Game Features

Your deployed game includes:
- ✅ Randomized map layouts
- ✅ Dynamic enemy placement
- ✅ Variable tree configurations
- ✅ Collectible gems
- ✅ Player movement and collision
- ✅ Game start mechanism
- ✅ Win/lose conditions

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Phaser.js Documentation](https://phaser.io/docs)

---

**Happy Gaming! 🎮✨**
