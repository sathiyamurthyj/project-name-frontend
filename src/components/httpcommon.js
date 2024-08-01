import Axios from "axios";

const axiosBaseUrl = Axios.create({
    baseURL:'https://project-name-backend-0z22.onrender.com'
});

export default axiosBaseUrl;

