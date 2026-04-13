const readline = require('readline');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const ADMIN_FILE = path.join(__dirname, 'admin-config.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setup() {
    console.log('\n🔐 Admin Account Setup\n');
    
    const username = await question('Enter admin username: ');
    
    if (!username || username.trim().length === 0) {
        console.log('❌ Username cannot be empty');
        rl.close();
        return;
    }
    
    const password = await question('Enter admin password: ');
    
    if (!password || password.length < 8) {
        console.log('❌ Password must be at least 8 characters');
        rl.close();
        return;
    }
    
    const confirmPassword = await question('Confirm password: ');
    
    if (password !== confirmPassword) {
        console.log('❌ Passwords do not match');
        rl.close();
        return;
    }
    
    console.log('\n🔒 IP Restrictions (optional)');
    console.log('Leave empty to allow all IPs, or enter comma-separated IPs (e.g., 192.168.1.100,10.0.0.5)');
    const allowedIPsInput = await question('Allowed IPs: ');
    
    const allowedIPs = allowedIPsInput
        ? allowedIPsInput.split(',').map(ip => ip.trim()).filter(ip => ip.length > 0)
        : [];
    
    console.log('\n⏳ Creating admin account...');
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Read existing config or create new
    let config = { admins: [], allowedIPs: [] };
    if (fs.existsSync(ADMIN_FILE)) {
        const existing = fs.readFileSync(ADMIN_FILE, 'utf8');
        config = JSON.parse(existing);
    }
    
    // Check if username already exists
    const existingIndex = config.admins.findIndex(a => a.username === username);
    
    if (existingIndex >= 0) {
        // Update existing
        config.admins[existingIndex] = { username, passwordHash };
        console.log(`\n✅ Updated existing admin: ${username}`);
    } else {
        // Add new
        config.admins.push({ username, passwordHash });
        console.log(`\n✅ Created new admin: ${username}`);
    }
    
    // Update IP restrictions
    config.allowedIPs = allowedIPs;
    
    if (allowedIPs.length > 0) {
        console.log(`✅ IP restrictions set: ${allowedIPs.join(', ')}`);
    } else {
        console.log('✅ No IP restrictions (all IPs allowed)');
    }
    
    // Save config
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(config, null, 2));
    
    console.log('\n🎉 Setup complete! You can now log in to the admin dashboard.\n');
    
    rl.close();
}

setup().catch(error => {
    console.error('Error during setup:', error);
    rl.close();
});
