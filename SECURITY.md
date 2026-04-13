# Security Features

## Implemented Security Measures

### 1. Password-Protected Admin Dashboard
- Admins must log in with username/password
- Passwords are hashed using bcrypt (not stored in plain text)
- Session-based authentication
- Run `npm run setup` to create admin credentials

### 2. Anonymous Data Collection
- No IP addresses stored
- No personally identifiable information collected
- Only question/answer data is tracked
- Timestamps are anonymous

### 3. API Rate Limiting
- **Public API**: 100 requests per 15 minutes per IP
- **Admin API**: 20 requests per 15 minutes per IP
- Prevents abuse and DDoS attacks

### 4. HTTPS Encryption
- HTTPS support built-in (requires SSL certificates)
- Place `cert.pem` and `key.pem` in a `certs` folder
- For production, use Let's Encrypt or your hosting provider's SSL

### 5. IP-Based Access Restrictions
- Optionally restrict admin access to specific IPs
- Configured during `npm run setup`
- Leave empty to allow all IPs

### 6. Additional Security Headers
- Helmet.js adds secure HTTP headers
- Protection against common vulnerabilities
- XSS, clickjacking, and MIME-sniffing protection

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Admin Account
```bash
npm run setup
```

Follow the prompts to:
- Set admin username
- Set admin password (min 8 characters)
- Optionally set allowed IPs

### 3. Enable HTTPS (Production)

**Option A: Self-Signed Certificate (Testing)**
```bash
mkdir certs
cd certs
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

**Option B: Let's Encrypt (Production)**
Use certbot or your hosting provider's SSL certificate

### 4. Environment Variables (Optional)

Create a `.env` file:
```
PORT=3000
HTTPS_PORT=3443
SESSION_SECRET=your-random-secret-here
ALLOWED_ORIGINS=https://yourdomain.com
NODE_ENV=production
```

### 5. Start Server
```bash
npm start
```

## Production Deployment Checklist

- [ ] Change SESSION_SECRET to a strong random value
- [ ] Set up proper SSL certificates
- [ ] Configure ALLOWED_ORIGINS for CORS
- [ ] Set NODE_ENV=production
- [ ] Use a process manager (PM2, systemd)
- [ ] Set up firewall rules
- [ ] Regular backups of session-data.json
- [ ] Monitor server logs
- [ ] Consider using a reverse proxy (nginx)

## Embedding Securely

When embedding on another website:

```html
<!-- Use HTTPS -->
<iframe 
    src="https://yourdomain.com" 
    width="100%" 
    height="600" 
    frameborder="0"
    sandbox="allow-scripts allow-same-origin allow-forms">
</iframe>
```

## Security Best Practices

1. **Never commit** `admin-config.json` or `session-data.json` to version control
2. **Use strong passwords** for admin accounts
3. **Keep dependencies updated**: `npm audit` and `npm update`
4. **Monitor logs** for suspicious activity
5. **Regular backups** of your data
6. **HTTPS only** in production
7. **Restrict admin IPs** if possible

## Vulnerability Reporting

If you discover a security vulnerability, please email [your-email@example.com]
