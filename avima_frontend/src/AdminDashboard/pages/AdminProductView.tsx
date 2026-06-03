import React from "react";

const AdminProductView = () => {
  return (
    <>
      <main>
        <section className="w-full  h-full border border-gray-600/20 dark:border-gray-600 rounded-lg overflow-x-auto">
          <div>
            <table className="w-full h-10 bg-[#f6f0e7] dark:bg-black rounded-lg">
              <thead className=" w-full h-10 flex justify-between items-center gap-4 md:px-5">
                <tr className="uppercase font-inter font-bold text-[14px] text-black/60 dark:text-white">Image</tr>
                <tr className="uppercase font-inter font-bold text-[14px]  text-black/60 dark:text-white">Name</tr>
                <tr className="uppercase font-inter font-bold text-[14px]  text-black/60 dark:text-white"> Category</tr>
                <tr className="uppercase font-inter font-bold text-[14px]  text-black/60 dark:text-white">Price</tr>
                <tr className="uppercase font-inter font-bold text-[14px]  text-black/60 dark:text-white">Stock</tr>
                <tr className="uppercase font-inter font-bold text-[14px]  text-black/60 dark:text-white">Status</tr>
                <tr className="uppercase font-inter font-bold text-[14px]  text-black/60 dark:text-white">Action</tr>
              </thead>
            </table>
          </div>
        </section>
      </main>
    </>
  );
};

export default AdminProductView;
