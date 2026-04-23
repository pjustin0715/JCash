import { useEffect, useState } from 'react';
import axios from '../api/axios';
import SendMoney from '../components/SendMoney';
import TransactionHistory from '../components/TransactionHistory';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [balance, setBalance] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const fetchBalance = async () => {
    const res = await axios.get('/wallet/balance');
    setBalance(res.data.balance);
  };

  useEffect(() => { fetchBalance(); }, []);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <h2>Welcome, {user?.name}</h2>
      <button onClick={logout}>Logout</button>
      <h3>Balance: ₱{balance}</h3>
      <SendMoney onSuccess={fetchBalance} />
      <TransactionHistory />
    </div>
  );
}