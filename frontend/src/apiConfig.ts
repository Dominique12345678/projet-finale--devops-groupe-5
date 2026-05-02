const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                ? 'http://localhost:8000/api'
                : 'http://18.134.129.246:8000/api';

export default API_URL;
