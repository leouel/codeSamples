import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import * as userService from "../../services/userService";
import debug from "sabio-debug";

const _logger = debug.extend("SiteNav");

class SiteNav extends React.Component {
  componentDidMount() {
    _logger("componentDidMount() -> SiteNav");
  }

  //####### BUTTONS #######//
  onLogInClick = (e) => {
    e.preventDefault();
    this.props.history.push("/login");
  };

  onRegisterClick = (e) => {
    e.preventDefault(e);
    this.props.history.push("/register");
  };

  onLogOutClick = (e) => {
    e.preventDefault();
    userService.logOut().then(this.onLogOutSuccess).catch(this.onLogOutError);
  };

  //####### SUCCESS HANDLERS #######//
  onLogOutSuccess = (response) => {
    _logger(response.data, "onLogOutSuccess");
    this.props.handleLogOut();
    toast.warning("Successfully logged out.");
    this.props.history.push("/");
  };

  //####### ERROR HANDLERS #######//
  onLogOutError = (errResponse) => {
    _logger({ error: errResponse });
  };

  //####### CONDITIONAL RENDERING #######//
  renderLoggedUserNav = (state) => {
    if (state) {
      return (
        <header className="p-3 bg-dark text-white">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <NavLink
                to="/"
                className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
              >
                <img
                  src="https://pw.sabio.la/images/Sabio.png"
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt="Sabio"
                />
              </NavLink>

              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li>
                  <NavLink
                    to="/home"
                    className="nav-link px-2 text-secondary link-button"
                  >
                    {" "}
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/friends"
                    className="nav-link px-2 text-white link-button"
                  >
                    {" "}
                    Friends
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/blogs"
                    className="nav-link px-2 text-white link-button"
                  >
                    {" "}
                    Blogs
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/techCo"
                    className="nav-link px-2 text-white link-button"
                  >
                    {" "}
                    Tech Co.
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/jobs"
                    className="nav-link px-2 text-white link-button"
                  >
                    {" "}
                    Jobs
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/events"
                    className="nav-link px-2 text-white link-button"
                  >
                    {" "}
                    Events
                  </NavLink>
                </li>
              </ul>

              {/* //####### CODINGCHALLENGE #######// */}
              <NavLink to="/cars" className="btn btn-outline-primary me-3">
                Cars
              </NavLink>

              <NavLink to="/widget" className="btn btn-outline-success me-3">
                Widget
              </NavLink>
              {/* //####### CODINGCHALLENGE #######// */}

              <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                <input
                  type="search"
                  className="form-control form-control-dark"
                  placeholder="Search..."
                  aria-label="Search"
                />
              </form>

              <div className="text-end">
                <button type="button" className="btn btn-outline-light me-2">
                  Search
                </button>
                <button
                  type="button"
                  className="btn btn-outline-warning me-2"
                  onClick={this.onLogOutClick}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      );
    } else {
      return (
        <header className="p-3 bg-dark text-white">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <NavLink
                to="/"
                className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
              >
                <img
                  src="https://pw.sabio.la/images/Sabio.png"
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt="Sabio"
                />
              </NavLink>

              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li>
                  <NavLink
                    to="#"
                    className="nav-link px-2 text-white link-button"
                  >
                    Features
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="#"
                    className="nav-link px-2 text-white link-button"
                  >
                    Pricing
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="#"
                    className="nav-link px-2 text-white link-button"
                  >
                    FAQs
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="#"
                    className="nav-link px-2 text-white link-button"
                  >
                    About
                  </NavLink>
                </li>
              </ul>

              {/* //####### CODINGCHALLENGE #######// */}
              <NavLink to="/cars" className="btn btn-outline-primary me-3">
                Cars
              </NavLink>

              <NavLink to="/widget" className="btn btn-outline-success me-3">
                Widget
              </NavLink>
              {/* //####### CODINGCHALLENGE #######// */}

              <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                <input
                  type="search"
                  className="form-control form-control-dark"
                  placeholder="Search..."
                  aria-label="Search"
                />
              </form>

              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-outline-light
                    me-2"
                  onClick={this.onLogInClick}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-warning me-2"
                  onClick={this.onRegisterClick}
                >
                  Sign-up
                </button>
              </div>
            </div>
          </div>
        </header>
      );
    }
  };

  render() {
    const isLoggedIn = this.props.currentUser.isLoggedIn;

    return (
      <React.Fragment>{this.renderLoggedUserNav(isLoggedIn)}</React.Fragment>
    );
  }
}

export default SiteNav;
