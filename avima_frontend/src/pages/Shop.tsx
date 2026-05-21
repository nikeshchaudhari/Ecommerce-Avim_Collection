import React from "react";
import UserNavbar from "../components/UserNavbar";

const Shop = () => {
  return (
    <>
      <main className="bg-[#faf5ec] h-screen">
        <UserNavbar />
        <section>
          <div className=" flex justify-center mt-10 ">
            <div className="w-full">
              {" "}
              <span className="flex justify-center font-inter uppercase text-[#f7b828] text-[12px]">The Atelier</span>
              <h2 className="flex justify-center tracking-tight text-[35px] md:text-[50px] font-cormorant font-medium">Shop the Collection</h2>
              <div className="w-full flex justify-center ">
                <span className="w-[80vw] md:w-full flex justify-center font-inter text-[14px] md:text-[18px] text-black/60">
                Pieces hand-woven by master artisans of Bhaktapur, Patan and the
                Kathmandu valley.
              </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Shop;
