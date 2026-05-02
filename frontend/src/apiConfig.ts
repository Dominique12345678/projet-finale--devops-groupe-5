const API_URL = import.meta.env.VITE_API_URL || 
                (window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '/api');

export default API_URL;
