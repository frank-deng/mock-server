import axios from 'axios';
const req=axios.create({
    baseURL:'http://localhost:8083',
    timeout: 5000
});
export default req;