import axios from "axios";

axios.defaults.baseURL = process.env.API_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.API_SECRET}`;
axios.defaults.timeout = 2000

export default axios
