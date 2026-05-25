import Navbar from "../component/Navbar";
import AdminSideBar from "../component/AdminSideBar";
import { IoSearchOutline } from "react-icons/io5";

const AdminProducts = () => {
  return (
    <>
      <nav className="">
        <Navbar />
      </nav>

      <main>
        <div className="bg-[#f9efe7] dark:bg-black min-h-screen lg:flex">
          <aside className="hidden lg:block">
            <AdminSideBar />
          </aside>
          <section className="flex-1 px-5 lg:px-10 pt-5">
            <div className="flex justify-between items-center">
              <div className="mb-5">
                <span className="text-[12px] tracking-[4px] text-yellow-500">
                  Catalog
                </span>

                <h2 className="text-[25px] md:text-[30px] font-cormorant">
                  Products
                </h2>

                <p className="font-inter text-black/60">61 item(s)</p>
              </div>
              
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products...."
                    className="border border-black/10 dark:border-white/40 mx-4 pl-10 pr-3  py-1.5 font-inter outline-none shadow "
                  />
                  <IoSearchOutline className="absolute top-3 left-8" />
                  <button
                    type="button"
                    className="bg-yellow-500 px-6  py-1.5 rounded hover:bg-yellow-400 transition duration-300 font-inter"
                  >
                    + New product
                  </button>
                
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminProducts;
