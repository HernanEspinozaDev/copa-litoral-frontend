const fs = require('fs');
const path = require('path');

// Simulate the login logic
const DATA_DIR = path.join(__dirname, 'src/data');
const USERS_FILE = path.join(DATA_DIR, 'usuarios.json');

console.log('Data directory exists:', fs.existsSync(DATA_DIR));
console.log('Users file exists:', fs.existsSync(USERS_FILE));

if (fs.existsSync(USERS_FILE)) {
  try {
    const usersData = fs.readFileSync(USERS_FILE, 'utf-8');
    console.log('Users file content:', usersData);
    
    const users = JSON.parse(usersData);
    console.log('Parsed users:', users);
    
    const username = 'admin';
    const password = 'password';
    
    const user = users.find((u) => u.username === username && u.password === password);
    console.log('Found user:', user);
  } catch (error) {
    console.error('Error parsing users file:', error.message);
  }
}
