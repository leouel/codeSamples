import axios from "axios"

var userService = {
    endpoint: "https://api.remotebootcamp.dev/api/users"
}

let register = (payload) => {

    const config = {
        method: "POST",
        url: `${userService.endpoint}/register`,
        data: payload,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    };

    return axios(config);
}

let logIn = (payload) => {
    
    const config = {
        method: "POST",
        url: `${userService.endpoint}/login`,
        data: payload,
        crossdomain: true,
        headers: { "Content-Type":"application/json" },
    }

    return axios(config);
};

let getCurrent = () => {
    const config = {
        method: "GET",
        url: `${userService.endpoint}/current`,
        crossdomain: true,
        headers: { "Content-Type":"application/json" },
    }

    return axios(config)
}

let logOut = () => {
    const config = {
        method: "GET",
        url: `${userService.endpoint}/logout`,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config);
}

let getUserById = (userId) => {
    const config = {
        method: "GET",
        url: `${userService.endpoint}/${userId}`,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config);
}

export { register, logIn, getCurrent, logOut, getUserById }