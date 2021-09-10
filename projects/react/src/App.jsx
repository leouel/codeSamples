import React, { Component } from "react";
import SiteNav from "./Components/SiteNav/SiteNav"
import Jumbo from "./Components/Jumbo/Jumbo"
import Content from "./Components/Content/Content"
import RegistrationPage from "./Components/Content/RegistrationPage"
import LogInPage from "./Components/Content/LogInPage";
import UserHomePage from "./Components/Content/UserHomePage";
import UserFriendsPage from "./Components/Content/UserFriendsPage";
import UserAddFriendPage from "./Components/Content/UserAddFriendPage";
import UserJobsPage from "./Components/Content/UserJobsPage";
import UserAddJobsPage from "./Components/Content/UserAddJobsPage";
import UserTechCompaniesPage from "./Components/Content/UserTechCompaniesPage";
import UserAddTechCompany from "./Components/Content/UserAddTechCompany"
import UserEventsPage from "./Components/Content/UserEventsPage";
import Footer from "./Components/Footer/Footer"
import "./App.css";
import {BrowserRouter, Route, withRouter} from "react-router-dom"
import Widget from "./Components/codechallenge/Widget"
import Cars from "./Components/codechallenge/Cars"
import debug from "sabio-debug"
import PropTypes from "prop-types"

const _logger = debug.extend("App")

class App extends Component {

  state = {
    currentUser: {},
    isLoggedIn: false
  }

componentDidMount(){
  _logger("componentDidMount() -> App");
}

onButtonClicked = (e) => {
  e.preventDefault();
  console.log("I was clicked!");
}

handleLogIn = (currentUser) => {
  this.setState((prevState) => {
    return{
      ...prevState,
      currentUser: currentUser,
      isLoggedIn: true
    }
  })
}

handleLogOut = () => {
  this.setState((prevState)=>{
    return{
      ...prevState,
      currentUser: {},
      isLoggedIn: false
    }
  })
}

  render() {
    return (
      <BrowserRouter>
        <Route 
            path="/" 
            exact={false} 
            render={(props) => (
              <SiteNav
                {...props}
                handleLogOut={this.handleLogOut}          
                currentUser={this.state}
              />
            )}
        />
        <main role="main">
            <div className="container">
                <Route 
                  path="/login" 
                  exact 
                  render={(props) => (
                    <LogInPage 
                      {...props}
                      handleLogIn={this.handleLogIn}
                      // handleLogIn="Hello"
                    />
                )}/>

                <Route 
                  path="/register" 
                  exact 
                  render={(props)=>(
                    <RegistrationPage 
                      {...props}
                    />)}
                />

                <Route path="/" exact component={Jumbo}/>
            </div>

            <div className="container">
                  <Route 
                    path="/" 
                    exact 
                    render={() => (
                      <Content buttonEvent={this.onButtonClicked}/>)}
                  />
                  <Route 
                    path="/home" 
                    exact
                    render={() => (
                      <UserHomePage
                        currentUser={this.state}
                      />
                  )}/>

                  <Route
                    path="/friends"
                    exact
                    render={(props) => (
                      <UserFriendsPage
                      {...props}
                      />
                  )}/>

                  {/* Add Friend Page */}
                  <Route
                    path="/friends/add"
                    exact
                    render={(props) => (
                      <UserAddFriendPage
                        {...props}
                      />
                    )}/>

                  <Route
                    path="/friends/edit/:friendId(\d+)"
                    exact={true}
                    render={(props) => (
                      <UserAddFriendPage
                        {...props}
                      />
                  )}/>

                  <Route
                    path="/jobs"
                    exact
                    render={(props)=>(
                      <UserJobsPage
                        {...props}
                      />
                  )}/>

                  <Route
                    path="/jobs/add"
                    exact
                    render={(props)=>(
                      <UserAddJobsPage
                        {...props}
                      />
                  )}/>

                  <Route
                    path="/jobs/edit/:jobId(\d+)"
                    exact
                    render={(props)=>(
                      <UserAddJobsPage
                        {...props}
                      />
                  )}/>

                  <Route
                    path="/techCo/add"
                    exact
                    render={(props)=>(
                      <UserAddTechCompany
                        {...props}
                      />
                    )}
                  />

                  <Route
                    path="/techCo"
                    exact
                    render={(props)=>(
                      <UserTechCompaniesPage
                        {...props}
                      />
                    )}
                  />

                  <Route
                    path="/techCo/edit/:techCoId(\d+)"
                    exact
                    render={(props)=>(
                      <UserAddTechCompany
                        {...props}
                      />
                    )}
                  />

                  <Route
                    path="/events"
                    exact
                    render={()=>(
                      <UserEventsPage/>
                    )}
                  />    

                  {/*####### CODINGCHALLENGE #######*/}
                  <Route
                    path="/widget"
                    exact
                    render={(props)=>(
                      <Widget
                        {...props}
                      />
                    )}
                  />

                  <Route
                    path="/cars"
                    exact
                    render={(props)=>(
                      <Cars
                        {...props}
                      />
                    )}
                  />
                  {/*####### CODINGCHALLENGE #######*/}

                  <hr />
            </div>
        </main>

        <footer className="container">
          <Footer/>
        </footer>
      </BrowserRouter>
    );
  }
}

SiteNav.propTypes = {
  handleLogOut: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired
  })
}

LogInPage.propTypes = {
  handleLogIn: PropTypes.func.isRequired
}

export default withRouter(App);





