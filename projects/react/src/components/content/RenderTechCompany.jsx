// import RenderTechCompany from "./RenderTechCompany";
import React from "react"

function RenderTechCompany(props){

    const techCompany = props.techCompany

    const viewMore = function(){
        props.viewThisCompany(techCompany)
    }

    return(
        <div className="col-lg-3 col-md-4 col-sm-12 my-4">
            <div className="card border-0 shadow">
                <img
                    src="https://i.pravatar.cc/400?img=48"
                    className="card-img-top rounded-circle w-75 mx-auto mt-4"
                    alt="..."
                />
                <div className="card-body text-center">
                    <h5 className="card-title mb-2">{techCompany.name}</h5>
                    <div className="card-text text-black-50 mb-2">{techCompany.headline}</div>
                    <button
                        type="button"
                        className="btn btn-info btn-md text-white mb-2"
                        // onClick={editJob}
                        // data-job-id={job.id}
                    >
                        Edit
                    </button>
                    <div className="card-text mb-3">
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-md"
                        onClick={viewMore}
                    >
                        View More
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RenderTechCompany