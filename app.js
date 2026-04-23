import express from 'express';
import { getUser, getUsers, createUser, deleteUser, getAllTransactions, getTransactions, sendTransaction } from './database.js';

const app = express();

app.use(express.json());

app.get('/users', async (req, res) => {
    const users = await getUsers();
    res.send(users);
});

app.get('/users/:id', async (req, res) => {
    const users = await getUser(req.params.id);
    res.send(users);
});

app.post('/users', async (req, res) => {
    const { username, phone_number, password_hash } = req.body;
    const user = await createUser(username, phone_number, password_hash);
    res.send(user);
});

app.delete('/users/:id', async (req, res) => {
    const result = await deleteUser(req.params.id);
    res.send(result);
});

app.get('/transactions-debug', async (req, res) => {
    const transactions = await getAllTransactions();
    res.send(transactions);
})

app.get('/transactions/:id', async (req, res) =>{
    const userId = req.params.id;
    const transactions = await getTransactions(userId); 
    const messages = transactions.map(t => {
        if (t.sender_id == userId) return `You sent ${t.amount} to ${t.recipient_username}`;
        else return `You received ${t.amount} from ${t.sender_username}`;
    });
    res.send(messages);
})

app.post('/transactions/:id', async (req, res) => {
    const sender_id = req.params.id;
    const { recipient_id, amount } = req.body;
    const result = await sendTransaction(sender_id, recipient_id, amount);

    res.send(result);
})  


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});