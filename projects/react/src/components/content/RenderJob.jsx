// import RenderJob from "./RenderJob";
import React from "react"

function RenderJob(props){
    
    const job = props.job

    const editJob = function(){
        props.editThisJob(job)
    }

    const viewMore = function(){
        props.viewThisJob(job)
    }

    const photo = function(haveImg){
        if(haveImg){
            return job.techCompany.images[0].imageUrl
        }else{
            return "https://i.pravatar.cc/400?img=48"
        }
    }

    return(
        <div className="col-lg-3 col-md-4 col-sm-12 my-4">
            <div className="card border-0 shadow">
                <img
                    src={photo(job.techCompany.images)}
                    className="card-img-top rounded-circle w-75 mx-auto mt-4"
                    alt="..."
                />
                <div className="card-body text-center">
                    <h5 className="card-title mb-2">{job.pay}</h5>
                    <div className="card-text text-black-50 mb-2">{job.title}</div>
                    <button
                        type="button"
                        className="btn btn-info btn-md text-white mb-2"
                        onClick={editJob}
                        data-job-id={job.id}
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
    );
}

export default RenderJob