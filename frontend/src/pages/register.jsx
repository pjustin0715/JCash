import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post('/auth/register', form);
      setMessage('Registered successfully! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      setMessage('Registration failed. Email may already exist.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} /><br /><br />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} /><br /><br />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} /><br /><br />
      <input placeholder="Phone" onChange={e => setForm({ ...form, phone: e.target.value })} /><br /><br />
      <button onClick={handleSubmit}>Register</button>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}