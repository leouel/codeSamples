import axios from "axios"

var jobService = {
    endpoint: "https://localhost:50001/api/jobs",
    endpoint2: "https://api.remotebootcamp.dev/api/jobs"
}

let getJobs = (pageIndex, pageSize) => {
    const config = {
        method: "GET",
        url: `${jobService.endpoint}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config)
}

let addJob = (payload) => {
    const config = {
        method: "POST",
        url: `${jobService.endpoint}`,
        data: payload,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config)
}

let updateJob = (jobId, payload) => {
    const config = {
        method: "PUT",
        url: `${jobService.endpoint}/${jobId}`,
        data: payload,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config)
}

let searchJob = (pageIndex, pageSize, searchTerms) => {
    const config = {
        method: "GET",
        url: `${jobService.endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&q=${searchTerms}`,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config)
}

let getJobById = (jobId) => {
    const config = {
        method: "GET",
        url: `${jobService.endpoint}/${jobId}`,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config)
}

export { getJobs, addJob, updateJob, searchJob, getJobById }