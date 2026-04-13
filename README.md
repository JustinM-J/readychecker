# Voting Readiness Checker

An interactive tool that helps users determine if they're ready to vote through a series of simple yes/no questions.

## Features

- ✅ Interactive questionnaire with smooth animations
- ✅ Responsive design (works on all devices)
- ✅ Session tracking with backend storage
- ✅ Password-protected admin dashboard
- ✅ Anonymous data collection (no IPs or personal info)
- ✅ API rate limiting (prevents abuse)
- ✅ HTTPS encryption support
- ✅ IP-based access restrictions for admin
- ✅ Export data to CSV or JSON
- ✅ Easy to embed on other websites

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up admin account:**
   ```bash
   npm run setup
   ```
   Enter username, password, and optionally allowed IPs.

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   - Main tool: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin.html (requires login)

## How to Update Questions

Edit the `public/questions.js` file. The format is:

```javascript
const questionFlow = {
    questionId: {
        id: 'questionId',
        question: 'Your question text?',
        answers: [
            { text: 'Yes', next: 'nextQuestionId' },
            { text: 'No', result: 'resultId' }
        ]
    }
};

const results = {
    'resultId': {
        title: 'Result Title',
        message: 'Result message',
        type: 'success' // or 'warning', 'error'
    }
};
```

## Embedding on Another Website

### Option 1: iFrame
```html
<iframe src="http://localhost:3000" width="100%" height="600" frameborder="0"></iframe>
```

### Option 2: Direct Integration
Copy the contents of the `public` folder to your website and include:
```html
<link rel="stylesheet" href="styles.css">
<script src="questions.js"></script>
<script src="app.js"></script>
```

## Admin Dashboard

Access the admin dashboard at `/admin.html` to:
- View total sessions
- See answer tallies
- View recent sessions
- Export data to CSV/JSON
- Clear all data

## Data Storage

Sessions are stored in `session-data.json` in the root directory. Each session includes:
- Unique session ID
- Timestamp
- User answers

## Customization

- **Colors/Theme**: Edit `public/styles.css`
- **Questions**: Edit `public/questions.js`
- **Port**: Change `PORT` in `server.js`
