import {  NavLink } from "react-router-dom";
import logo from "../assets/avima-logo.png";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosHeartEmpty } from "react-icons/io";
import { LuUser } from "react-icons/lu";
const UserNavbar = () => {
  return (
    <main className="flex justify-center border-b border-black/5 bg-[#faf5ec] backdrop-blur ">
      <nav className=" md:px-2 py-5 w-[80vw]">
        <div className="flex items-center justify-between md:justify-around">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="rounded-full w-10 md:w-12 transform transition hover:scale-105 duration-500 cursor-pointer" />
            <div className="flex flex-col gap-0">
              <span className="md:text-[25px] font-cormorant text-red-700">AVIMA</span>
              <span className="hidden md:block text-[10px] font-inter">HERITAGE · NEPAL</span>
            </div>
          </div>
          <div className="hidden  md:flex justify-center gap-6 ">
              <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "text-red-900 font-inter  font-medium" : "text-gray-600/80 font-inter"
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/shop"
        className={({ isActive }) =>
          isActive ? "text-red-900 font-inter  font-medium" : "text-gray-600/80 font-inter"
        }
      >
        Shop
      </NavLink>

      <NavLink
        to="/lookbook"
        className={({ isActive }) =>
          isActive ? "text-red-900 font-inter  font-medium" : "text-gray-600/80 font-inter"
        }
      >
        Lookbook
      </NavLink>

      <NavLink
        to="/heritage"
        className={({ isActive }) =>
          isActive ? "text-red-900 font-inter  font-medium" : "text-gray-600/80 font-inter"
        }
      >
        Heritage
      </NavLink>

      <NavLink
        to="/contact"
        className={({ isActive }) =>
          isActive ? "text-red-900 font-inter  font-medium" : "text-gray-600/80 font-inter"
        }
      >
        Contact
      </NavLink>

          </div>
          <div className="flex justify-between gap-3">
            <IoSearchOutline className=" hidden md:block text-[25px]" />
            <IoIosHeartEmpty size={25} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <LuUser size={25} />
          </div>
        </div>
      </nav>
    </main>
  );
};

export default UserNavbar;
