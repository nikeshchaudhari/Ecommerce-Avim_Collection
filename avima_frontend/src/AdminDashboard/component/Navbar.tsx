import { useEffect, useState } from "react";
import logo from "../../assets/avima-logo.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { LiaExternalLinkAltSolid } from "react-icons/lia";

const Navbar = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);
  return (
    <main className="w-full dark:border-white/20 border-b border-black/10 bg-[#faf3eb] dark:bg-black text-black dark:text-white">
      <nav className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex  items-center  gap-5">
            <RxHamburgerMenu size={25} className="lg:hidden" />

            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="logo"
                className="rounded-full w-8 md:w-12 md:h-12"
              />
              <div>
                <h1 className=" text-[12px] md:text-xl font-medium font-cormorant text-black dark:text-white">
                  AVIMA
                </h1>
                <h3 className="font-inter text-[8px] md:text-[10px] tracking-[3px]">
                  ATELIER · ADMIN
                </h3>
              </div>
            </div>
          </div>

          {/* Right side (future menu/buttons) */}
          <div className="flex items-center gap-4">
            <button onClick={()=>setDark(!dark)} className="px-4 py-2 border">
              {dark ?"light":"dark"}
            </button>
            <div className="flex items-center gap-1 text-black/40 hover:text-black dark:hover:text-white dark:text-white cursor-pointer text-[12px] md:text-[16px]">
              <LiaExternalLinkAltSolid />
            <span className="whitespace-nowrap">
              {" "}
              
              View Site
            </span>
            </div>
            <div className=" flex  items-center gap-1 text-white bg-red-700 px-2 md:px-2 py-1">
              <LiaSignOutAltSolid size={20} />
              <button type="button" className="text-[12px] md:text-[16px] whitespace-nowrap">Sign out</button>
            </div>
          </div>
        </div>
      </nav>
    </main>
  );
};

export default Navbar;
