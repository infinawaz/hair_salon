# Hostinger Cloud Deployment Guide

Complete guide to deploy the Hair Salon Management System on Hostinger Cloud Hosting.

---

## 📋 Prerequisites

- [x] Hostinger Cloud Hosting plan with Node.js support
- [x] Domain purchased (or use free subdomain)
- [x] GitHub repository: `https://github.com/infinawaz/hair_salon`

---

## 🚀 Step-by-Step Deployment

### Phase 1: Hostinger Setup

#### Step 1.1: Purchase Hostinger Cloud Hosting
1. Go to [hostinger.in/cloud-hosting](https://www.hostinger.in/cloud-hosting)
2. Choose a plan (Cloud Startup or higher)
3. Select your billing period
4. Add a domain or use existing
5. Complete payment

#### Step 1.2: Access hPanel
1. Log into your Hostinger account
2. Go to **Hosting** → Select your cloud hosting
3. Click **Manage**

---

### Phase 2: Database Setup (MySQL)

#### Step 2.1: Create MySQL Database
1. In hPanel, go to **Databases** → **MySQL Databases**
2. Create a new database:
   - **Database name**: `salon_db`
   - **Username**: `salon_user`
   - **Password**: `YourStrongPassword123!` (use a secure password)
3. Click **Create**
4. Note down these credentials!

#### Step 2.2: Get Database Connection Info
Your MySQL connection details will be:
```
Host: localhost (or check hPanel for exact host)
Database: u123456789_salon_db (prefix may be added)
Username: u123456789_salon_user (prefix may be added)
Password: YourStrongPassword123!
Port: 3306
```

**Your DATABASE_URL will be:**
```
mysql://u123456789_salon_user:YourStrongPassword123!@localhost:3306/u123456789_salon_db
```

---

### Phase 3: Setup Node.js Application

#### Step 3.1: Enable Node.js
1. In hPanel, go to **Advanced** → **Node.js**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: 20.x (or latest LTS)
   - **Application mode**: Production
   - **Application root**: `server` (important!)
   - **Application URL**: Your domain
   - **Application startup file**: `src/index.js`

#### Step 3.2: Setup Environment Variables
In the Node.js configuration, add environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `mysql://username:password@localhost:3306/database_name` |
| `EMAIL_USER` | `your-email@gmail.com` |
| `EMAIL_PASS` | `your-gmail-app-password` |
| `PORT` | `3000` |
| `NODE_ENV` | `production` |

---

### Phase 4: Deploy Code

#### Option A: Git Deployment (Recommended)

##### Step 4A.1: Setup Git in hPanel
1. Go to **Files** → **Git**
2. Click **Create Repository**
3. Set repository path to `public_html` or your web directory

##### Step 4A.2: Clone from GitHub
```bash
# In hPanel Terminal or SSH
cd ~/public_html
git clone https://github.com/infinawaz/hair_salon.git .
```

##### Step 4A.3: Build the Application
```bash
# Navigate to client and build
cd client
npm install
npm run build

# Navigate to server
cd ../server
npm install
npx prisma generate
npx prisma db push
```

---

#### Option B: File Manager Upload

##### Step 4B.1: Build Locally First
On your local machine (Windows):
```powershell
# In the client folder
cd e:\hair_salon\client
npm run build

# This creates a 'dist' folder
```

##### Step 4B.2: Upload Files
1. In hPanel, go to **Files** → **File Manager**
2. Navigate to your web directory (`public_html`)
3. Upload the entire project (excluding `node_modules`)

##### Step 4B.3: Install Dependencies via SSH
1. Go to **Advanced** → **SSH Access** in hPanel
2. Enable SSH and get credentials
3. Connect via terminal:
   ```bash
   ssh username@your-server.hostinger.com
   ```
4. Run:
   ```bash
   cd ~/public_html/server
   npm install
   npx prisma generate
   npx prisma db push
   ```

---

### Phase 5: Configure Domain & SSL

#### Step 5.1: Point Domain
If you purchased a domain from Hostinger, it should auto-configure.

For external domains:
1. Go to **Domains** → **DNS Zone**
2. Add/Update records:
   
| Type | Name | Value |
|------|------|-------|
| A | @ | Your hosting IP |
| A | www | Your hosting IP |

#### Step 5.2: Enable SSL
1. In hPanel, go to **SSL**
2. Click **Install SSL**
3. Select your domain
4. Choose **Let's Encrypt** (free)
5. Click **Install**

---

### Phase 6: Seed Initial Data (Optional)

Via SSH or hPanel Terminal:
```bash
cd ~/public_html/server
npm run seed
```

---

## 🔧 Configuration Reference

### Environment Variables (.env)
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-gmail-app-password"
PORT=3000
NODE_ENV=production
```

### File Structure on Server
```
public_html/
├── client/
│   ├── dist/           # Built frontend (served by Express)
│   └── src/            # Source files
└── server/
    ├── src/
    │   └── index.js    # Main entry point
    ├── prisma/
    │   └── schema.prisma
    ├── package.json
    └── .env            # Your environment file
```

---

## 📱 Post-Deployment Checklist

| Task | Status |
|------|--------|
| ☐ MySQL database created | |
| ☐ Node.js application configured | |
| ☐ Code deployed (Git or upload) | |
| ☐ Dependencies installed (`npm install`) | |
| ☐ Prisma client generated | |
| ☐ Database schema pushed | |
| ☐ Environment variables set | |
| ☐ SSL certificate installed | |
| ☐ Website accessible via HTTPS | |
| ☐ Test login functionality | |
| ☐ Seed initial data (if needed) | |

---

## 🔍 Troubleshooting

### Application Not Starting
```bash
# Check Node.js logs in hPanel
# Or via SSH:
pm2 logs
# or
cat ~/logs/error.log
```

### Database Connection Error
1. Verify DATABASE_URL format: `mysql://user:pass@host:3306/db`
2. Check if database exists in hPanel
3. Confirm username has privileges

### 502 Bad Gateway
1. Restart Node.js application in hPanel
2. Check if port matches (should be 3000)
3. Verify startup file path is correct

### CSS/JS Not Loading
1. Ensure client build completed successfully
2. Check that `client/dist` folder exists
3. Verify Express static path is correct

---

## 🔄 Updating the Application

### Via Git:
```bash
cd ~/public_html
git pull origin main
cd client && npm install && npm run build
cd ../server && npm install && npx prisma generate
# Restart via hPanel Node.js section
```

### Via File Manager:
1. Build locally: `npm run build` in client folder
2. Upload new `dist` folder
3. Upload changed server files
4. Restart Node.js app

---

## 📞 Support

- **Hostinger Support**: Available 24/7 via live chat
- **Project Issues**: Create issue on GitHub repository

---

*Last Updated: January 2026*
