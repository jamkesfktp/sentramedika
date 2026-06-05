import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [num1] = useState(Math.floor(Math.random() * 10) + 1);
  const [num2] = useState(Math.floor(Math.random() * 10) + 1);
  const [captchaInput, setCaptchaInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(captchaInput) !== num1 + num2) {
      setError('Captcha salah! Silakan hitung dengan benar.');
      return;
    }
    
    if (username === 'puspa' && password === 'sentra123456') {
      onLogin();
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: '100vh', backgroundColor: 'var(--bg-main)', fontFamily: 'var(--font-family)'
    }}>
      <div className="glass-card" style={{
        padding: '2rem', width: '100%', maxWidth: '400px', 
        display: 'flex', flexDirection: 'column', gap: '1.5rem',
        borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'var(--accent-navy)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>SENTRAMEDIKA</h1>
          <p style={{ color: 'var(--text-muted)' }}>Silakan login untuk mengakses Dashboard</p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)',
                color: 'var(--text-main)', borderRadius: '8px', outline: 'none'
              }}
              required
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)',
                color: 'var(--text-main)', borderRadius: '8px', outline: 'none'
              }}
              required
            />
          </div>

          {/* Captcha Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ 
              backgroundColor: 'var(--bg-card)', padding: '0.5rem 1rem', 
              borderRadius: '8px', border: '1px solid var(--border-color)', 
              fontWeight: 'bold', color: 'var(--accent-navy)' 
            }}>
              {num1} + {num2} = 
            </div>
            <input 
              type="number" 
              placeholder="Hasil" 
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              style={{
                flex: 1, padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)',
                color: 'var(--text-main)', borderRadius: '8px', outline: 'none'
              }}
              required
            />
          </div>

          <button type="submit" style={{
            marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--accent-navy)',
            color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600',
            cursor: 'pointer', transition: 'background-color 0.2s'
          }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
