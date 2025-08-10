require('dotenv').config();
const express = require('express');
const path = require('path');
const basicAuth = require('basic-auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware für JSON und statische Dateien
app.use(express.json());
app.use(express.static('public'));

// Simulierte "Datenbank" (in echt: MongoDB/PostgreSQL)
let visits = [];

// Passwortschutz für Admin-Bereich
const adminAuth = (req, res, next) => {
    const user = basicAuth(req);
    if (!user || user.name !== 'admin' || user.pass !== process.env.ADMIN_PASSWORD) {
        res.set('WWW-Authenticate', 'Basic realm="Admin Bereich"');
        return res.status(401).send('Zugriff verweigert.');
    }
    next();
};

// Route: Besucher-IP speichern
app.post('/api/visit', (req, res) => {
    const { ip } = req.body;
    visits.push({ ip, timestamp: new Date().toLocaleString() });
    res.sendStatus(200);
});

// Route: Admin-Bereich (nur mit Passwort)
app.get('/admin', adminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// Route: Besucherdaten abrufen (nur für Admin)
app.get('/api/visits', adminAuth, (req, res) => {
    res.json(visits);
});

app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));