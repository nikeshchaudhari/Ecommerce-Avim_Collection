import * as Yup from "yup";

export const ProfileValid = Yup.object({
  fullName: Yup.string()
    .min(2)
    .max(30)
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
    .required("FullName required"),
  phone: Yup.number().required("Phone number required"),
  city: Yup.string()
    .min(2)
    .max(30)
    .matches(/^[A-Za-z0-9\s]+$/,  "Only letters and numbers are allowed")
    .required("Address required"),
  address: Yup.string()
    .min(2)
    .max(30)
    .matches(/^[A-Za-z0-9\s]+$/,  "Only letters and numbers are allowed")
    .required("Address required"),
});
