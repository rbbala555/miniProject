import axios from "axios";

export const httpRequest = axios.create({
    headers: {
        'Content-Type': 'application/json'
    },
});