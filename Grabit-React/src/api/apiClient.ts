import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://your-api-url.com/api', // ضع رابط API الخاص بك
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
