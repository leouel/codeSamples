// import RenderFriend from "./RenderFriend";
import React from "react"

function RenderFriend(props){

    const friend = props.friend

    const editFriend = function(){
        props.editThisFriend(friend);
    }

    const deleteFriend = function(){
        props.deleteThisFriend(friend)
    }

    return(
        <div className="col-lg-3 col-md-4 col-sm-12 my-4">
            <div className="card border-0 shadow">
                <img
                    src={friend.primaryImage.imageUrl}
                    className="card-img-top"
                    alt="..."
                />
                <div className="card-body text-center">
                    <h5 className="card-title mb-2">{friend.title}</h5>
                    <div className="card-text text-black-50 mb-2">{friend.summary}</div>
                    <button
                        type="button"
                        className="btn btn-danger btn-md me-2"
                        onClick={deleteFriend}
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        className="btn btn-info btn-md"
                        onClick={editFriend}
                        data-fr-id={friend.id}
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default React.memo(RenderFriend)