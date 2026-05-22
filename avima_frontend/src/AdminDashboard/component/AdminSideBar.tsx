import { NavLink } from "react-router-dom";
import { TbLayoutDashboard } from "react-icons/tb";

const AdminSideBar = () => {
  return (
    <>
      <main>
        <aside className="w-[15vw] h-screen dark:border-white/20  border-r border-black/20">
          <div className="flex flex-col gap-4 px-5  ">
            <h2 className="mt-5 text-[#f7b828] font-inter text-[12px] tracking-[3px]">
              CONSOLE
            </h2>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-3 rounded font-inter font-[550]
     ${isActive ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              {({ isActive }) => (
                <>
                  <TbLayoutDashboard size={20}
                    className={isActive ? "text-white" : "text-red-800"}
                  />
                  Dashboard
                </>
              )}
            </NavLink>
             <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-3 rounded font-inter font-[550]
     ${isActive ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              {({ isActive }) => (
                <>
                  <TbLayoutDashboard
                    className={isActive ? "text-white" : "text-red-800"}
                  />
                  Products
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
