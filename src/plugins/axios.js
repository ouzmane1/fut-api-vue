import axios from 'axios'

// Configuration par défaut d'Axios
axios.defaults.baseURL = 'http://localhost:8000/api'

// Vous pouvez également ajouter des en-têtes globaux si nécessaire
// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

export default axios
