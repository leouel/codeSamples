import * as Yup from "yup";

const logInSchema = Yup.object().shape({
    email: Yup.string().min(2).max(255).email("Invalid Email").required("Email required"),
    password: Yup.string().max(100).required("Password is required").matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{8,}$/, "Must contain 8 characters, One Uppercase, One Lowercase, One Number and One Special Character")
  });

export { logInSchema };