import React from "react"
import RenderEntity from "../Content/RenderEntity";
import * as techCompanyService from "../../services/techCompanyService"
import Pagination from "rc-pagination";
import ModalViewMore from "./ModalViewMore";

class UserTechCompaniesPage extends React.Component{

    state = {
        companies: [{}],
        companyDetails: {},
        current: 1,
        totalPages: 0,
        isModalOpen: false
    }

    componentDidMount(){
        console.log("componentDidMount() -> UserTechCompaniesPage");
        techCompanyService.getTechCompanies(0, 4)
            .then(this.onGetTechCompaniesSuccess)
            .catch(this.onGetTechCompaniesError)
    }

    //####### RENDER COMPANIES #######//
    mapTechCompanies = (techCompany) => {
        return (
            <React.Fragment key={techCompany.id}>
                {/* <RenderTechCompany
                    techCompany={techCompany}
                    viewThisCompany={this.toggleModal}
                /> */}
                <RenderEntity
                    entity={techCompany}
                    viewThisEntity={this.toggleModal}
                    editThisEntity={this.onEditClick}
                />
            </React.Fragment>
        )
    }

    //####### BUTTON HANDLERS #######//
    onNextPage = (page) => {
        let nextPg = page-1
        techCompanyService.getTechCompanies(nextPg, 4)
            .then(this.onGetTechCompaniesSuccess)
            .catch(this.onGetTechCompaniesError)
        this.setState(prevState => {
            return{
                ...prevState,
                current:page
            }
        })
    }

    toggleModal = (company) => {
        this.setState(prevState => {
            if(prevState.isModalOpen){
                return {
                    ...prevState,
                    isModalOpen: !prevState.isModalOpen,
                    companyDetails: {}
                }
            } else {
                return{
                    ...prevState,
                    isModalOpen: !prevState.isModalOpen,
                    companyDetails: company
                }
            }
        })
    }

    onAddTechCosClick = (e) => {
        e.preventDefault();
        this.props.history.push("/techco/add")
    }

    onViewMoreClick = (company) => {
        console.log(company);
    }

    onEditClick = (company) => {
        this.props.history.push(`/techCo/edit/${company.id}`)
    }

    //####### SUCCESS HANDLERS #######//
    onGetTechCompaniesSuccess = (response) => {
        console.log(response.data, "onGetTechCompaniesSuccess");
        this.setState(prevState=>{
            return{
                ...prevState,
                companies: response.data.item.pagedItems,
                mappedCompanies: response.data.item.pagedItems.map(this.mapTechCompanies),
                totalPages: response.data.item.totalPages*10
            }
        })

    }

    //####### ERROR HANDLERS #######//
    onGetTechCompaniesError = (errResponse) => {
        console.log({ error:errResponse });
    }

    render(){
        return(
            <React.Fragment>
                <div className="container p-2 my-1 bg-success rounded-3" >
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start px-3">
                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                            <li>
                            <button
                                className="btn btn-outline-light px-3 me-2 disabled"
                            >
                                Tech Companies
                            </button>
                            </li>
                            <li>
                            <button className="btn btn-outline-light px-2" onClick={this.onAddTechCosClick}>
                                + TechCos.
                            </button>
                            </li>
                            
                        </ul>

                        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                            <input
                            type="search"
                            className="form-control form-control-dark"
                            placeholder="Search..."
                            name="searchTerms"
                            // onChange={this.searchField}
                            />
                        </form>

                        <div className="text-end">
                            <button type="button" className="btn btn-outline-light" 
                            // onClick={this.onSearchClick}
                            >
                            Search
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {this.state.mappedCompanies}
                    <ModalViewMore
                        isModalOpen={this.state.isModalOpen}
                        toggleModal={this.toggleModal}
                        title={this.state.companyDetails.name}
                        company={this.state.companyDetails.headline}
                        profile={this.state.companyDetails.profile}
                        summary={this.state.companyDetails.summary}
                    />
                    <Pagination
                        onChange={this.onNextPage}
                        current={this.state.current}
                        total={this.state.totalPages}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default UserTechCompaniesPage