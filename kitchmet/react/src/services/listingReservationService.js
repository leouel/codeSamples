import axios from "axios"
import { API_HOST_PREFIX } from "./serviceHelpers";

const listingReservationEndpoint = `${API_HOST_PREFIX}/api/listingreservation`

let create = (payload) => {
  const config = {
    url: `${listingReservationEndpoint}`,
    method: "POST",
    data: payload,
    crossdomain: true,
    headers: { "Content-Type":"application/json" }
  }
  return axios(config)
}

export { create }