import React from "react"
import RenderEvent from "../Content/RenderEvent"
import Pagination from "rc-pagination";
import DatePicker from "react-datepicker"
import * as eventService from "../../services/eventService"
import "react-datepicker/dist/react-datepicker.css";

class UserEventsPage extends React.Component{

    state = {
        formData: {},
        events: [],
        mappedEvents:[],
        current: 0,
        totalPages: 0,
        startDate: 0,
        endDate: 0
    }

    componentDidMount(){
        console.log("componentDidMount() -> UserEventsPage");
        eventService.getFeed(0,4).then(this.onGetSuccess).catch(this.onGetError)
    }

    mapEvents = (event) => {
        return(
            <React.Fragment key={event.id}>
                <RenderEvent
                    event={event}
                    edit={this.editThisEvent}
                    view={this.viewEvent}
                />
            </React.Fragment>
        )
    }

    editThisEvent = (event) => {
        console.log(event);
    }

    viewEvent = (event) => {
        console.log(event);
    }

    onNextPage = (page) => {
        let nextPg = page-1
        eventService.getFeed(nextPg, 4)
            .then(this.onGetSuccess)
            .catch(this.onGetError)
        this.setState(prevState => {
            return{
                ...prevState,
                current:page
            }
        })
    }

    setStartDate = (date) => {
        this.setState(prevState=>{
            return{
                ...prevState,
                startDate:date
            }
        })
    }

    setEndDate = (date) => {
        this.setState(prevState=>{
            return{
                ...prevState,
                endDate:date
            }
        })
    }

    //############## Success & Error Handlers ##############//
    onGetSuccess = (response) => {
        console.log(response.data, "onGetSuccess");
        this.setState(prevState=>{
            return{
                ...prevState,
                events: response.data.item.pagedItems,
                mappedEvents: response.data.item.pagedItems.map(this.mapEvents),
                totalPages: response.data.item.totalPages*10
            }
        })
    }

    onGetError = (errResponse) => {
        console.log(errResponse.data, "onGetError");
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
                                Events
                            </button>
                            </li>
                            <li>
                            <button className="btn btn-outline-light px-2">
                                + Events
                            </button>
                            </li>
                            
                        </ul>

                        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                            <input
                            type="search"
                            className="form-control form-control-dark"
                            placeholder="Search..."
                            name="searchTerms"
                            />
                        </form>

                        <div className="text-end">
                            <button type="button" className="btn btn-outline-light">
                            Search
                            </button>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row my-3">
                        <div className="col-lg-8 col-md-6 col-sm-6 px-0 pe-3">
                            <div className="card border-0 shadow">
                                <h1>Event</h1>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="row mb-3">
                                <div className="card border-0 shadow">
                                    <div className="m-3">
                                        <h6 className="mb-3">Search events from:</h6>
                                        <div className="mb-3 d-flex justify-content-between text-center">
                                            <DatePicker
                                                className="w-75"
                                                selected={this.state.startDate}
                                                onChange={date=>this.setStartDate(date)}
                                                placeholderText="Start Date"
                                            />
                                            <DatePicker
                                                className="w-75"
                                                selected={this.state.endDate}
                                                onChange={date=>this.setEndDate(date)}
                                                placeholderText="End Date"
                                            />
                                        </div>
                                        <div className="text-center mb-3">
                                            <button className="btn btn-primary btn-sm">
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="card border-0 shadow">
                                    <div className="m-3 d-flex justify-content-between">
                                        <Pagination
                                            className="my-auto"
                                            onChange={this.onNextPage}
                                            current={this.state.current}
                                            total={this.state.totalPages}
                                        />
                                        <button     
                                            className="btn btn-secondary btn-sm"
                                        >
                                            New Event
                                        </button>
                                    </div>
                                    <div className="mx-3 mb-3 d-flex justify-content-end">
                                        <button className="btn btn-secondary btn-sm">
                                            View All On Map
                                        </button>
                                    </div>                                    
                                    <div className="m-3">
                                        <h5>Upcoming Events</h5>
                                    </div>
                                    {this.state.mappedEvents}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default UserEventsPage