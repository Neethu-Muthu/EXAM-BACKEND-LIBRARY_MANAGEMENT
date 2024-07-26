const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const AdminUser = require('./models/user'); // Admin user management model
const SignupUser = require('./models/users'); // Signup and login model
const Asset = require('./models/asset'); // Assuming you have defined the Asset model

const app = express();
const port = 3007;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Datastore-Library', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/adminDashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adminDashboard.html'));
});

app.get('/assetInventory', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewBook.html'));
});

app.get('/addNewAsset', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'addBook.html'));
});

// app.get('/userManagement', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'userManagement.html'));
// });

// app.get('/createUser', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'createUser.html'));
// });

// API Routes

// Route to handle user signup
app.post('/signup', async (req, res) => {
    const { username, useremail, password } = req.body;

    try {
        const existingUser = await SignupUser.findOne({ useremail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new SignupUser({ username, useremail, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to handle user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await SignupUser.findOne({ useremail: email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // You can implement JWT or session management here

        res.status(200).json({ message: 'Login successful', token: 'dummy-token' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Fetch all assets
app.get('/api/assets', async (req, res) => {
    try {
        const assets = await Asset.find();
        res.status(200).json(assets);
    } catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({ message: 'Failed to fetch assets' });
    }
});

// Fetch asset by ID
app.get('/api/assets/:id', async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (asset) {
            res.status(200).json(asset);
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) {
        console.error('Error fetching asset:', error);
        res.status(500).json({ message: 'Failed to fetch asset' });
    }
});

// Add new asset
app.post('/api/assets', async (req, res) => {
    const { bookName, borrowed, status, dueDate } = req.body;

    try {
        const newAsset = new Asset({ bookName, borrowed, status, dueDate });
        await newAsset.save();
        res.status(201).json(newAsset);
    } catch (error) {
        console.error('Error saving asset:', error);
        res.status(500).json({ message: 'Failed to save asset' });
    }
});

// Update asset
app.put('/api/assets/:id', async (req, res) => {
    const { bookName, borrowed, status, dueDate } = req.body;

    try {
        const updatedAsset = await Asset.findByIdAndUpdate(
            req.params.id,
            { bookName, borrowed, status, dueDate },
            { new: true }
        );
        if (updatedAsset) {
            res.status(200).json(updatedAsset);
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) {
        console.error('Error updating asset:', error);
        res.status(500).json({ message: 'Failed to update asset' });
    }
});

// Delete asset
app.delete('/api/assets/:id', async (req, res) => {
    try {
        const asset = await Asset.findByIdAndDelete(req.params.id);
        if (asset) {
            res.status(200).json({ message: 'Asset deleted successfully' });
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) {
        console.error('Error deleting asset:', error);
        res.status(500).json({ message: 'Failed to delete asset' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
