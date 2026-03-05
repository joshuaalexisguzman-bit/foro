import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './Login/Login';
import PlataformaEditable from './PlataformaEditable';

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      if (u) {
        setUserEmail(u);
        // Fetch user profile from backend
        fetch('http://10.1.176.207:8000/api/users')
          .then(res => res.json())
          .then(users => {
            if (users[u]) {
              setProfile(users[u]);
            }
          })
          .catch(e => console.error('Error fetching profile:', e));
      }
    } catch (e) {}
  }, []);

  function handleLogin(email) {
    setUserEmail(email);
    // Fetch user profile from backend
    fetch('http://10.1.176.207:8000/api/users')
      .then(res => res.json())
      .then(users => {
        if (users[email]) {
          setProfile(users[email]);
        } else {
          setProfile(null);
        }
      })
      .catch(e => { 
        console.error('Error fetching profile:', e);
        setProfile(null);
      });
  }

  function handleLogout() {
    try {
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
    } catch (e) {}
    setUserEmail(null);
    setProfile(null);
  }

  return (
    <div className="App">
      {userEmail ? (
        <PlataformaEditable profile={profile} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
