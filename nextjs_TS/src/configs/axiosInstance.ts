import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_URL, // API base URL
    headers: {
        'Content-Type': 'application/json' // Ensure the data is sent in JSON format
    },
    withCredentials: true // If you are using cookies for authentication
});

// Check if we're in the browser before accessing localStorage
if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('token');
    console.log(token)

    if (token) {
        console.log(token)
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
}

export default axiosInstance;
