const API_URL = import.meta.env.VITE_API_URL || 
                (window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : `${window.location.protocol}//${window.location.hostname}:8000/api`);

export default API_URL;
