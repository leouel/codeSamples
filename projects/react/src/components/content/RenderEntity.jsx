import React from "react"

function RenderEntity(props){
    const entity = props.entity

    const editEntity = function(){
        props.editThisEntity(entity);
    }

    const viewMore = function(){
        props.viewThisEntity(entity)
    }

    const deleteEntity = function(){
        props.deleteThisEntity(entity)
    }

    const photo = function(){
        let techCompany = entity.techCompany || false
        if(entity.primaryImage){
            return entity.primaryImage.imageUrl
        } else if(techCompany.images){
            return entity.techCompany.images[0].imageUrl
        } else if(entity.images){
            return entity.images[0].imageUrl
        } else {
            return "https://i.pravatar.cc/400?img=48"
        }
    }

    return(
        <div className="col-lg-3 col-md-4 col-sm-12 my-4">
            <div className="card border-0 shadow">
                <img
                    src={photo()}
                    className="card-img-top rounded-circle w-75 mx-auto mt-4"
                    alt="..."
                />
                <div className="card-body text-center">
                    <h5 className="card-title mb-2">{(entity.pay||false) || (entity.name||false) || (entity.title||false)}</h5>
                    <div className="card-text text-black-50 mb-2">{(entity.title||false) || (entity.headline||false) || (entity.summary||false)}</div>

                    <div className="mb-2">
                    {props.deleteThisEntity && 
                        <button
                            type="button"
                            className="btn btn-danger btn-md me-2"
                            onClick={deleteEntity}
                        >
                            Delete
                        </button>
                    }

                    <button
                        type="button"
                        className="btn btn-info btn-md text-white"
                        onClick={editEntity}
                        data-entity-id={entity.id}
                    >
                        Edit
                    </button>
                    </div>

                    <div className="card-text mb-3">
                    {props.viewThisEntity && 
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-md"
                            onClick={viewMore}
                        >
                            View More
                        </button>
                    }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default RenderEntity