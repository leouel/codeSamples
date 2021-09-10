import React from "react"
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import * as userService from "../../services/userService"
import debug from "sabio-debug"

const _logger = debug.extend("LogInPage")

const logInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Email Required")
})

class LogInPage extends React.Component{

    state = {
        formData: {
          email: "",
          password: "",
          tenantId: "bootcamp1"
        }
    }

    componentDidMount(){
        _logger("componentDidMount() -> LogInPage");
    }

    signInSubmit = (values) => {
        let userLogInInfo = values;
        userService.logIn(userLogInInfo)
            .then(this.onUserLogInSuccess)
            .catch(this.onUserLogInError)
    }

    onUserLogInSuccess = (response) => {
        _logger(response.data, "userLogInSuccess");
        userService.getCurrent()
            .then(this.onGetCurrentSuccess)
            .catch(this.onGetCurrentError)
    }

    onGetCurrentSuccess = (response) => {
        _logger(response.data, "onGetCurrentSuccess");
        toast.success(`Welcome back ${response.data.item.name}!`)
        userService.getUserById(response.data.item.id)
            .then(this.onGetUserByIdSuccess)
            .catch(this.onGetUserByIdError)
    }

    onGetUserByIdSuccess = (response) => {
        _logger(response.data.item, "onGetUserByIdSuccess");
        this.props.handleLogIn(response.data.item);
        this.props.history.push("/home")
    }

    onUserLogInError = (errResponse) => {
        _logger({error: errResponse});
        toast.error(`Make sure Email and Password fields are correct!`)
    }

    onGetCurrentError = (errResponse) => {
        _logger({error:errResponse});
        this.setState({})
    }

    onGetUserByIdError = (errResponse) => {
        _logger({error:errResponse});
    }

    render(){
        return(
            <div className="container text-center my-5">
                <div className="card border-0 rounded shadow col-lg-4 col-md-8 col-sm-8 mb-4 mx-auto">
                    <Formik
                        enableReinitialize={true}
                        initialValues={this.state.formData}
                        onSubmit={this.signInSubmit}
                        validationSchema={logInSchema}
                    >
                        {({ values }) => (
                        <Form>
                            <div className="form-group mx-3 my-5">
                                <h1 className="h3 mb-5 fw-normal">Please sign in</h1>
                                <div className="form-floating mb-3">
                                    <Field 
                                        type="email" 
                                        name="email"
                                        className="form-control" 
                                        placeholder="Email Address"
                                    />
                                    <label 
                                        htmlFor="floatingInput"
                                    >
                                        Email address
                                    </label>
                                    <ErrorMessage 
                                        name="email" 
                                        component="div" 
                                        className="har-error" 
                                    />
                                </div>
                                <div className="form-floating mb-3">
                                    <Field 
                                        type="password" 
                                        name="password"
                                        className="form-control" placeholder="Password"/>
                                    <label 
                                        htmlFor="floatingPassword"
                                    >
                                        Password
                                    </label>
                                </div>
                                {/* <Box m={2}>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        label="Email Address"
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                    />
                                </Box>
                                <Box m={2}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        label="Password"
                                    />
                                </Box> */}
                                <div>
                                    <NavLink to="">I forgot my password</NavLink>
                                </div>
                                <div className="mb-3">
                                    <NavLink to="/register">Register a new membership</NavLink>
                                </div>
                                {/* <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Sign in
                                </Button> */}
                                <button
                                    type="submit"
                                    className="w-100 btn btn-lg btn-primary mb-3"
                                >
                                    Sign in
                                </button>
                            </div>
                        </Form>
                        )}
                    </Formik>
                </div>
            </div>
        );
    }
}

export default LogInPage