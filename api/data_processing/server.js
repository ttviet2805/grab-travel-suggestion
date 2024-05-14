const { spawn } = require('child_process');

const pythonProcess = spawn('python', ['city.py', 'Huế']);

pythonProcess.stdout.on('data', (data) => {
    const numbers = JSON.parse(data);
    console.log('Received numbers from Python:', numbers);
});

pythonProcess.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
});

pythonProcess.on('close', (code) => {
    console.log(`Python process closed with code ${code}`);
});
