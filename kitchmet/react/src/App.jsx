import React, { Suspense, Component } from "react";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import debug from "sabio-debug";
import applicationRoutes from "./routes";
import { RouterProps } from "./config/sitePropTypes";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "@material-ui/styles";
import SuspenseLoading from "./utils/SuspenseLoading";
import MuiTheme from "./theme";
import * as userService from "./services/userService";
import navItems from "./layout-components/navItems";

import {
  LeftSidebar,
  CollapsedSidebar,
  MinimalLayout,
  PresentationLayout,
} from "./layouts";

const _logger = debug.extend("App");

const DEFAULT_USER = {
  roles: [],
  userName: "",
  email: "",
  avatar: "",
  id: "",
};

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.99,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.01,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

class App extends Component {
  constructor(props) {
    super(props);
    let isAnonymous = true;

    const routes = this.getRoutes(
      applicationRoutes.byLayout,
      DEFAULT_USER,
      isAnonymous
    );

    this.state = {
      currentUser: DEFAULT_USER,
      routes,
      sidebar: navItems,
      isLogged: false,
      isAnon: isAnonymous,
      isChecked: false,
    };
  }

  componentDidMount() {
    if (!this.state.isLogged) {
      userService
        .getCurrent()
        .then(this.onGetCurrentSuccess)
        .catch(this.onGetCurrentError);
    }
  }

  componentDidUpdate() {
    if (
      this.props.location.state &&
      this.props.location.state.type === "LOGIN" &&
      !this.state.isLogged
    ) {
      let user = { ...this.props.location.state.payload };
      this.setUserRoutes(user, true, false);
    } else if (
      this.props.location.state &&
      this.props.location.state.type === "LOGOUT" &&
      this.state.isLogged
    ) {
      let loggedOutUser = { ...this.props.location.state.payload };
      this.setUserRoutes(loggedOutUser, false, true);
    }
  }

  onGetCurrentSuccess = (response) => {
    _logger(response, "onGetCurrentSuccess");
    let user = {
      roles: response.item.roles,
      email: response.item.email,
      userName: `${response.item.firstName} ${response.item.lastName}`,
      avatar: "",
      id: response.item.id,
    };
    const sidebar = this.getSidebar(user);
    this.setUserRoutes(user, true, false, sidebar);
  };

  onGetCurrentError = (errResponse) => {
    _logger(errResponse, "onGetCurrentError");
    this.setState((prevState) => {
      return {
        ...prevState,
        isChecked: true,
      };
    });
  };

  setUserRoutes = (user, loggedIn, anon) => {
    this.setState((prevState) => {
      let currentUser = { ...prevState.currentUser };
      let isLogged = prevState.isLogged;
      let isAnon = prevState.isAnon;
      let routes = prevState.routes;
      let isChecked = prevState.isChecked;
      currentUser = user;
      isLogged = loggedIn;
      isAnon = anon;
      isChecked = true;
      routes = this.getRoutes(applicationRoutes.byLayout, currentUser, isAnon);
      return { currentUser, routes, isLogged, isAnon, isChecked };
    });
  };

  setUserRoutes = (user, loggedIn, anon, sidebar) => {
    this.setState((prevState) => {
      let currentUser = { ...prevState.currentUser };
      let isLogged = prevState.isLogged;
      let isAnon = prevState.isAnon;
      let routes = prevState.routes;
      let isChecked = prevState.isChecked;
      currentUser = user;
      isLogged = loggedIn;
      isAnon = anon;
      isChecked = true;
      routes = this.getRoutes(applicationRoutes.byLayout, currentUser, isAnon);
      return { currentUser, routes, isLogged, isAnon, isChecked, sidebar };
    });
  };

  getRoutes = (routesByType, currentUser, isAnonymous) => {
    const route = {};
    for (const [key, routeEntries] of Object.entries(routesByType)) {
      if (isAnonymous) {
        let filteredEntries = routeEntries.filter((ent) => ent.isAnonymous);
        route[key] = filteredEntries.map(this.getRouteMapper(currentUser));
        let paths = filteredEntries.reduce(this.collectPaths, []);
        route[key].paths = paths;
      } else {
        if (currentUser.roles.length > 0) {
          let filteredEntries = routeEntries.filter(
            (ent) => ent.roles.includes(currentUser.roles[0]) || ent.isAnonymous
          );
          route[key] = filteredEntries.map(this.getRouteMapper(currentUser));
          let paths = filteredEntries.reduce(this.collectPaths, []);
          route[key].paths = paths;
        }
      }
    }
    return route;
  };

  collectPaths = (accumulator, currentValue) => {
    accumulator.push(...currentValue.path);
    return accumulator;
  };

  filterAnonymous = (route) => {
    return route.isAnonymous;
  };

  getRouteMapper = (currentUser) => {
    return (routeData) => {
      let Component = routeData.component;
      return (
        <Route
          key={routeData.path}
          // key={uuidv4()}
          path={routeData.path}
          exact={routeData.exact}
          render={(props) => <Component {...props} currentUser={currentUser} />}
        />
      );
    };
  };

  getSidebar = (currentUser) => {
    const filteredMenu = [...navItems];
    let content = filteredMenu[0].content;

    if (currentUser.roles.length > 0) {
      content = content.filter((item) =>
        item.roles.some((role) => role === currentUser.roles[0])
      );
    }

    filteredMenu[0].content = content;

    return filteredMenu;
  };

  render() {
    return (
      <ThemeProvider theme={MuiTheme}>
        <AnimatePresence>
          <Suspense fallback={<SuspenseLoading />}>
            <Switch>
              <Redirect exact from="/" to="/LandingPage" />
              <Route path={this.state.routes.presentation.paths} exact>
                <PresentationLayout>
                  <Switch
                    location={this.props.location}
                    key={this.props.location.pathname}
                  >
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      {this.state.routes.presentation}
                    </motion.div>
                  </Switch>
                </PresentationLayout>
              </Route>

              <Route path={this.state.routes.nosidebar.paths} exact>
                <CollapsedSidebar {...this.state}>
                  <Switch
                    location={this.props.location}
                    key={this.props.location.pathname}
                  >
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      {this.state.routes.nosidebar}
                    </motion.div>
                  </Switch>
                </CollapsedSidebar>
              </Route>

              <Route path={this.state.routes.sidebar.paths} exact>
                <LeftSidebar {...this.state}>
                  <Switch
                    location={this.props.location}
                    key={this.props.location.pathname}
                  >
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      {this.state.routes.sidebar}
                    </motion.div>
                  </Switch>
                </LeftSidebar>
              </Route>

              <Route path={this.state.routes.minimal.paths} exact>
                <MinimalLayout>
                  <Switch
                    location={this.props.location}
                    key={this.props.location.pathname}
                  >
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      {this.state.routes.minimal}
                    </motion.div>
                  </Switch>
                </MinimalLayout>
              </Route>

              {this.state.isChecked && <Redirect exact to="/errors/404" />}
            </Switch>
          </Suspense>
        </AnimatePresence>
      </ThemeProvider>
    );
  }
}

App.propTypes = {
  ...RouterProps,
};

export default withRouter(App);
