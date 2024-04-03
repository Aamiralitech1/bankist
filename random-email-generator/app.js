const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

// Function to generate random email
function generateRandomEmail() {
    const domains = ['example.com'];
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < 10; i++) {
        username += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${username}@${domain}`;
}

// Serve index.html on the root URL
app.get('/generate-email', (req, res) => {
    const randomEmail = generateRandomEmail();
    res.send(randomEmail);
});
// Route to generate and return a random email
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
