import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Grid,
  Container,
  Input,
  InputLabel,
  InputAdornment,
  FormControlLabel,
  IconButton,
  Box,
  Typography,
  Checkbox,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Tooltip,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";

import MailOutlineTwoToneIcon from "@material-ui/icons/MailOutlineTwoTone";
import LockTwoToneIcon from "@material-ui/icons/LockTwoTone";

import hero9 from "../../assets/images/kitchmet/lady.png";

import { NavLink as RouterLink, useHistory } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import swal from "sweetalert";
import { Formik, Form } from "formik";
import { registrationSchema } from "./RegisterValidationSchema";
import { logInSchema } from "./LogInValidationSchema";
import * as userService from "../../services/userService";
import debug from "sabio-debug";
import * as kitchenService from "../../services/kitchenService";
const _logger = debug.extend("RegistrationForm");

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    height: "6px",
    "& > div": {
      maxWidth: 40,
      height: "4px",
      borderRadius: "25px",
      width: "100%",
      backgroundColor: "#000",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: theme.palette.primary[900],
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    "&:focus": {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const RegistrationForm = () => {
  const [formData] = React.useState({
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    mi: "",
    role: 0,
  });

  const [loginData] = React.useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const history = useHistory();

  const [styleTabValue, setValue] = React.useState(() => {
    if (history.location.pathname === "/register") return 0;
    if (history.location.pathname === "/login") return 1;
  });

  const handleTabView = (event, newValue) => {
    setValue(newValue);
  };

  const submitRegistration = (values) => {
    userService
      .register(values)
      .then(onRegisterUserSuccess)
      .catch(onRegisterUserError);
  };

  const login = (values) => {
    userService.login(values).then(onLoginSuccess).catch(onLoginError);
  };

  const onRegisterUserSuccess = (response) => {
    _logger(response.data, "onRegisterUserSuccess");
    swal({
      title: "Congratulations!",
      text: "Successfully completed registration!",
      icon: "success",
      timer: 2000,
      button: false,
    });
    // handleTabView(0, 1);
    history.push("/");
  };

  const onRegisterUserError = (errResponse) => {
    _logger({ error: errResponse }, "onRegisterUserError");
    swal({
      title: "Registration failed",
      text: "Make sure all fields are filled correctly!",
      icon: "error",
      timer: 2000,
      button: false,
    });
  };

  const onLoginSuccess = (response) => {
    _logger(response.data, "onLoginSuccess");
    userService.getCurrent().then(onGetCurrentSuccess).catch(onGetCurrentError);
  };

  const onLoginError = (errResponse) => {
    _logger({ error: errResponse }, "onLoginError");
    swal({
      title: "Login Failed",
      text: `${errResponse.response.data.errors}`,
      icon: "error",
      timer: 2000,
      button: "Ok",
    });
  };

  const onGetCurrentSuccess = (response) => {
    _logger(response, "onGetCurrentSuccess");
    let user = {
      type: "LOGIN",
      payload: {
        roles: response.item.roles,
        userName: `${response.item.firstName} ${response.item.lastName}`,
        email: response.item.email,
        avatar: "",
        id: response.item.id,
      },
    };
    swal({
      title: "Welcome!",
      text: `Welcome back ${user.payload.userName}!`,
      icon: "success",
      timer: 2500,
      button: false,
    });
    if (response.item.roles[0] === "Owner") {
      kitchenService
        .getByCreator()
        .then(function () {
          history.push("/kitchen/dashboard", user);
        })
        .catch(function () {
          history.push("/kitchen/add", user);
        });
    } else {
      history.push("/LandingPage", user);
    }
  };

  const onGetCurrentError = (errResponse) => {
    _logger(errResponse, "onGetCurrentError");
  };

  return (
    <Fragment>
      <div className="app-wrapper min-vh-100 bg-white">
        <div className="app-main min-vh-100">
          <div className="app-content p-0">
            <div className="app-inner-content-layout--main">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--content">
                  <Grid container spacing={0} className="min-vh-100">
                    <Grid
                      item
                      xs={12}
                      md={4}
                      lg={5}
                      className="d-flex align-items-center"
                    >
                      <div className="hero-wrapper w-100 bg-composed-wrapper min-vh-100">
                        <div className="flex-grow-1 w-100 d-flex align-items-center">
                          <div
                            className="bg-composed-wrapper--image bg-composed-filter-rm opacity-9 h-100"
                            style={{ backgroundImage: "url(" + hero9 + ")" }}
                          />

                          <div className="bg-composed-wrapper--content p-5 my-5 pt-5 text-center">
                            <div className="text-white mt-5 my-5 pt-5">
                              <h1
                                className="display-4 my-5 pt-5 font-weight-bold "
                                style={{ textShadow: "0px 10px 10px #737373" }}
                              >
                                List your kitchen | Find a rental
                              </h1>

                              <div className="my-4">
                                <Button
                                  size="large"
                                  className="text-white bg-plum-plate"
                                  variant="contained"
                                  color="primary"
                                  component={RouterLink}
                                  to="/LandingPage"
                                >
                                  <span className="btn-wrapper--icon">
                                    <FontAwesomeIcon
                                      icon={["fas", "arrow-left"]}
                                    />
                                  </span>
                                  <span className="btn-wrapper--label ">
                                    Back to dashboard
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="hero-footer pb-4">
                          <Tooltip arrow title="Facebook">
                            <IconButton
                              color="inherit"
                              size="medium"
                              variant="outlined"
                              className="text-white-50"
                              href="https://www.facebook.com/kitchmet"
                            >
                              <FontAwesomeIcon
                                icon={["fab", "facebook"]}
                                className="font-size-md"
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip arrow title="Instagram">
                            <IconButton
                              color="inherit"
                              size="medium"
                              variant="outlined"
                              className="text-white-50"
                              href="https://www.instagram.com/kitchmet/"
                            >
                              <FontAwesomeIcon
                                icon={["fab", "instagram"]}
                                className="font-size-md"
                              />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={8}
                      lg={7}
                      className="d-flex align-items-center"
                    >
                      <Container maxWidth="sm">
                        <div className="pt-5 pb-4">
                          <StyledTabs
                            value={styleTabValue}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleTabView}
                          >
                            <StyledTab label="Create an account" />
                            <StyledTab label="Sign in" />
                          </StyledTabs>
                        </div>
                        <Formik
                          enableReinitialize={true}
                          initialValues={formData}
                          onSubmit={submitRegistration}
                          validationSchema={registrationSchema}
                        >
                          {({ values, handleChange, errors, touched }) => (
                            <Form>
                              <TabPanel value={styleTabValue} index={0}>
                                <h3 className="display-4 mb-2 font-weight-bold">
                                  Create account
                                </h3>
                                <p className="font-size-lg mb-5 text-black-50">
                                  Fill in the fields below.
                                </p>
                                <div className="mb-3">
                                  <TextField
                                    value={values.firstName}
                                    onChange={handleChange}
                                    name="firstName"
                                    error={
                                      touched.firstName &&
                                      Boolean(errors.firstName)
                                    }
                                    helperText={
                                      touched.firstName && errors.firstName
                                    }
                                    variant="outlined"
                                    label="First name"
                                    className="w-75"
                                    placeholder="Enter your First Name"
                                    type="text"
                                  />
                                  <TextField
                                    value={values.mi}
                                    onChange={handleChange}
                                    name="mi"
                                    error={touched.mi && Boolean(errors.mi)}
                                    helperText={touched.mi && errors.mi}
                                    variant="outlined"
                                    label="Middile Initial"
                                    className="w-25"
                                    placeholder="Enter your M.I."
                                    type="text"
                                  />
                                </div>
                                <div className="mb-3">
                                  <TextField
                                    value={values.lastName}
                                    onChange={handleChange}
                                    name="lastName"
                                    error={
                                      touched.lastName &&
                                      Boolean(errors.lastName)
                                    }
                                    helperText={
                                      touched.lastName && errors.lastName
                                    }
                                    variant="outlined"
                                    label="Last name"
                                    className="w-75"
                                    placeholder="Enter your Last Name"
                                    type="text"
                                  />
                                  <FormControl
                                    variant="outlined"
                                    className="w-25"
                                  >
                                    <InputLabel>Account Type</InputLabel>
                                    <Select
                                      value={values.role}
                                      onChange={handleChange}
                                      name="role"
                                      label="Role"
                                      error={
                                        touched.role && Boolean(errors.role)
                                      }
                                    >
                                      <MenuItem value={0}>Select Type</MenuItem>
                                      <MenuItem value={2}>
                                        Kitchen Owner
                                      </MenuItem>
                                      <MenuItem value={3}>Chef</MenuItem>
                                    </Select>
                                    {touched.role && Boolean(errors.role) && (
                                      <FormHelperText
                                        style={{ color: "#f83245" }}
                                      >
                                        {touched.role && errors.role}
                                      </FormHelperText>
                                    )}
                                  </FormControl>
                                </div>
                                <div className="mb-3">
                                  <TextField
                                    value={values.email}
                                    onChange={handleChange}
                                    name="email"
                                    error={
                                      touched.email && Boolean(errors.email)
                                    }
                                    helperText={touched.email && errors.email}
                                    variant="outlined"
                                    label="Email address"
                                    fullWidth
                                    placeholder="Enter your email address"
                                    type="email"
                                  />
                                </div>
                                <div className="mb-3">
                                  <TextField
                                    value={values.password}
                                    onChange={handleChange}
                                    name="password"
                                    error={
                                      touched.password &&
                                      Boolean(errors.password)
                                    }
                                    helperText={
                                      touched.password && errors.password
                                    }
                                    variant="outlined"
                                    label="Password"
                                    fullWidth
                                    placeholder="Enter your password"
                                    type="password"
                                  />
                                </div>
                                <div className="mb-3">
                                  <TextField
                                    value={values.passwordConfirm}
                                    onChange={handleChange}
                                    name="passwordConfirm"
                                    error={
                                      touched.passwordConfirm &&
                                      Boolean(errors.passwordConfirm)
                                    }
                                    helperText={
                                      touched.passwordConfirm &&
                                      errors.passwordConfirm
                                    }
                                    variant="outlined"
                                    label="Confirm Password"
                                    fullWidth
                                    placeholder="Confirm your password"
                                    type="password"
                                  />
                                </div>
                                <div className="form-group pt-2 mb-4">
                                  By clicking the{" "}
                                  <strong>Create account</strong> button below
                                  you agree to our terms of service and privacy
                                  statement.
                                </div>
                                <Button
                                  type="submit"
                                  color="primary"
                                  size="large"
                                  variant="contained"
                                  className="mb-5"
                                >
                                  Create Account
                                </Button>
                              </TabPanel>
                            </Form>
                          )}
                        </Formik>
                        <TabPanel value={styleTabValue} index={1}>
                          <h3 className="display-4 mb-2 font-weight-bold">
                            Existing account
                          </h3>
                          <p className="font-size-lg mb-5 text-black-50">
                            You already have an account? Fill in the fields
                            below to login into your existing dashboard.
                          </p>
                          <Card className="mx-0 bg-secondary mt-0 w-100 p-0 mb-4 border-0">
                            <div className="card-header d-block p-3 mx-2 mb-0 mt-2 rounded border-0  ">
                              <div className="text-muted text-center mb-3 ">
                                <span>Sign in with</span>
                              </div>
                              <div className="text-center">
                                <Button
                                  variant="outlined"
                                  className="mr-2 text-facebook"
                                >
                                  <span className="btn-wrapper--icon">
                                    <FontAwesomeIcon
                                      icon={["fab", "facebook"]}
                                    />
                                  </span>
                                  <span className="btn-wrapper--label">
                                    Facebook
                                  </span>
                                </Button>
                                <Button
                                  variant="outlined"
                                  className="ml-2 text-twitter"
                                >
                                  <span className="btn-wrapper--icon">
                                    <FontAwesomeIcon
                                      icon={["fab", "twitter"]}
                                    />
                                  </span>
                                  <span className="btn-wrapper--label">
                                    Twitter
                                  </span>
                                </Button>
                              </div>
                            </div>
                            <Formik
                              enableReinitialize={true}
                              initialValues={loginData}
                              onSubmit={login}
                              validationSchema={logInSchema}
                            >
                              {({ values, handleChange, errors, touched }) => (
                                <CardContent className="p-3">
                                  <div className="text-center text-black-50 mb-3">
                                    <span>Or sign in with credentials</span>
                                  </div>
                                  <Form className="px-5">
                                    <div className="mb-3">
                                      <FormControl className="w-100">
                                        <InputLabel htmlFor="input-with-icon-adornment">
                                          Email address
                                        </InputLabel>
                                        <Input
                                          value={values.email}
                                          onChange={handleChange}
                                          name="email"
                                          error={
                                            touched.email &&
                                            Boolean(errors.email)
                                          }
                                          fullWidth
                                          id="input-with-icon-adornment"
                                          startAdornment={
                                            <InputAdornment position="start">
                                              <MailOutlineTwoToneIcon />
                                            </InputAdornment>
                                          }
                                        />
                                        {touched.email &&
                                          Boolean(errors.email) && (
                                            <FormHelperText
                                              style={{ color: "#f83245" }}
                                            >
                                              {touched.email && errors.email}
                                            </FormHelperText>
                                          )}
                                      </FormControl>
                                    </div>
                                    <div className="mb-3">
                                      <FormControl className="w-100">
                                        <InputLabel htmlFor="standard-adornment-password">
                                          Password
                                        </InputLabel>
                                        <Input
                                          value={values.password}
                                          onChange={handleChange}
                                          name="password"
                                          error={
                                            touched.password &&
                                            Boolean(errors.password)
                                          }
                                          id="standard-adornment-password"
                                          fullWidth
                                          type="password"
                                          startAdornment={
                                            <InputAdornment position="start">
                                              <LockTwoToneIcon />
                                            </InputAdornment>
                                          }
                                        />
                                        {touched.password &&
                                          Boolean(errors.password) && (
                                            <FormHelperText
                                              style={{ color: "#f83245" }}
                                            >
                                              {(
                                                <touched className="pass"></touched>
                                              ) && errors.password}
                                            </FormHelperText>
                                          )}
                                      </FormControl>
                                    </div>
                                    <div className="w-100">
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={values.rememberMe}
                                            onChange={handleChange}
                                            name="rememberMe"
                                            color="primary"
                                          />
                                        }
                                        label="Remember me"
                                      />
                                    </div>
                                    <div className="text-center">
                                      <Button
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                        size="large"
                                        className="my-2 bg-plum-plate"
                                      >
                                        Sign in
                                      </Button>
                                    </div>
                                  </Form>
                                </CardContent>
                              )}
                            </Formik>
                          </Card>
                        </TabPanel>
                      </Container>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default RegistrationForm;
