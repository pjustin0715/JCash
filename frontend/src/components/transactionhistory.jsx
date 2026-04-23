import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function TransactionHistory() {
  const [history, setHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get('/wallet/history').then(res => setHistory(res.data));
  }, []);

  return (
    <div>
      <h4>Transaction History</h4>
      {history.length === 0 && <p>No transactions yet.</p>}
      {history.map(t => (
        <div key={t.id} style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
          {t.sender_id === user.id
            ? <span style={{ color: 'red' }}>- ₱{t.amount} to {t.receiver_name}</span>
            : <span style={{ color: 'green' }}>+ ₱{t.amount} from {t.sender_name}</span>
          }
          <br />
          <small>{new Date(t.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}