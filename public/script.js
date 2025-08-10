// Hole IP des Besuchers und sende sie an den Server
fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => {
        fetch('/api/visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ip: data.ip })
        });
    });