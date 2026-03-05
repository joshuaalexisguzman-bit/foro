import React, { useState } from 'react';
import './login.css';
import SHA256 from 'crypto-js/sha256';

function sha256hex(str) {
  return SHA256(str).toString();
}

function detectRole(email) {
  if (!email) return null;
  const e = email.toLowerCase();
  if (e.endsWith('@alumno.ipn.mx')) return 'alumno';
  if (e.endsWith('@ipn.mx')) return 'profesor';
  return null;
}

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [remember, setRemember] = useState(false);
  const [msg, setMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const em = (email || '').trim().toLowerCase();
    const pw = password || '';

    if (!em || em.indexOf('@') === -1) {
      setMsg('Correo inválido.');
      return;
    }

    const role = detectRole(em);
    if (isRegister) {
      // Registration flow
      if (!role) { setMsg('Use un correo institucional (@alumno.ipn.mx o @ipn.mx).'); return; }
      if (!name || name.trim().length < 2) { setMsg('Ingrese su nombre.'); return; }
      if (!username || username.trim().length < 3) { setMsg('Ingrese un nombre de usuario (mín 3 caracteres).'); return; }
      if (pw.length < 4) { setMsg('La contraseña debe tener al menos 4 caracteres.'); return; }
      if (pw !== confirm) { setMsg('Las contraseñas no coinciden.'); return; }

      try {
        const hash = sha256hex(pw);
        const response = await fetch('http://10.1.176.207:8000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: em,
            password: hash,
            name: name.trim(),
            username: username.trim(),
            role
          })
        });

        const data = await response.json();
        if (!response.ok) {
          setMsg(data.error || 'Error al registrar.');
          return;
        }

        try {
          if (remember) localStorage.setItem('currentUser', em);
          else sessionStorage.setItem('currentUser', em);
        } catch (e) {}

        setMsg('Registro exitoso.');
        if (onLogin) onLogin(em);
      } catch (err) {
        setMsg('Error al conectar con el servidor: ' + err.message);
      }

    } else {
      // Login flow
      if (pw.length < 1) { setMsg('Ingrese la contraseña.'); return; }
      try {
        const hash = sha256hex(pw);
        const response = await fetch('http://10.1.176.207:8000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: em,
            password: hash
          })
        });

        const data = await response.json();
        if (!response.ok) {
          setMsg(data.error || 'Error en el proceso de autenticación.');
          return;
        }

        try {
          if (remember) localStorage.setItem('currentUser', em);
          else sessionStorage.setItem('currentUser', em);
        } catch (e) {}

        setMsg('');
        if (onLogin) onLogin(em);
      } catch (err) {
        setMsg('Error al conectar con el servidor: ' + err.message);
      }
    }
  }

  return (
    <main className="login-container">
      <nav>
        <h1>Foro de comunicación estudiantil</h1>
      </nav>
      {/* page-specific title centered above form */}
      <h2>{isRegister ? 'Registro' : 'Iniciar Sesión'}</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {isRegister && (
          <>
            <label htmlFor="name">Nombre completo</label>
            <input id="name" name="name" required placeholder="Nombre completo" value={name} onChange={e => setName(e.target.value)} />
          </>
        )}

        <label htmlFor="email">Correo institucional</label>
        <input id="email" name="email" type="email" required placeholder="usuario@alumno.ipn.mx o @ipn.mx" value={email} onChange={e => setEmail(e.target.value)} />

        {isRegister && (
          <>
            <label htmlFor="username">Nombre de usuario</label>
            <input id="username" name="username" required placeholder="nombre de usuario" value={username} onChange={e => setUsername(e.target.value)} />
          </>
        )}

        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" required placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />

        {isRegister && (
          <>
            <label htmlFor="confirm">Confirmar contraseña</label>
            <input id="confirm" name="confirm" type="password" required placeholder="Repite la contraseña" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </>
        )}

        <label className="remember">
          <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} />{' '}Recordarme
        </label>

        <div style={{ marginTop: 10 }}>
          <button type="submit" className="boton">{isRegister ? 'Registrarse' : 'Entrar'}</button>
          <button type="button" className="boton" style={{ marginLeft: 8 }} onClick={() => { setIsRegister(!isRegister); setMsg(''); }}>
            {isRegister ? 'Tengo cuenta' : 'Registro'}
          </button>
        </div>

        <p className="msg">{msg}</p>
        <p style={{ marginTop: 8 }}>
          {isRegister ? 'Use su correo institucional para registrarse.' : 'Ingrese su correo y contraseña.'}
        </p>
      </form>
    </main>
  );
}

export default Login;
