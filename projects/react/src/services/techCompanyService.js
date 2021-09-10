import axios from "axios"

var techCompanyService = {
    endpoint: "https://localhost:50001/api/techcompanies",
    endpoint2: "https://api.remotebootcamp.dev/api/techcompanies"
}

let getTechCompanies = (pageIndex, pageSize) => {
    const config = {
        method: "GET",
        url: `${techCompanyService.endpoint}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config)
}

let addTechCompany = (payload) => {
    const config = {
        method: "POST",
        url: `${techCompanyService.endpoint}`,
        data: payload,
        crossdomain: true,
        headers: { "Content-Type":"application/json" },
    }

    return axios(config)
}

let getTechCompanyById = (companyId) => {
    const config = {
        method: "GET",
        url: `${techCompanyService.endpoint}/${companyId}`,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config)
}

let updateTechCompany = (companyId, payload) => {
    const config = {
        method: "PUT",
        url: `${techCompanyService.endpoint}/${companyId}`,
        data: payload,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config)
}

export { getTechCompanies, addTechCompany, getTechCompanyById, updateTechCompany }