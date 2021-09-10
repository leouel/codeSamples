import * as Yup from "yup";

const registrationSchema = Yup.object().shape({
    firstName: Yup.string().min(2).max(100).required("Firstname is required"),
    lastName: Yup.string().min(2).max(100).required("Lastname is required"),
    email: Yup.string().min(2).max(255).email("Invalid Email").required("Email required"),
    password: Yup.string().max(100).required("Password is required").matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{8,}$/, "Must contain 8 characters, One Uppercase, One Lowercase, One Number and One Special Character"),
    passwordConfirm: Yup.string().max(100).oneOf([Yup.ref("password"), null], "Password does not match"),
    role: Yup.number().min(2, "Must select a role.").required("Required.")
  });

  export { registrationSchema};