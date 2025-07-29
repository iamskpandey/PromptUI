import axios from 'axios';

const API = axios.create({
  baseURL: process.env.SERVER_PUBLIC_API_URL || 'http://localhost:5001/api', 
});

export default API;