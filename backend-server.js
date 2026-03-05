const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(express.json());
app.use(cors());

// Helper: leer usuarios del archivo
function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return {};
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

// Helper: guardar usuarios en archivo
function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (e) {
    console.error('Error saving users:', e);
    return false;
  }
}

// Endpoint: obtener todos los usuarios
app.get('/api/users', (req, res) => {
  const users = readUsers();
  // NO devolver contraseñas
  const safe = {};
  for (const [email, user] of Object.entries(users)) {
    safe[email] = { name: user.name, username: user.username, role: user.role, created: user.created };
  }
  res.json(safe);
});

// Endpoint: registrar usuario
app.post('/api/register', (req, res) => {
  const { email, password, name, username, role } = req.body;

  if (!email || !password || !name || !username || !role) {
    return res.status(400).json({ error: 'Campos incompletos' });
  }

  const users = readUsers();

  if (users[email]) {
    return res.status(400).json({ error: 'Ya existe un perfil con ese correo.' });
  }

  const usernameTaken = Object.values(users).some(u => u.username && u.username.toLowerCase() === username.toLowerCase());
  if (usernameTaken) {
    return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' });
  }

  users[email] = {
    password, // aquí guardamos el hash desde el frontend
    name,
    username,
    role,
    created: Date.now()
  };

  if (saveUsers(users)) {
    res.json({ success: true, message: 'Usuario registrado exitosamente' });
  } else {
    res.status(500).json({ error: 'Error al guardar usuario' });
  }
});

// Endpoint: verificar login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  const users = readUsers();

  if (!users[email]) {
    return res.status(400).json({ error: 'Usuario no encontrado. Regístrese.' });
  }

  if (users[email].password !== password) {
    return res.status(400).json({ error: 'Contraseña incorrecta.' });
  }

  // Devolver datos del usuario (sin la contraseña)
  const user = { ...users[email] };
  delete user.password;
  res.json({ success: true, user, email });
});

const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
