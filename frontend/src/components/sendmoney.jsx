import { useState } from 'react';
import axios from '../api/axios';

export default function SendMoney({ onSuccess }) {
  const [form, setForm] = useState({ receiver_email: '', amount: '' });
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    try {
      const res = await axios.post('/wallet/send', form);
      setMessage(res.data.message);
      onSuccess();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Transfer failed');
    }
  };

  return (
    <div>
      <h4>Send Money</h4>
      <input placeholder="Recipient email" onChange={e => setForm({ ...form, receiver_email: e.target.value })} /><br /><br />
      <input placeholder="Amount (₱)" type="number" onChange={e => setForm({ ...form, amount: e.target.value })} /><br /><br />
      <small>Note: ₱10 fee applies</small><br /><br />
      <button onClick={handleSend}>Send</button>
      {message && <p>{message}</p>}
    </div>
  );
}