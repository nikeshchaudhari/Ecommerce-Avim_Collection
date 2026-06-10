import UserNavbar from "../components/UserNavbar";
import Items from "../components/Items";

const Shop = () => {
  return (
    <>
    
      <main className="bg-[#faf5ec] min-h-screen pb-16">
        <UserNavbar />
        
        <div className="flex justify-center mt-10 px-4">
          <div className="w-full text-center">
            <span className="inline-block font-inter uppercase text-[#f7b828] text-[12px] tracking-widest font-semibold">
              The Atelier
            </span>
            
            <h2 className="tracking-tight text-[35px] md:text-[50px] font-cormorant font-medium text-[#1c1c1c] mt-2">
              Shop the Collection
            </h2>
            
            <div className="w-full flex justify-center mt-3">
              {/* Cleaned up width parameters for optimal text-wrapping layout bounds */}
              <p className="max-w-xl font-inter text-[14px] md:text-[16px] text-black/60 leading-relaxed">
                Pieces hand-woven by master artisans of Bhaktapur, Patan and the
                Kathmandu valley.
              </p>
            </div>
          </div>
        </div>

        {/* Clean wrapping section for your optimized product catalog display */}
        <div className="mt-8">
          <section>
            <Items />
          </section>
        </div>
      </main>
    </>
  );
};

export default Shop;