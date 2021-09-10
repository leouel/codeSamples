import React from "react"

function RenderEvent(props){

    const event = props.event

    const editEvent = () => {
        props.edit(event);
    }

    const viewEvent = () => {
        props.view(event);
    }

    return(
        <div className="mb-1">
            <div className="card-body py-0">
                <h6 className="card-subtitle mb-3">{event.headline}</h6>
                <p className="card-text m-0">{event.metaData.dateStart}</p>
                <p className="card-text">{event.summary}</p>
                <div className="m-3 d-flex justify-content-between">
                    <button 
                        className="btn btn-outline-dark bg-dark text-white"
                        onClick={viewEvent}
                    >
                        View More
                    </button>
                    <button 
                        className="btn btn-info text-white"
                        onClick={editEvent}
                    >
                        Edit
                    </button>
                </div>
                <hr/>
            </div>
        </div>
    )
}

export default RenderEvent