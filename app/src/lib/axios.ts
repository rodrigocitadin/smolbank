import axios from "axios";

axios.defaults.baseURL = process.env.API_URL;
axios.defaults.timeout = 2000

export default axios
