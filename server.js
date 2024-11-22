const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const cors = require('cors');


app.use(cors());

app.use(bodyParser.json());

const upload = multer();

const extractData = (data) => {
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));
    const highestLowercase = alphabets.filter(item => /^[a-z]$/.test(item)).sort().pop() || null;
    const isPrimeFound = numbers.some(num => isPrime(Number(num)));
    return { numbers, alphabets, highestLowercase, isPrimeFound };
};

const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

app.post('/bfhl', upload.none(), (req, res) => {
    try {
        const { data, file_b64 } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ is_success: false, message: "Invalid or missing 'data' array" });
        }

        const { numbers, alphabets, highestLowercase, isPrimeFound } = extractData(data);

        let fileDetails = { file_valid: false, file_mime_type: null, file_size_kb: null };

        if (file_b64) {
            try {
                const buffer = Buffer.from(file_b64, 'base64');
                fileDetails.file_valid = true;
                fileDetails.file_size_kb = (buffer.length / 1024).toFixed(2);
                fileDetails.file_mime_type = "application/octet-stream"; 
            } catch (error) {
                fileDetails.file_valid = false;
            }
        }

        res.json({
            is_success: true,
            user_id: "shreya_rai_25032000",
            email: "shreya@gmail.com",
            roll_number: "5635579",
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
            is_prime_found: isPrimeFound,
            ...fileDetails
        });
    } catch (error) {
        res.status(500).json({ is_success: false, message: "Internal Server Error" });
    }
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
