import axios from "axios";

axios.defaults.baseURL = process.env.API_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.API_SECRET}`;

export default axios
