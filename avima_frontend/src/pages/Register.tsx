import { useState } from "react";
import UserNavbar from "../components/UserNavbar";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Register = () => {
  const [passwordShow, setPasswordShow] = useState(false);
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
            <form className=" w-[80vw] md:w-auto">
              <div className="flex flex-col mb-5">
                <label htmlFor="fullName" className=" font-inter">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="border border-black/20 py-2 shadow-lg rounded min-w-full md:w-[22vw] outline-none px-2 focus:ring-1"
                />
              </div>
              <div className="flex flex-col mb-5 ">
                <label htmlFor="email" className=" font-inter">
                  Email <span className="text-red-500">*</span>{" "}
                </label>
                <input
                  type="email"
                  id="email"
                  className="border border-black/20 py-2 shadow-lg rounded w-full md:w-[22vw] outline-none px-2 focus:ring-1"
                />
              </div>
              <div className="flex flex-col mb-5 relative">
                <label htmlFor="password" className=" font-inter">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={passwordShow ? "text" : "password"}
                  id="password"
                  className="border border-black/20 py-2 shadow-lg rounded md:w-[22vw] outline-none px-2 focus:ring-1"
                />

                <button
                  type="button"
                  className="absolute top-9 right-2 cursor-pointer "
                  onClick={() => setPasswordShow(!passwordShow)}
                >
                  {passwordShow ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                </button>
              </div>
              <button
                type="button"
                className="w-full bg-red-800 text-[20px] text-white py-2 cursor-pointer"
              >
                Create account
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Register;
