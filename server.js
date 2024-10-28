const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Đảm bảo đã cài đặt node-fetch
const app = express();
const port = 3000; // Hoặc cổng bạn muốn sử dụng

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Để phục vụ file tĩnh như HTML, CSS, JS

// Endpoint cho ChatGPT
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    // Thay đổi dưới đây với API key của bạn
    const apiKey = 'YOUR_API_KEY_HERE';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }]
            })
        });

        const data = await response.json();
        res.json(data); // Gửi phản hồi về cho client
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra trong quá trình xử lý.' });
    }
});

// Bắt đầu server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
