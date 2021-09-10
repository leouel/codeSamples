import axios from "axios";
import {
    API_HOST_PREFIX, onGlobalError, onGlobalSuccess,
  } from "./serviceHelpers";

const userEndpoint = `${API_HOST_PREFIX}/api/users`;

let register = (payload) => {
    const config = {
        url: `${userEndpoint}/register`,
        method: "POST",
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }
    return axios(config);
}

let login = (payload) => {
    const config = {
        url: `${userEndpoint}/login`,
        method: "POST",
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }
    return axios(config);
}

let getCurrent = () => {
    const config = {
        url: `${userEndpoint}/current`,
        method: "GET",
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError)
}

let logout = () => {
    const config = {
        url: `${userEndpoint}/logout`,
        method: "GET",
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError)
}

export { register, login, getCurrent, logout }