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

    const preview = files.map((file) => URL.createObjectURL(file));

    setPhotos((prev) => [...prev, ...preview]);

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log("Upload ready");
    }, 1500);
  };

  // delete photo preview

  const handleDelete = (i: any) => {
    setPhotos((prev) => prev.filter((_, index) => index !== i));
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
            <div className="flex justify-between  ">
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
                  className="bg-yellow-500 w-40 py-2 mx-15 md:mx-0 mt-3 md:mt-0  md:px-6  md:py-1.5 rounded hover:bg-yellow-400 transition duration-300 font-inter"
                >
                  + New product
                </button>
              </div>
            </div>
            {/* added catalog  */}
            {open && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white dark:bg-black dark:border w-full mx-3 p-3  lg:w-1/2 lg:p-5 rounded shadow-lg relative  max-h-[90vh] overflow-y-auto transition duration-700  ">
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
                  <div className="grid lg:grid-cols-5 grid-cols-3 gap-2 mt-4 ">
                    {photos.map((img, i) => (
                      <div key={i} className="relative group  ">
                        <img
                          src={img}
                          alt="preview"
                          className="w-full h-40 object-cover rounded hover:bg-black "
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition rounded" />

                        <button
                          className=" lg:hidden active:block group-hover:block hover:bg-black absolute  top-1 right-1 bg-black/60 text-white p-1 rounded-full"
                          onClick={() => handleDelete(i)}
                        >
                          <RxCross2 />
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* input field */}
                  <div className="flex justify-between gap-2 mt-5">
                    <div className="flex flex-col w-1/2">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        placeholder="Enter product name.."
                        className=" border border-gray-300
    px-3 py-2 rounded
    focus:ring-0.5
    focus:ring-amber-500
    focus:border-amber-600 outline-none"
                      />
                    </div>
                    <div className="flex flex-col w-1/2">
                      <label htmlFor="name">Slug</label>
                      <input
                        type="text"
                        placeholder="Enter slug "
                        className="border border-gray-300
    px-3 py-2 rounded
    focus:ring-0.5
    focus:ring-amber-500
    focus:border-amber-600 outline-none"
                      />
                    </div>
                  
                  </div>
                  {/*  */}

                  <div className="flex justify-between gap-2 mt-5">
                    <div className="flex flex-col w-1/2">
                      <label htmlFor="categoty">Category</label>
                      <input
                        type="text"
                        placeholder="Enter slug "
                        className="border border-gray-300
    px-3 py-2 rounded
    focus:ring-0.5
    focus:ring-amber-500
    focus:border-amber-600 outline-none"
                      />
                    </div>
                    <div className="flex flex-col w-1/2">
                      <label htmlFor="gender">Gender</label>
                      <input
                        type="text"
                        placeholder="Enter slug "
                        className="border border-gray-300
    px-3 py-2 rounded
    focus:ring-0.5
    focus:ring-amber-500
    focus:border-amber-600 outline-none"
                      />
                    </div>
                    <div className="flex flex-col w-1/2">
                      <label htmlFor="stock">Stock</label>
                      <input
                        type="text"
                        placeholder="Enter slug "
                        className="border border-gray-300
    px-3 py-2 rounded
    focus:ring-0.5
    focus:ring-amber-500
    focus:border-amber-600 outline-none"
                      />
                    </div>
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
