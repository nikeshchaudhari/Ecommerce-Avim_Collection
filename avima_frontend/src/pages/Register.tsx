import { useState } from "react";
import UserNavbar from "../components/UserNavbar";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { RegisterValid } from "../Schemas/RegisterValid";

const Register = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmshow, Setconfirmshow] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    resetForm,
  } = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
      address: "",
    },
    validationSchema: RegisterValid,
    onSubmit: async (values) => {
      console.log(values);
      const userData = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        address: values.address,
        role: "user",
      };

      try {
        // const token = localStorage.getItem("token");

        const response = await axios.post(
          "http://localhost:3000/users/add-user",
          userData,
        );

        console.log("User Add", response.data);
        toast.success("User Add Sucessfully...");
        resetForm();
        navigate("/login");
      } catch (err: any) {
        console.log(err.response.data);

        toast.error(err.response?.data?.msg || "Something went wrong");
      }
    },
  });

  return (
    <>
      <main className="bg-[#faf5ec] w-full min-h-screen">
        <UserNavbar />
        <section className="  flex justify-center md:items-center mt-10  ">
          <div className="w-1/2 flex flex-col items-center ">
            <span className="font-inter text-[12px] text-yellow-500">
              AVIMA MEMBERS
            </span>
            <h1 className="font-cormorant text-[25px] md:text-4xl text-red-800 mb-5 md:mb-10">
              Create account
            </h1>
            <form
              onSubmit={handleSubmit}
              className=" w-[80vw] md:w-fix lg:w-auto"
            >
              <div className="flex flex-col mb-5">
                <label htmlFor="fullName" className=" font-inter">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={values.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border border-black/20 py-2 shadow-lg rounded min-w-full md:w-fix lg:w-[25vw] outline-none px-2 focus:ring-1"
                />
                {touched.fullName && errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName}*</p>
                )}
              </div>
              <div className="flex flex-col mb-5">
                <label htmlFor="phone" className=" font-inter">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="phone"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border border-black/20 py-2 shadow-lg rounded min-w-full md:w-fix lg:w-[25vw] outline-none px-2 focus:ring-1"
                />
                {touched.phone && errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}*</p>
                )}
              </div>
              <div className="flex flex-col mb-5">
                <label htmlFor="address" className=" font-inter">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border border-black/20 py-2 shadow-lg rounded min-w-full md:w-fix lg:w-[25vw] outline-none px-2 focus:ring-1"
                />
                {touched.address && errors.address && (
                  <p className="text-sm text-red-500">{errors.address}*</p>
                )}
              </div>

              <div className="flex flex-col mb-5 ">
                <label htmlFor="email" className=" font-inter">
                  Email <span className="text-red-500">*</span>{" "}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border border-black/20 py-2 shadow-lg rounded w-full md:w-fix lg:w-[25vw] outline-none px-2 focus:ring-1"
                />
                {touched.email && errors.email && (
                  <p className="text-sm text-red-500">{errors.email}*</p>
                )}
              </div>

              <div className="flex flex-col mb-5 relative">
                <label htmlFor="password" className=" font-inter">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={passwordShow ? "text" : "password"}
                  id="password"
                  className="border border-black/20 py-2 shadow-lg rounded md:w-fix lg:w-[25vw] outline-none px-2 pr-8 focus:ring-1"
                />
                <button
                  type="button"
                  className="absolute top-9 right-2 cursor-pointer "
                  onClick={() => setPasswordShow(!passwordShow)}
                >
                  {passwordShow ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                </button>
                {touched.password && errors.password && (
                  <p className="text-sm text-red-500">{errors.password}*</p>
                )}
              </div>
              <div className="flex flex-col mb-5 relative">
                <label htmlFor="confirm_password" className=" font-inter">
                  Confirm_Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={confirmshow ? "text" : "password"}
                  id="confirm_password"
                  name="confirm_password"
                  value={values.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border border-black/20 py-2 shadow-lg rounded md:w-fix lg:w-[25vw] outline-none px-2 pr-8 focus:ring-1"
                />
                <button
                  type="button"
                  className="absolute top-9 right-2 cursor-pointer "
                  onClick={() => Setconfirmshow(!confirmshow)}
                >
                  {confirmshow ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                </button>
                {touched.confirm_password && errors.confirm_password && (
                  <p className="text-sm text-red-500">
                    {errors.confirm_password}*
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-red-800 text-[20px] text-white py-2 cursor-pointer transition hover:bg-red-900 rounded"
              >
                Create account
              </button>
              <div className="flex justify-center mt-4 ">
                <h2 className="font-inter">
                  Already a member?{" "}
                  <Link to="/login" className="text-red-800 font-inter">
                    Login
                  </Link>{" "}
                </h2>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Register;
