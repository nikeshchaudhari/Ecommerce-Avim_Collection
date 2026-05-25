import Navbar from "../component/Navbar";
import AdminSideBar from "../component/AdminSideBar";
import { IoSearchOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

const AdminProducts = () => {

     const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);
  return (
    <>
      <nav className="">
        <Navbar />
      </nav>

      <main>
        <div className="bg-[#f9efe7] dark:bg-black min-h-full lg:flex">
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
                    onClick={()=>setOpen(!open)}
                    className="bg-yellow-500 px-6  py-1.5 rounded hover:bg-yellow-400 transition duration-300 font-inter"
                  >
                    + New product
                  </button>
                
              </div>
            </div>
              {/* added catalog  */}
{open && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

    <div className="bg-white w-1/2 p-5 rounded shadow-lg relative">

      {/* close button */}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-2 right-2 text-black"
      >
        ✖
      </button>

      <h2 className="text-xl font-cormorant mb-4">New Product</h2>

      <input
        type="text"
        placeholder="Product name"
        className="border w-full p-2 mb-3"
      />

      <input
        type="number"
        placeholder="Price"
        className="border w-full p-2 mb-3"
      />

      {/* <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
        Save
      </button> */}

    </div>

  </div>
)}


          </section>
        </div>

      

      </main>
    </>
  );
};

export default AdminProducts;
