import { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import { useNavigate } from "react-router-dom";

const UserAccount = () => {
    const navigate = useNavigate();
  const [fullName, setFullName] = useState<string>("");
  useEffect(() => {
    const name:any = localStorage.getItem("fullName");
    setFullName(name);
  }, []);

//   const token = localStorage.getItem("token");


//   logout

 const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  return (
    <>
      <main className="bg-[#faf5ec] min-h-screen">
        <UserNavbar />
        <section className="w-full ">
          <div className="w-full flex justify-center mt-10">
            <div className=" w-1/2 lg:flex justify-between gap-5 items-center px-2 ">
              <div>
                <span className="text-[12px] text-[#f7b828] tracking-[3px]">
                  MY ACCOUNT
                </span>
                <h2 className=" text-3xl md:text-4xl font-cormorant">Hello, {fullName}</h2>
              </div>
              <div className="flex  gap-3  mt-5 lg:mt-0">
                <button
                  type="button"
                  className="border border-black/10 px-3 md:px-10 whitespace-nowrap font-inter shadow text-[12px] md:text-[16px] hover:bg-[#f1e2c4] cursor-pointer"
                >
                  My Purchases
                </button>
                <button
                  type="button"
                  className="font-inter hover:bg-[#f1e2c4] whitespace-nowrap text-[12px] md:text-[16px] px-5 py-2"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>

          {/* profile section */}
          <div className="w-full flex justify-center mt-10 ">
            <div className="w-full px-5 lg:px-0 lg:w-1/2 lg:flex justify-between gap-10">
              <div className="border border-black/20 w-full px-5 py-5 bg-white">
                <form>
                  <h1 className="text-[25px] font-cormorant mb-5">Profile</h1>
                  <div className="mb-3">
                    <label htmlFor="fullName">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      className="border border-black/20 py-2 shadow-lg rounded w-full md:w-fix lg:w-[25vw] outline-none px-2 focus:ring-1"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className=" font-inter">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="phone"
                      name="phone"
                      className="border border-black/20 py-2 shadow-lg rounded w-full md:w-fix lg:w-[25vw] outline-none px-2 focus:ring-1"
                    />
                    {/* {touched.phone && errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}*</p>
                )} */}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="city" className=" font-inter">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="border border-black/20 py-2 shadow-lg rounded w-full md:w-fix lg:w-[25vw] outline-none px-2 focus:ring-1"
                    />
                    {/* {touched.address && errors.address && (
                  <p className="text-sm text-red-500">{errors.address}*</p>
                )} */}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className=" font-inter">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="border border-black/20 py-2 shadow-lg rounded w-full md:w-fix lg:w-[25vw] outline-none px-2 focus:ring-1"
                    />
                    {/* {touched.address && errors.address && (
                  <p className="text-sm text-red-500">{errors.address}*</p>
                )} */}
                  </div>
                  <button type="submit" className="bg-red-900 text-white px-5 py-2 font-semibold">
                    Save changes
                  </button>
                </form>
              </div>
              <div className="border border-black/20 w-full px-5 py-5 bg-white mt-5 lg:mt-0 mb-5">
                <h2 className="text-[25px] font-cormorant">Order history</h2>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default UserAccount;
