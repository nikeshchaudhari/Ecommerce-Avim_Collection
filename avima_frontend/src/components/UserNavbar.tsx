import { Link, NavLink } from "react-router-dom";
import logo from "../assets/avima-logo.png";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosHeartEmpty } from "react-icons/io";
import { LuUser } from "react-icons/lu";
import { useEffect, useState } from "react";
import { CiDark, CiLight } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { openCart, toogleCart } from "../features/CartUi";
import type { AppDispatch, RootState } from "../store/store";
import { BsHandbag } from "react-icons/bs";
const UserNavbar = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const dispatch: AppDispatch = useDispatch();
  const cartCount = useSelector((state: RootState) => state.cart.items.length);
  return (
    <main className="flex justify-center border-b border-black/5 dark:border-gray-600 bg-[#faf5ec] dark:bg-black backdrop-blur ">
      <nav className=" md:px-2 py-5 w-[80vw]">
        <div className="flex items-center justify-between md:justify-around">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt=""
              className="rounded-full w-10 md:w-12 transform transition hover:scale-105 duration-500 cursor-pointer"
            />
            <div className="flex flex-col gap-0">
              <span className="md:text-[25px] font-cormorant text-red-700">
                AVIMA
              </span>
              <span className="hidden md:block text-[10px] font-inter">
                HERITAGE · NEPAL
              </span>
            </div>
          </div>
          <div className="hidden  md:flex justify-center gap-6 ">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-red-900 font-inter  font-medium"
                  : "text-gray-600/80 font-inter"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive
                  ? "text-red-900 font-inter  font-medium"
                  : "text-gray-600/80 font-inter"
              }
            >
              Shop
            </NavLink>

            <NavLink
              to="/lookbook"
              className={({ isActive }) =>
                isActive
                  ? "text-red-900 font-inter  font-medium"
                  : "text-gray-600/80 font-inter"
              }
            >
              Lookbook
            </NavLink>

            <NavLink
              to="/heritage"
              className={({ isActive }) =>
                isActive
                  ? "text-red-900 font-inter  font-medium"
                  : "text-gray-600/80 font-inter"
              }
            >
              Heritage
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-red-900 font-inter  font-medium"
                  : "text-gray-600/80 font-inter"
              }
            >
              Contact
            </NavLink>
          </div>
          <div className="flex justify-between items-center gap-3">
            <button onClick={() => setDark(!dark)} className="cursor-pointer">
              {dark ? <CiLight size={30} /> : <CiDark size={30} />}
            </button>
            <IoSearchOutline className=" hidden md:block text-[25px]" />
            <IoIosHeartEmpty size={25} />
            <div className="relative cursor-pointer">
              <Link to="/shop/cart">
                <BsHandbag size={25} />
              </Link>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-700 text-white text-xs rounded-full px-2 py-1">
                  {cartCount}
                </span>
              )}
            </div>

            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "text-red-800" : "")}
            >
              <LuUser size={25} className="hover:text-red-800" />
            </NavLink>
          </div>
        </div>
      </nav>
    </main>
  );
};

export default UserNavbar;
