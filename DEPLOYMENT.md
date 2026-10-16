# Deployment Guide

This guide covers deploying the Inventory Management System to production.

## Prerequisites

- MongoDB Atlas account (free tier available)
- Render/Railway/Heroku account for backend
- Vercel/Netlify account for frontend
- GitHub repository

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" and choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Whitelist all IPs (0.0.0.0/0) for production or specific deployment IPs

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/inventory-management?retryWrites=true&w=majority
```

## Step 2: Backend Deployment (Render)

### Using Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name:** inventory-backend
   - **Root Directory:** backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

5. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters
   NODE_ENV=production
   PORT=5000
   ```

6. Click "Create Web Service"
7. Wait for deployment (first deploy takes 3-5 minutes)
8. Copy your backend URL (e.g., `https://inventory-backend.onrender.com`)

### Seed Production Data

After deployment, run seeder:
```bash
# SSH into your Render instance or use local connection with production MongoDB URI
npm run seed
```

Or use Render Shell:
1. Go to your service dashboard
2. Click "Shell" tab
3. Run: `npm run seed`

## Step 3: Frontend Deployment (Vercel)

### Using Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." and select "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** dist

5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Your app will be live at `https://your-project.vercel.app`

### Alternative: Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure:
   - **Base directory:** frontend
   - **Build command:** `npm run build`
   - **Publish directory:** frontend/dist

5. Add Environment Variable in Site Settings:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

6. Click "Deploy site"

## Step 4: Backend CORS Configuration

Update backend to allow frontend origin:

```javascript
// In backend/server.js, update CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

Redeploy backend after this change.

## Step 5: Verify Deployment

1. Visit your frontend URL
2. Try logging in with demo credentials:
   - Email: admin@example.com
   - Password: admin123

3. Test key features:
   - View dashboard
   - Create a product
   - Adjust inventory
   - Create an order
   - Update order status

## Alternative Deployment Options

### Backend - Railway

1. Go to [Railway](https://railway.app/)
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your repository
4. Add service for backend
5. Configure:
   - **Root Directory:** backend
   - **Start Command:** `npm start`
   
6. Add environment variables (same as Render)
7. Railway provides MongoDB plugin if you prefer

### Backend - Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create inventory-backend

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production

# Deploy
git subtree push --prefix backend heroku main

# Run seeder
heroku run npm run seed
```

### Frontend - Static Hosting

You can also use:
- **GitHub Pages** (requires additional routing setup)
- **AWS S3 + CloudFront**
- **Firebase Hosting**
- **DigitalOcean App Platform**

## Environment Variables Reference

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/inventory
JWT_SECRET=minimum_32_characters_long_secret_key_here
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## Security Checklist

- [ ] MongoDB connection string uses strong password
- [ ] JWT_SECRET is at least 32 characters and random
- [ ] Environment variables are set (not hardcoded)
- [ ] MongoDB IP whitelist configured
- [ ] CORS allows only your frontend domain
- [ ] HTTPS enabled on both frontend and backend
- [ ] No .env files committed to repository

## Monitoring & Maintenance

### Backend Monitoring (Render)
- View logs in Render dashboard
- Set up email alerts for service failures
- Monitor response times

### Database Monitoring (MongoDB Atlas)
- Check cluster metrics
- Review slow queries
- Monitor storage usage
- Set up alerts for high CPU/memory

### Frontend Monitoring (Vercel/Netlify)
- View deployment logs
- Monitor bandwidth usage
- Check build times

## Troubleshooting

### "Failed to connect to MongoDB"
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

### "CORS Error"
- Add frontend URL to backend CORS configuration
- Redeploy backend after CORS changes
- Clear browser cache

### "401 Unauthorized"
- Check JWT_SECRET is same on backend
- Verify token is being sent in headers
- Check token expiration (30 days default)

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Review build logs for specific errors

### Slow Performance
- Enable MongoDB indexes (already configured in models)
- Implement Redis caching for frequent queries
- Use CDN for static assets
- Optimize database queries

## Scaling Considerations

### Database
- Upgrade to MongoDB Atlas M10 cluster for production
- Implement database replication
- Add read replicas for high traffic

### Backend
- Scale to multiple instances
- Add load balancer
- Implement Redis for session management
- Use PM2 for process management

### Frontend
- Enable Vercel/Netlify CDN
- Implement lazy loading for routes
- Optimize bundle size
- Add service worker for offline support

## Cost Estimates

### Free Tier (Good for testing/portfolio)
- MongoDB Atlas M0: FREE
- Render Free: FREE (with limitations)
- Vercel Hobby: FREE
- **Total: $0/month**

### Production Tier (Recommended)
- MongoDB Atlas M10: $57/month
- Render Standard: $7/month
- Vercel Pro: $20/month
- **Total: $84/month**

### Enterprise Tier
- MongoDB Atlas M30+: $200+/month
- Multiple backend instances: $50+/month
- Vercel Enterprise: $200+/month
- **Total: $450+/month**

## Backup Strategy

### Database Backups
- MongoDB Atlas provides automated backups
- Download backup snapshots regularly
- Test restore process periodically

### Code Backups
- Use Git with GitHub/GitLab
- Tag releases for version control
- Maintain staging environment

## CI/CD Pipeline (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
  
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Support & Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MERN Stack Best Practices](https://www.mongodb.com/mern-stack)

---

**Last Updated:** October 2026
