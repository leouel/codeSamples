import React from "react"
import RenderEntity from "../Content/RenderEntity";
import * as jobService from "../../services/jobService"
import Pagination from "rc-pagination";
import ModalViewMore from "./ModalViewMore";


class UserJobsPage extends React.Component{

    state = {
        jobs: [{}],
        jobDetails: {},
        current: 1,
        totalPages: 0,
        isModalOpen: false,
    }

    componentDidMount(){
        console.log("componentDidMount() -> UserJobsPage");
        jobService.getJobs(0, 4)
            .then(this.onGetJobsSuccess)
            .catch(this.onGetJobsError)
    }

    //####### RENDER PAGE #######//
    mapJobs = (job) => {
        return (
            <React.Fragment key={job.id}>
                <RenderEntity
                    entity={job}
                    editThisEntity={this.onEditClick}
                    viewThisEntity={this.toggleModal}
                />
            </React.Fragment>
        )
    }

    toggleModal = (job) => {
        this.setState((prevState) => {
            if(prevState.isModalOpen){
                return {
                    ...prevState,
                    isModalOpen: !prevState.isModalOpen,
                    jobDetails: {}
                }
            }else{
                if(typeof job.skills === "string"){
                    let jobDetails = {...prevState.jobDetails}
                    jobDetails = job
                    jobDetails.companyName = job.techCompany.name
                    return {
                        ...prevState,
                        isModalOpen: !prevState.isModalOpen,
                        jobDetails
                    }
                } else {
                    let jobDetails = {...prevState.jobDetails}
                    jobDetails = job
                    jobDetails.companyName = job.techCompany.name
                    if(jobDetails.skills != null){
                        jobDetails.skills = job.skills.map((element)=>{
                            return element.name
                        })
                        jobDetails.skills = jobDetails.skills.join(", ")
                    }
                    return {
                        ...prevState,
                        isModalOpen: !prevState.isModalOpen,
                        jobDetails
                    }
                }
            }
        })
    }

    onChange = (page) => {
        let nextPg = page-1
        //use this.state.totalPages to traverse the page and display found jobs
        // this.state.mappedJobs
        jobService.getJobs(nextPg, 4)
            .then(this.onGetJobsSuccess)
            .catch(this.onGetJobsError)
        this.setState(prevState => {
            return{
                ...prevState,
                current:page
            }
        })
    }

    //####### EVENT HANDLERS #######//
    searchField = (e) => {
        e.preventDefault();
        let searchTerms = e.currentTarget.value;

        this.setState(prevState=>{ 
            return{
                ...prevState,
                searchJob: searchTerms
            }
        })
    }

    onAddJobsClick = (e) => {
        e.preventDefault();
        this.props.history.push("/jobs/add")
    }

    onSearchClick = (e) => {
        e.preventDefault();
        let searchTerms = this.state.searchJob;
        jobService.searchJob(0, 10, searchTerms)
            .then(this.onSearchJobSuccess)
            .catch(this.onSearchJobError)
    }

    onEditClick = (job) => {
        this.props.history.push(`/jobs/edit/${job.id}`)
    }

    onViewMoreClick = (job) => {
        console.log("View more:", job);
    }

    //####### SUCCESS HANDLERS #######//
    onGetJobsSuccess = (response) => {
        console.log(response.data, "onGetJobsSuccess");
        let allJobs = response.data.item.pagedItems
        let totalPgPagination = (response.data.item.totalPages * 10)
        this.setState(prevState => {
            return{
                ...prevState,
                jobs: allJobs,
                mappedJobs: allJobs.map(this.mapJobs),
                totalPages: totalPgPagination
            }
        })
    }

    onSearchJobSuccess = (response) => {
        console.log(response.data, "onSearchJobSuccess");
        let foundJobs = response.data.item.pagedItems
        let totalPgPagination = (response.data.item.totalPages * 10)
        this.setState(prevState => {
            return{
                ...prevState,
                mappedJobs : foundJobs.map(this.mapJobs),
                totalPages: totalPgPagination
            }
        })
    }


    //####### ERROR HANDLERS #######//
    onGetJobsError = (errResponse) => {
        console.log({ error:errResponse });
    }

    onSearchJobError = (errResponse) => {
        console.log({ error:errResponse });

    }

    render(){
        return(
            <React.Fragment>
                <div className="container p-2 my-1 bg-primary rounded-3" >
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start px-3">
                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                            <li>
                            <button
                                className="btn btn-outline-light px-3 me-2 disabled"
                            >
                                Jobs
                            </button>
                            </li>
                            <li>
                            <button className="btn btn-outline-light px-2" onClick={this.onAddJobsClick}>
                                + Jobs
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
                    {this.state.mappedJobs}
                    <ModalViewMore
                        isModalOpen={this.state.isModalOpen}
                        toggleModal={this.toggleModal}
                        title={this.state.jobDetails.title}
                        description={this.state.jobDetails.description}
                        summary={this.state.jobDetails.summary}
                        pay={this.state.jobDetails.pay}
                        skills={this.state.jobDetails.skills}
                        company={this.state.jobDetails.companyName}
                    />
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

export default UserJobsPage