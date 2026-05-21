import * as Yup from "yup";

export const LoginValid = Yup.object({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string()
    .min(6, "Min 6 character")
    .matches(/[a-z]/, "Must contain lowercase letter")
    .matches(/[A-Z]/, "Must contain uppercase letter")
    .matches(/[0-9]/, "Must contain number")
    .matches(/[!@#$%&*?]/, "Must contain special character")
    .required("Password required"),
});
