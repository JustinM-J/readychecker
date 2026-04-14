const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const session = require('express-session');
const helmet = require('helmet');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Security: Helmet for HTTP headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            frameAncestors: ["*"], // Allow embedding from any origin
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        }
    }
}));

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limiting for admin endpoints
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many admin requests, please try again later.',
});

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'change-this-secret-in-production-' + Math.random().toString(36),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to false for HTTP (Render provides HTTPS)
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax' // Allow cross-site requests
    }
}));

// Middleware
app.use(cors({
    origin: true, // Allow any origin but with credentials
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

// Data storage files
const DATA_FILE = path.join(__dirname, 'session-data.json');
const ADMIN_FILE = path.join(__dirname, 'admin-config.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ sessions: [], tallies: {} }));
}

// Initialize admin config if it doesn't exist
if (!fs.existsSync(ADMIN_FILE)) {
    console.warn('\n⚠️  WARNING: No admin credentials found!');
    console.warn('Go to /admin-setup.html to create admin credentials.\n');
    fs.writeFileSync(ADMIN_FILE, JSON.stringify({ 
        admins: [],
        allowedIPs: [] // Empty = allow all IPs
    }));
}

// Read data
function readData() {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// Write data
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Read admin config
function readAdminConfig() {
    const data = fs.readFileSync(ADMIN_FILE, 'utf8');
    return JSON.parse(data);
}

// Middleware: Check if user is authenticated admin
function isAuthenticated(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.status(401).json({ success: false, error: 'Unauthorized. Please log in.' });
}

// Middleware: Check IP restrictions for admin access
function checkAdminIP(req, res, next) {
    const config = readAdminConfig();
    
    // If no IPs specified, allow all
    if (!config.allowedIPs || config.allowedIPs.length === 0) {
        return next();
    }
    
    // Get client IP
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // Check if IP is allowed
    if (config.allowedIPs.includes(clientIP) || config.allowedIPs.includes('*')) {
        return next();
    }
    
    console.warn(`Blocked admin access from IP: ${clientIP}`);
    res.status(403).json({ success: false, error: 'Access denied from your IP address.' });
}

// Public API: Save session (with rate limiting, anonymous)
app.post('/api/session', apiLimiter, (req, res) => {
    try {
        const sessionData = req.body;
        const data = readData();
        
        // Add timestamp (anonymous - no IP or identifying info)
        sessionData.timestamp = new Date().toISOString();
        sessionData.id = Date.now() + Math.random().toString(36).substr(2, 9);
        
        // Save session
        data.sessions.push(sessionData);
        
        // Update tallies
        sessionData.answers.forEach(answer => {
            const key = `${answer.question}_${answer.answer}`;
            data.tallies[key] = (data.tallies[key] || 0) + 1;
        });
        
        writeData(data);
        res.json({ success: true, sessionId: sessionData.id });
    } catch (error) {
        console.error('Error saving session:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Admin API: Login
app.post('/api/admin/login', adminLimiter, checkAdminIP, async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password required' });
        }
        
        const config = readAdminConfig();
        
        if (!config.admins || config.admins.length === 0) {
            return res.status(500).json({ success: false, error: 'No admin accounts configured. Run npm run setup.' });
        }
        
        // Find admin user
        const admin = config.admins.find(a => a.username === username);
        
        if (!admin) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        // Verify password
        const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
        
        if (!passwordMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        // Set session
        req.session.isAdmin = true;
        req.session.username = username;
        
        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Admin API: Setup admin account (web-based)
app.post('/api/admin/setup', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
        }

        const config = readAdminConfig();

        // Check if admin already exists
        if (config.admins && config.admins.length > 0) {
            return res.status(400).json({ success: false, error: 'Admin account already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = bcrypt.hashSync(password, saltRounds);

        // Create admin
        config.admins = [{ username, passwordHash }];
        fs.writeFileSync(ADMIN_FILE, JSON.stringify(config, null, 2));

        console.log(`✅ Admin account created: ${username}`);
        res.json({ success: true, message: 'Admin account created successfully' });
    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Admin API: Check authentication status
app.get('/api/admin/status', (req, res) => {
    if (req.session && req.session.isAdmin) {
        res.json({ authenticated: true, username: req.session.username });
    } else {
        res.json({ authenticated: false });
    }
});

// Admin API: Get tallies (protected)
app.get('/api/admin/tallies', adminLimiter, isAuthenticated, (req, res) => {
    try {
        const data = readData();
        res.json({
            tallies: data.tallies,
            totalSessions: data.sessions.length,
            sessions: data.sessions
        });
    } catch (error) {
        console.error('Error getting tallies:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Admin API: Clear data (protected)
app.delete('/api/admin/data', adminLimiter, isAuthenticated, (req, res) => {
    try {
        writeData({ sessions: [], tallies: {} });
        res.json({ success: true, message: 'All data cleared' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Start HTTP server
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
    console.log(`\n✅ HTTP Server running at http://localhost:${PORT}`);
    console.log(`   Main tool: http://localhost:${PORT}`);
    console.log(`   Admin dashboard: http://localhost:${PORT}/admin.html`);
});

// Start HTTPS server if certificates exist
const CERT_PATH = path.join(__dirname, 'certs', 'cert.pem');
const KEY_PATH = path.join(__dirname, 'certs', 'key.pem');

if (fs.existsSync(CERT_PATH) && fs.existsSync(KEY_PATH)) {
    const httpsOptions = {
        cert: fs.readFileSync(CERT_PATH),
        key: fs.readFileSync(KEY_PATH)
    };
    
    const httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(HTTPS_PORT, () => {
        console.log(`✅ HTTPS Server running at https://localhost:${HTTPS_PORT}`);
    });
} else {
    console.log('\nℹ️  HTTPS not configured. To enable HTTPS:');
    console.log('   1. Create a "certs" folder');
    console.log('   2. Add cert.pem and key.pem files');
    console.log('   Or use a service like Let\'s Encrypt for production\n');
}

console.log('\n🔒 Security Features Enabled:');
console.log('   ✓ Rate limiting (API & Admin)');
console.log('   ✓ Anonymous data collection');
console.log('   ✓ Password-protected admin');
console.log('   ✓ Session-based authentication');
console.log('   ✓ Security headers (Helmet)');
if (fs.existsSync(ADMIN_FILE)) {
    const config = readAdminConfig();
    if (config.allowedIPs && config.allowedIPs.length > 0) {
        console.log('   ✓ IP-based access restrictions');
    }
}

const config = readAdminConfig();
if (!config.admins || config.admins.length === 0) {
    console.log('\n⚠️  NO ADMIN CREDENTIALS SET UP!');
    console.log('   Go to: https://readychecker.onrender.com/admin-setup.html');
    console.log('   to create your admin account.\n');
}
