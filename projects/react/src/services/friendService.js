import axios from "axios"

var friendService = {
    endpoint:"https://localhost:50001/api/friends",
    deleteEndpoint: "https://api.remotebootcamp.dev/api/friends"
}

let getFriends = (pageIndex, pageSize) => {
    const config = {
        method: "GET",
        url: `${friendService.endpoint}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config)
}

let searchFriends = (pageIndex, pageSize, searchTerms) => {
    const config ={
        method: "GET",
        url: `${friendService.endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&q=${searchTerms}`,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config)
}

let getFriendById = (friendId) => {
    const config = {
        method: "GET",
        url: `${friendService.endpoint}/${friendId}`,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config)
}

let addFriends = (payload) => {
    const config = {
        method: "POST",
        url: `${friendService.endpoint}`,
        data: payload,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config)
}

let updateFriend = (friendId, payload) => {
    const config = {
        method: "PUT",
        url: `${friendService.endpoint}/${friendId}`,
        data: payload,
        crossdomain: true,
        headers: { "Content-Type":"application/json" }
    }

    return axios(config)
}

let deleteFriendById = (friendId) => {
    const config = {
        method: "DELETE",
        url: `${friendService.deleteEndpoint}/${friendId}`,
        crossdomain: true,
        headers: { "Content-Type":"application/json" },
        id: friendId
    }

    return axios(config)
}

export { getFriends, addFriends, getFriendById, updateFriend, deleteFriendById, searchFriends } 