import { useState } from "react";
import UserNavbar from "../components/UserNavbar";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LoginValid } from "../Schemas/LoginValid";
import axios from "axios";

import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCart } from "../features/cartSlice";

const Login = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const navigate = useNavigate();
  const {
    values,
    errors,
    resetForm,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginValid,
    onSubmit: async (values) => {
      // console.log(values);

      try {
        const res = await axios.post(
          "http://localhost:3000/users/login",
          values,
        );
        console.log("userdata", res.data);

        const data = res.data;

        if (data.token) {
          // const token = data.token;

          localStorage.setItem(
            "user",
            JSON.stringify({
              id: data.uId,
              fullName: data.fullName,
              phone:data.phone,
              address:data.address,
              role: data.role,
              token: data.token,
            }),
          );
        }

        toast.success("Login Sucessfully..");

        if (data.role === "admin") {
          navigate("/dashboard");
        } else if (data.role === "user") {
          navigate("/home");
        } else {
          navigate("/");
        }

        resetForm();
      } catch (err: any) {
        toast.error(err.res?.data?.msg || "Something went wrong");
      }
    },
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || "[]");
  const dispatch = useDispatch();

  dispatch(setCart(cart));
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
              Welcome back
            </h1>
            <form
              onSubmit={handleSubmit}
              className=" w-[80vw] md:w-fix lg:w-auto"
            >
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
                  type={passwordShow ? "text" : "password"}
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
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

              <button
                type="submit"
                className="w-full bg-red-800 text-[20px] text-white py-2 cursor-pointer transition hover:bg-red-900 rounded"
              >
                Login
              </button>
              <div className="flex justify-between mt-4 ">
                <h2 className="font-inter text-[12px] md:text-[16px]">
                  Forgot password?
                </h2>
                <h2 className="font-inter  text-[12px] md:text-[16px] ">
                  New to AVIMA?{" "}
                  <Link
                    to="/register"
                    className="text-red-800 font-inter  text-[12px] md:text-[16px]"
                  >
                    {" "}
                    Create account
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

export default Login;
