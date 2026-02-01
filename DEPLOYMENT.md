# 🚀 Deployment Guide - Blink Chat

This guide covers deploying your Blink Chat application to production.

## Table of Contents

1. [Quick Deploy (Vercel + Railway)](#quick-deploy)
2. [Alternative Platforms](#alternative-platforms)
3. [Environment Variables](#environment-variables)
4. [Post-Deployment](#post-deployment)

---

## Quick Deploy (Vercel + Railway)

This is the **recommended** approach for beginners.

### Part 1: Deploy Frontend to Vercel

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: **Next.js**
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Set Environment Variables**

   ```
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes
   - Your app will be live at `your-app.vercel.app`

### Part 2: Deploy Socket.IO Server to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Add a new service
   - Select "server/socket-server.js" as entry point
   - Or create a custom start command:
     ```
     node server/socket-server.js
     ```

4. **Set Environment Variables**

   ```
   SOCKET_PORT=3001
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

5. **Generate Domain**
   - Railway will auto-generate a domain
   - Copy it (e.g., `your-app.railway.app`)
   - Update Vercel environment variable `NEXT_PUBLIC_SOCKET_URL`

6. **Redeploy Vercel**
   - Go back to Vercel
   - Trigger a new deployment with updated env var

✅ **Done!** Your app is now live!

---

## Alternative Platforms

### Option 1: All-in-One on Railway

**Pros**: Simpler, one platform
**Cons**: More expensive for scale

1. Deploy entire project to Railway
2. Configure build settings for Next.js
3. Set environment variables
4. Railway handles both frontend and Socket.IO

### Option 2: Netlify + Railway

Similar to Vercel deployment:

1. Deploy frontend to Netlify
2. Deploy Socket.IO to Railway
3. Configure environment variables

### Option 3: Self-Hosted VPS

**For advanced users**

1. **Rent a VPS** (DigitalOcean, Hetzner, Linode)
   - Minimum: 1GB RAM, 1 CPU
   - Recommended: 2GB RAM, 2 CPU

2. **Install Dependencies**

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2 (process manager)
   sudo npm install -g pm2

   # Install Nginx
   sudo apt install -y nginx
   ```

3. **Clone and Setup**

   ```bash
   cd /var/www
   git clone your-repo-url blink-chat
   cd blink-chat
   npm install
   npm run build
   ```

4. **Configure PM2**

   ```bash
   # Start Socket.IO server
   pm2 start server/socket-server.js --name socket-server

   # Start Next.js
   pm2 start npm --name nextjs -- start

   # Save PM2 config
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx**
   Create `/etc/nginx/sites-available/blink-chat`:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Next.js frontend
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Socket.IO server
       location /socket.io/ {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Enable site and SSL**

   ```bash
   sudo ln -s /etc/nginx/sites-available/blink-chat /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx

   # Install SSL with Let's Encrypt
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Environment Variables

### Required Variables

**Frontend (.env.local or Vercel)**

```env
NEXT_PUBLIC_APP_URL=https://your-production-url.com
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.com
```

**Socket.IO Server (Railway or VPS)**

```env
SOCKET_PORT=3001
NEXT_PUBLIC_APP_URL=https://your-production-url.com
```

### Optional Variables (for production features)

**Supabase Integration**

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Google OAuth**

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Redis (for Socket.IO scaling)**

```env
REDIS_URL=redis://your-redis-instance:6379
```

---

## Post-Deployment Checklist

### Security

- [ ] Enable HTTPS/SSL certificates
- [ ] Set proper CORS origins
- [ ] Add rate limiting
- [ ] Enable authentication
- [ ] Sanitize user inputs
- [ ] Set file upload limits

### Performance

- [ ] Enable CDN (Vercel/Cloudflare)
- [ ] Add Redis for Socket.IO scaling
- [ ] Optimize images (Next.js Image component)
- [ ] Enable compression
- [ ] Add database indexes

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Enable analytics (Vercel Analytics)
- [ ] Monitor server health
- [ ] Set up uptime monitoring
- [ ] Configure logging

### Features

- [ ] Test all features in production
- [ ] Verify video/audio calls work
- [ ] Check mobile responsiveness
- [ ] Test PWA installation
- [ ] Verify message delivery

---

## Scaling Considerations

### When to Scale

**Scale when you have:**

- 1,000+ concurrent users
- 10,000+ messages per day
- Multiple geographic regions
- High availability requirements

### Scaling Strategy

1. **Horizontal Scaling**
   - Use Redis adapter for Socket.IO
   - Deploy multiple Socket.IO instances
   - Load balance with Nginx/HAProxy

2. **Database**
   - Move to managed PostgreSQL (Supabase Pro)
   - Add read replicas
   - Implement caching layer

3. **CDN**
   - Use Cloudflare or Vercel Edge
   - Cache static assets
   - Optimize media delivery

4. **Separate Services**
   - Microservices architecture
   - Dedicated media server
   - Separate WebRTC signaling server

---

## Troubleshooting

### WebSocket Connection Failed

**Problem**: Socket.IO can't connect in production

**Solutions**:

1. Check CORS configuration
2. Verify WebSocket support on hosting
3. Ensure HTTPS is enabled
4. Check firewall rules

### Video Calls Not Working

**Problem**: Camera/mic not accessible

**Solutions**:

1. **Must use HTTPS** - Browsers require secure context
2. Get SSL certificate (free with Let's Encrypt)
3. Check TURN/STUN server configuration

### Slow Performance

**Problem**: App is slow for users

**Solutions**:

1. Enable Vercel Edge Functions
2. Add Redis caching
3. Optimize database queries
4. Use CDN for static assets
5. Implement lazy loading

---

## Cost Estimates

### Free Tier (0-1000 users)

- Vercel: Free
- Railway: $5/month (Socket.IO)
- Supabase: Free tier
- **Total: ~$5/month**

### Small Scale (1K-10K users)

- Vercel Pro: $20/month
- Railway: $20/month
- Supabase Pro: $25/month
- **Total: ~$65/month**

### Medium Scale (10K-100K users)

- Vercel Enterprise or VPS: $200/month
- Multiple Railway instances: $100/month
- Supabase Team: $599/month
- Redis: $50/month
- **Total: ~$950/month**

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Socket.IO Deployment](https://socket.io/docs/v4/deployment/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**🎉 Congratulations on deploying your app!**

For issues or questions, refer to the main README or create an issue on GitHub.
