import Navbar from "../component/Navbar";
import AdminSideBar from "../component/AdminSideBar";
import { IoSearchOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { WiStars } from "react-icons/wi";
import { CgCross } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { SlCloudUpload } from "react-icons/sl";

const AdminProducts = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
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

  // file upload

  const fileRef = useRef<HTMLElement | null>(null);

  const handleClick = () => {
    fileRef.current?.click();
  };

  // loading

  const handleLoading = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files) return;
    if (files.length > 5) {
      alert("Maximum 5 photos Allowed");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log("Upload ready");
    }, 1500);
  };

  return (
    <>
      <nav className="">
        <Navbar />
      </nav>

      <main className="overflow-x-hidden">
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
                  onClick={() => setOpen(!open)}
                  className="bg-yellow-500 px-6  py-1.5 rounded hover:bg-yellow-400 transition duration-300 font-inter"
                >
                  + New product
                </button>
              </div>
            </div>
            {/* added catalog  */}
            {open && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white dark:bg-black dark:border w-full mx-2 p-3  lg:w-1/2 lg:p-5 rounded shadow-lg relative overflow-hidden">
                  {/* close button */}
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-2 right-2 text-black dark:text-white"
                  >
                    <RxCross2 size={25} />
                  </button>
                  <div className="flex items-center gap-2  text-yellow-500 ">
                    <WiStars />
                    <span className=" tracking-[4px] text-[12px] font-inter text-yellow-500">
                      CATALOG
                    </span>
                  </div>

                  <h2 className="text-[25px] font-cormorant mb-4 font-light">
                    New product
                  </h2>
                  <h2 className="font-inter">Product images</h2>
                  {/* image */}
                  <div
                    className="relative w-full h-48 border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={handleClick}
                  >
                    <div className="bg-red-200  p-2 rounded-full">
                      <SlCloudUpload size={35} className="text-red-500 " />
                    </div>
                    <p> Drag & drop or click to browse</p>
                    <p className="text-sm text-gray-500">JPEG, JPG,PNG only</p>

                    <input
                      type="file"
                      ref={fileRef}
                      multiple
                      accept="image/"
                      className="hidden"
                      onChange={handleLoading}
                    />
                    <button
                      type="button"
                      className=" flex  items-center  gap-2 bg-yellow-500 px-4 py-1 mt-2"
                      onClick={handleClick}
                    >
                      <SlCloudUpload /> Browser files
                    </button>

                    {loading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
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
