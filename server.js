import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();

// Use the port from the .env file or default to 3000
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files (index.html, uploadToIPFS.js)
app.use(express.static(path.join(__dirname, 'public')));

// Set up file storage using multer
const storage = multer.memoryStorage(); // Store files in memory for simplicity
const upload = multer({ storage: storage });

// API endpoint for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const apiKey = process.env.PINATA_API_KEY; // Get Pinata API key from environment variables
    const apiSecret = process.env.PINATA_SECRET_API_KEY; // Get Pinata secret key from environment variables

    try {
        // Create a FormData object and append the file buffer
        const form = new FormData();
        form.append('file', req.file.buffer, req.file.originalname);

        // Use axios to send the POST request to Pinata
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
            headers: {
                ...form.getHeaders(),
                'pinata_api_key': apiKey,
                'pinata_secret_api_key': apiSecret,
            },
        });

        // If successful, send back the IPFS hash
        res.json({ success: true, IpfsHash: response.data.IpfsHash });
    } catch (err) {
        console.error('Error uploading file to IPFS:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
