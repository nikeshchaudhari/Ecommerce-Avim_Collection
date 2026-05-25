import { NavLink } from "react-router-dom";
import { TbLayoutDashboard } from "react-icons/tb";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FiShoppingBag } from "react-icons/fi";
import { IoIosTrendingUp } from "react-icons/io";
import { HiUsers } from "react-icons/hi";
import { MdOutlineDiscount } from "react-icons/md";
import { GrGallery } from "react-icons/gr";
import { CiSettings } from "react-icons/ci";

const AdminSideBar = () => {
  return (
    <>
      <main>
        <aside className="w-[15vw] h-screen dark:border-white/20  border-r border-black/10 bg-[#faf3eb] dark:bg-black">
          <div className="flex flex-col gap-3 px-5  ">
            <h2 className="mt-5 text-[#f7b828] font-inter text-[12px] tracking-[3px]">
              CONSOLE
            </h2>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-3 rounded font-inter font-[550]
     ${isActive ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600/50 dark:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                  <TbLayoutDashboard
                    size={20}
                    className={isActive ? "text-white" : "text-red-800"}
                  />
                  Dashboard
                </>
              )}
            </NavLink>
            <NavLink
              to="/dashboard/products"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-3 rounded font-inter font-[550]
     ${isActive ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600/50 dark:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                  <MdOutlineProductionQuantityLimits
                    className={isActive ? "text-white" : "text-red-800"}
                  />
                  Products
                </>
              )}
            </NavLink>
             <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-3 rounded font-inter font-[550]
     ${isActive ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-100  dark:hover:bg-gray-600/50 dark:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                 <FiShoppingBag className={isActive ? "text-white" : "text-red-800"} />

                  Orders
                </>
              )}
            </NavLink>
                    <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-3 rounded font-inter font-[550]
     ${isActive ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-100  dark:hover:bg-gray-600/50 dark:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                 <IoIosTrendingUp 
 className={isActive ? "text-white" : "text-red-800"} />

                  Sales
                </>
              )}
            </NavLink>
                    <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-3 rounded font-inter font-[550]
     ${isActive ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-100  dark:hover:bg-gray-600/50 dark:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                 <HiUsers  className={isActive ? "text-white" : "text-red-800"} />

                  Users
                </>
              )}
            </NavLink>
                    <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-3 rounded font-inter font-[550]
     ${isActive ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-100  dark:hover:bg-gray-600/50 dark:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                 <MdOutlineDiscount  className={isActive ? "text-white" : "text-red-800"} />

                  Discounts
                </>
              )}
            </NavLink>
                    <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-3 rounded font-inter font-[550]
     ${isActive ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-100  dark:hover:bg-gray-600/50 dark:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                 <GrGallery  className={isActive ? "text-white" : "text-red-800"} />

                  Gallery
                </>
              )}
            </NavLink>
                    <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-3 rounded font-inter font-[550]
     ${isActive ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-100  dark:hover:bg-gray-600/50 dark:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                 <CiSettings  className={isActive ? "text-white" : "text-red-800"} />

                  Settings
                </>
              )}
            </NavLink>
          </div>
        </aside>
      </main>
    </>
  );
};

export default AdminSideBar;
