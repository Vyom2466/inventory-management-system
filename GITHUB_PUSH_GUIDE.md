# GitHub Push Guide - Step by Step

## 🎯 Two Ways to Push to GitHub

### Method 1: Automated Batch File (EASIEST)

1. **Double-click** `PUSH_TO_GITHUB.bat`
2. Follow the on-screen instructions
3. When prompted, create a GitHub repository
4. Paste the repository URL when asked
5. Done!

---

### Method 2: Manual Commands

Follow these steps exactly:

## Step 1: Install Git (if not installed)

Check if Git is installed:
```bash
git --version
```

If not installed, download from: https://git-scm.com/download/win

## Step 2: Open Terminal in Project Directory

```bash
cd C:\Users\vyom\OneDrive\Desktop\baroda_project\inventory-management-system
```

## Step 3: Initialize Git Repository

```bash
git init
```

You should see: `Initialized empty Git repository`

## Step 4: Check What Will Be Committed

```bash
git status
```

✅ **Verify:**
- You should see many files listed
- `.env` files should be listed under "Untracked files" but won't be committed (they're in .gitignore)

## Step 5: Add All Files

```bash
git add .
```

## Step 6: Create First Commit

```bash
git commit -m "Initial commit: Complete MERN Inventory Management System"
```

You should see a summary of files committed.

## Step 7: Create GitHub Repository

1. **Open browser** and go to: https://github.com/new

2. **Fill in details:**
   - **Repository name:** `inventory-management-system`
   - **Description:** `Full-stack MERN Inventory & Order Management System with JWT authentication, role-based access, product management, inventory tracking, and order processing`
   - **Visibility:** Choose **Public** (so interviewers can see it)
   - **DON'T** check:
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
   
3. **Click** "Create repository"

## Step 8: Copy Your Repository URL

After creating, GitHub shows you a page with commands.

Your repository URL will look like:
```
https://github.com/YOUR_USERNAME/inventory-management-system.git
```

**Example:**
```
https://github.com/vyomprajapati/inventory-management-system.git
```

## Step 9: Link Local Repository to GitHub

**Replace `YOUR_GITHUB_USERNAME` with your actual username:**

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/inventory-management-system.git
```

**Example:**
```bash
git remote add origin https://github.com/vyomprajapati/inventory-management-system.git
```

## Step 10: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

**You may be prompted for:**
- GitHub username
- Personal Access Token (not your password)

### If Asked for Password:

GitHub no longer accepts passwords. You need a **Personal Access Token**:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: `Inventory Management System`
4. Check: `repo` (full control of private repositories)
5. Click "Generate token"
6. **COPY the token** (you won't see it again!)
7. Use this token as your password when pushing

## Step 11: Verify on GitHub

1. Go to your repository: `https://github.com/YOUR_USERNAME/inventory-management-system`
2. You should see all your files
3. **Check:** `.env` files should NOT be visible ✅
4. **Check:** `.env.example` files SHOULD be visible ✅
5. **Check:** README.md displays nicely ✅

---

## 🎉 Success!

Your repository is now live on GitHub!

**Repository URL:** `https://github.com/YOUR_USERNAME/inventory-management-system`

---

## 📝 Update SUBMISSION.md

After pushing, update your submission document:

1. Open `SUBMISSION.md`
2. Update the GitHub URL line with your actual repository URL
3. Add any deployment URLs if you deploy
4. Commit and push again:

```bash
git add SUBMISSION.md
git commit -m "Update submission with repository URL"
git push
```

---

## 🔄 Making Changes Later

When you make changes to your code:

```bash
# Check what changed
git status

# Add changes
git add .

# Commit with a message
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

---

## 🆘 Troubleshooting

### Error: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/inventory-management-system.git
```

### Error: "src refspec main does not match any"

```bash
git branch -M main
git push -u origin main
```

### Error: "Permission denied"

You need a Personal Access Token (see Step 10 above)

### Error: "Repository not found"

Check your repository URL is correct:
```bash
git remote -v
```

---

## 📋 Complete Command Summary

```bash
# Navigate to project
cd C:\Users\vyom\OneDrive\Desktop\baroda_project\inventory-management-system

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Complete MERN Inventory Management System"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/inventory-management-system.git

# Push
git branch -M main
git push -u origin main
```

---

## ✅ Checklist

- [ ] Git is installed
- [ ] Repository created on GitHub
- [ ] Local repository initialized
- [ ] Files committed
- [ ] Remote origin added
- [ ] Code pushed to GitHub
- [ ] Verified on GitHub website
- [ ] `.env` files are NOT visible on GitHub
- [ ] SUBMISSION.md updated with repository URL

---

**Need help?** Check the error message and refer to the Troubleshooting section above.
