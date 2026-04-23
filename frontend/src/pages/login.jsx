import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} /><br /><br />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} /><br /><br />
      <button onClick={handleSubmit}>Login</button>
      <p>No account? <a href="/register">Register</a></p>
    </div>
  );
}