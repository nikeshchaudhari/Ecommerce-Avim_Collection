import * as Yup from "yup";

export const RegisterValid = Yup.object({
  fullName: Yup.string()
    .min(2)
    .max(30)
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
    .required("FullName required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string()
    .min(6, "Min 6 character")
    .matches(/[a-z]/, "Must contain lowercase letter")
    .matches(/[A-Z]/, "Must contain uppercase letter")
    .matches(/[0-9]/, "Must contain number")
    .matches(/[!@#$%&*?]/, "Must contain special character")
    .required("Password required"),
  confirm_password: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "password must match"),
    phone:Yup.number().required("Phone number required"),
    address:Yup.string().min(2).max(30).matches(/^[A-Za-z\s]+$/,"Only letters are allowed")
    .required("Address required"),
});
