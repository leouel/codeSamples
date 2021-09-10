import React from "react"
import * as userService from "../../services/userService"
import { NavLink } from "react-router-dom"
import { Formik, Form } from "formik";
import { 
    TextField,
    Button,
    Box,
    FormControlLabel,
    Checkbox
} from "@material-ui/core"
import * as Yup from "yup"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import debug from "sabio-debug"

const registrationSchema = Yup.object().shape({
    firstName: Yup.string().min(2).max(20).required("Firstname is required"),
    lastName: Yup.string().min(2).max(20).required("Lastname is required"),
    email: Yup.string().email("Invalid Email").required("Email required"),
    password: Yup.string().required("Password is required").matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must contain 8 characters, One Uppercase, One Lowercase, One Number and One Special Character"),
    passwordConfirm: Yup.string().oneOf([Yup.ref("password"), null], "Password does not match"),
    avatarUrl: Yup.string().required("Avatar Url is required")
})

const _logger = debug.extend("RegistrationPage")

class RegistrationPage extends React.Component{

    state = {
        newUser: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirm: "",
            avatarUrl: "",
            tenantId: "bootcamp1",
            agreeTerms: false
        }
    }

    componentDidMount(){
        _logger("componentDidMount() -> RegistrationPage");
    }

    submitRegistration = (values) => {
        let userRegistrationInfo = values;
        if(userRegistrationInfo.agreeTerms){
            console.log(userRegistrationInfo);
            userService.register(userRegistrationInfo)
                .then(this.onRegisterSuccess)
                .catch(this.onRegisterError)
        } else {
            toast.warning("Please Agree to Terms!")
        }
    }

    // onChange={Handler}
    onFormFieldChange = (e) => {
        let currentTarget = e.currentTarget;
        let inputName = currentTarget.name
        let newValue = currentTarget.type === "checkbox" 
            ? currentTarget.checked 
            : currentTarget.value
        

        this.setState(() => {
            let newUser = {...this.state.newUser};
            newUser[inputName] = newValue
            return {newUser}
        })
    }

    onRegisterSuccess = (response) => {
        console.log(response.data, "onRegisterSuccess");
        let userId = response.data.item;
        console.log("User ID:", userId);
        toast.success("You have registered successfully!")
        this.props.history.push("/");
    }

    onRegisterError = (errResponse) => {
        console.log({error: errResponse});
        let errMessage = errResponse.response.data.errors[0];
        toast.error(errMessage);
    }

    render(){
        return(
            <div className="col-lg-8 col-md-6 col-sm-6 m-4 mx-auto">
                <div className="card border-0 shadow">
                    <div className="card-body">
                        <h3 className="card-title text-center mt-2 mb-0">
                            Register a new membership
                        </h3>
                    </div>
                    <div className="card-body py-0">
                        <div className="card-text text-black-50">
                            <Formik
                                enableReinitialize={true}
                                initialValues={this.state.newUser}
                                onSubmit={this.submitRegistration}
                                validationSchema={registrationSchema}
                            >    
                            {({ values, handleChange, touched, errors }) => (
                                <Form>
                                    <div>
                                        <Box mx={2} my={1}>
                                            <TextField
                                                type="text"
                                                label="First Name"
                                                name="firstName"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                fullWidth
                                                error={touched.firstName && Boolean(errors.firstName)}
                                                helperText={touched.firstName && errors.firstName}
                                            />
                                        </Box>
                                        <Box mx={2} my={1}>
                                            <TextField
                                                type="text"
                                                label="Last Name"
                                                name="lastName"
                                                value={values.lastName}
                                                onChange={handleChange}
                                                fullWidth
                                                error={touched.lastName && Boolean(errors.lastName)}
                                                helperText={touched.lastName && errors.lastName}
                                            />
                                        </Box>
                                        <Box mx={2} my={1}>
                                            <TextField
                                                type="email"
                                                label="Email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                fullWidth
                                                error={touched.email && Boolean(errors.email)}
                                                helperText={touched.email && errors.email}
                                            />
                                        </Box>
                                        <Box mx={2} my={1}>
                                            <TextField
                                                type="password"
                                                label="Password"
                                                name="password"
                                                value={values.password}
                                                onChange={handleChange}
                                                fullWidth
                                                errors={touched.password && Boolean(errors.password)}
                                                helperText={touched.password && errors.password}
                                            />
                                        </Box>
                                        <Box mx={2} my={1}>
                                            <TextField
                                                type="password"
                                                label="Confirm Password"
                                                name="passwordConfirm"
                                                value={values.passwordConfirm}
                                                onChange={handleChange}
                                                fullWidth
                                                errors={touched.passwordConfirm && Boolean(errors.passwordConfirm)}
                                                helperText={touched.passwordConfirm && errors.passwordConfirm}
                                            />
                                        </Box>
                                        <Box mx={2} my={1}>
                                            <TextField
                                                type="text"
                                                label="Avatar Url"
                                                name="avatarUrl"
                                                value={values.avatarUrl}
                                                onChange={handleChange}
                                                fullWidth
                                                errors={touched.avatarUrl && Boolean(errors.avatarUrl)}
                                                helperText={touched.avatarUrl && errors.avatarUrl}
                                            />
                                        </Box>
                                        <Box mx={2} my={1}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox 
                                                        checked={values.agreeTerms}
                                                        onChange={handleChange}
                                                        name="agreeTerms"
                                                        color="primary"
                                                    />
                                                }
                                                label="I Agree to the Terms & Conditions"
                                            />
                                        </Box>
                                        <Box mx={2} my={1}>
                                            <NavLink to="/login">
                                                <strong>
                                                    Already have an Account?
                                                </strong>
                                            </NavLink>
                                        </Box>
                                        <Box mt={2} mb={5} className="text-center">
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                            >
                                                Register
                                            </Button>
                                        </Box>
                                    </div>
                                </Form>
                            )}
                            
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};

export default RegistrationPage