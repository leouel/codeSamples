import axios from "axios"

var eventService = {
    endpoint: "https://api.remotebootcamp.dev/api/events/",
}

let getFeed = (pageIndex, pageSize) => {
    const config = {
        url: `${eventService.endpoint}/feed?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config);
}

export { getFeed }