import { useEffect, useState } from "react";
import logo from "../../assets/avima-logo.png";
import { RxHamburgerMenu } from "react-icons/rx";

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
    <main className="w-full border-b border-black/20">
      <nav className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex  items-center  gap-5">
            <RxHamburgerMenu size={25} />

            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="logo"
                className="rounded-full w-8 md:w-12 md:h-12"
              />
              <div>
                <h1 className=" text-[12px] md:text-xl font-medium font-cormorant">
                  AVIMA
                </h1>
                <h3 className="font-inter text-[8px] md:text-[10px] tracking-[3px]">
                  ATELIER · ADMIN
                </h3>
              </div>
            </div>
          </div>

          {/* Right side (future menu/buttons) */}
          <div className="flex items-center gap-4"></div>
        </div>
      </nav>
    </main>
  );
};

export default Navbar;
