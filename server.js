require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Provide a secret
    resave: false,
    saveUninitialized: true,
}));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set up EJS for rendering HTML
app.set('view engine', 'ejs');

// Serve static files (CSS and videos)
app.use(express.static(path.join(__dirname, 'public')));

// Logging
app.use(morgan('combined'));

// Hardcoded users
const users = {
    user1: 'pass1', // Can access videos
    user2: 'pass2'  // Cannot access videos
};

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts, please try again later.',
});

// Login route
app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        req.session.loggedInUser = username;
        res.redirect('/videos');
    } else {
        res.send('Invalid username or password');
    }
});

// Videos route
app.get('/videos', (req, res) => {
    if (!req.session.loggedInUser) {
        return res.redirect('/');
    }
    if (req.session.loggedInUser === 'user1') {
        res.render('videos');
    } else {
        res.render('access-denied');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Generate a random token
const generateToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

// Store valid tokens (in-memory for simplicity)
const validTokens = new Set();

// Middleware to check token validity
const validateToken = (req, res, next) => {
    const token = req.query.token;
    if (validTokens.has(token)) {
        validTokens.delete(token); // Token can only be used once
        next();
    } else {
        res.status(403).send('Access denied');
    }
};

// Route to generate a token for video access
app.get('/generate-token', (req, res) => {
    if (req.session.loggedInUser === 'user1') {
        const token = generateToken();
        validTokens.add(token);
        res.send({ token });
    } else {
        res.status(403).send('Access denied');
    }
});

// Route to serve videos with token-based access
app.get('/video', validateToken, (req, res) => {
    const videoPath = path.join(__dirname, 'videos', 'timer.mp4');
    res.sendFile(videoPath);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server (HTTP for development)
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});