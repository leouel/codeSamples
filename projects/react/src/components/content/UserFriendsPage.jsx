import React from "react"
import RenderEntity from "../Content/RenderEntity";
import * as friendService from "../../services/friendService"
import Pagination from "rc-pagination";
import 'rc-pagination/assets/index.css'
// import Pagination from 'rc-pagination';
import debug from "sabio-debug"
import PropTypes from "prop-types"

const _logger = debug.extend("UserFriendsPage")

class UserFriendsPage extends React.Component{

    state = {
        friends:[{}],
        searchFriend: {},
        current: 1,
        totalPages: 0
    }

    componentDidMount(){
        _logger("componentDidMount() -> UserFriendsPage");

        friendService.getFriends(0,4)
            .then(this.onGetFriendsSuccess)
            .catch(this.onGetFriendsError)
    }

    //####### RENDER PAGE #######//
    mapFriends = (friend) => {
        return(
            <React.Fragment key={`Fr-${friend.id}`}>
                <RenderEntity
                    entity={friend}
                    deleteThisEntity={this.onDeleteClick}
                    editThisEntity={this.onEditClick}
                />
            </React.Fragment>
        )
    }

    onChange = (page) => {
        let nextPg = page-1
        friendService.getFriends(nextPg,4)
            .then(this.onGetFriendsSuccess)
            .catch(this.onGetFriendsError)
        this.setState((prevState)=>{
            return{
                ...prevState,
                current:page
            }
        })
    }

    searchField = (e) => {
        let currentTarget = e.currentTarget
        let inputName = currentTarget.name
        let newValue = currentTarget.value;
        this.setState(() => {
            let searchFriend = {...this.state.searchFriend}
            searchFriend[inputName] = newValue;
            return {searchFriend}
        })
    }

    //####### BUTTONS #######//
    onAddFriendsClick = (e) => {
        e.preventDefault();
        this.props.history.push(`/friends/add`)
    }

    onEditClick = (oneFriend) => {
        this.props.history.push(`friends/edit/${oneFriend.id}`)
    }

    onDeleteClick = (oneFriend) => {
        _logger(`Deleted friend with: ${oneFriend.id}`);
        friendService.deleteFriendById(oneFriend.id)
            .then(this.onDeleteFriendSuccess)
            .catch(this.onDeleteFriendError)
    }

    onSearchClick = (e) => {
        e.preventDefault();
        _logger(this.state.searchFriend.searchTerms);
        let searchTerms = this.state.searchFriend.searchTerms
        friendService.searchFriends(0, 10, searchTerms)
            .then(this.onSearchFriendsSuccess)
            .catch(this.onSearchFriendsError)
    }

    //####### SUCCESS HANDLERS #######//
    onGetFriendsSuccess = (response) => {
        _logger(response.data, "onGetFriendsSuccess");
        let currentFriends = response.data.item.pagedItems;
        let totalPgPagination = (response.data.item.totalPages * 10)
        this.setState((prevState)=>{
            return{ 
                ...prevState,
                mappedFriends: currentFriends.map(this.mapFriends),
                totalPages: totalPgPagination
            }
        })

        // DELETE ON NO ADDITIONAL AJAX CALLS
        // let friendsDisplay = currentFriends.slice(0, 4)
        // let totalPgPagination = (response.data.item.totalCount + 15)

        // this.setState((prevState)=>{
        //     return{ 
        //         ...prevState,
        //         originalFriends: currentFriends,
        //         friends: friendsDisplay,
        //         mappedFriends: friendsDisplay.map(this.mapFriends),
        //         totalPages: totalPgPagination
        //     }
        // })
    }

    onDeleteFriendSuccess = (response) => {
        _logger(response.data, "onDeleteFriendSuccess");
        friendService.getFriends(0,4)
            .then(this.onGetFriendsSuccess)
            .catch(this.onGetFriendsError)

        // let currentFriends = this.state.friends
        // for(let i = 0; i < currentFriends.length; i++){
        //     if(response.config.id === currentFriends[i].id){
        //         _logger(currentFriends[i]);
        //         currentFriends.splice(i, 1);
        //     }
        // }
        
        // let friendsDisplay = currentFriends.slice(0, 4)

        // this.setState(prevState=>{
        //     return{
        //         ...prevState,
        //         friends:currentFriends,
        //         mappedFriends:friendsDisplay.map(this.mapFriends)
        //     }
        // })
    }

    onSearchFriendsSuccess = (response) => {
        _logger(response.data, "onSearchFriendsSuccess");
        let foundFriends = response.data.item.pagedItems;
        _logger(foundFriends);
        let totalPgPagination = (response.data.item.totalPages * 10)
        this.setState((prevState) => {
            return{
                ...prevState,
                mappedFriends: foundFriends.map(this.mapFriends),
                totalPages: totalPgPagination
            }
        })
    }

    //####### ERROR HANDLERS #######//
    onGetFriendsError = (errResponse) => {
        _logger({ error: errResponse });
    }

    onDeleteFriendError = (errResponse) => {
        _logger({error: errResponse});
    }

    onSearchFriendsError = (errResponse) => {
        _logger({error:errResponse});
    }

    render(){
        return(
            <React.Fragment>
                <div className="container p-2 my-1 bg-secondary rounded-3">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start px-3">
                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                            <li>
                            <button
                                className="btn btn-outline-light px-2 me-2 disabled"
                            >
                                Friends
                            </button>
                            </li>
                            <li>
                            <button className="btn btn-outline-light px-2" onClick={this.onAddFriendsClick}>
                                + Friends
                            </button>
                            </li>
                            
                        </ul>

                        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                            <input
                            type="search"
                            className="form-control form-control-dark"
                            placeholder="Search..."
                            name="searchTerms"
                            onChange={this.searchField}
                            />
                        </form>

                        <div className="text-end">
                            <button type="button" className="btn btn-outline-light" 
                            onClick={this.onSearchClick}>
                            Search
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {this.state.mappedFriends}
                    <Pagination 
                        onChange={this.onChange}
                        current={this.state.current}
                        total={this.state.totalPages}
                    />
                </div>
                
            </React.Fragment>
        );
    }
}


RenderEntity.propTypes = {
    entity: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        headline: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired
    }),
    deleteThisEntity: PropTypes.func.isRequired,
    editThisEntity: PropTypes.func.isRequired
}

export default UserFriendsPage