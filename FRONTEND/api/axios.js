import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:5051",
    withCredentials:true
});

export default api;