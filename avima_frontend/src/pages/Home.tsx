import { Link } from "react-router-dom";
import photo from "../assets/herosection.jpg";
import UserNavbar from "../components/UserNavbar";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <main className="bg-[#FAF5EC] dark:bg-black min-h-screen text-[#1C1C1C] font-sans antialiased selection:bg-transparent">
        <UserNavbar />

        <section className="w-full ">
         
          <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] w-full items-stretch">
            
            
            <div className="w-full md:w-1/2 md:order-last relative h-[45vh] sm:h-[55vh] md:h-auto bg-gray-100">
              <img 
                src={photo} 
                alt="Woman wearing traditional Nepali Haku Patasi" 
                className="absolute inset-0 w-full h-full object-cover object-center" 
              />
              
              {/* BRANDING BOTTOM RIGHT OVERLAY BADGE */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs py-1.5 px-3 text-[10px] font-bold tracking-widest text-gray-800 uppercase select-none shadow-xs">
                Haku Patasi - Newar
              </div>
            </div>

            {/* 
              LEFT TEXT CONTENT CONTAINER
              - Mobile: Flows directly beneath the top hero image.
              - Desktop: Occupies exactly 50% width on the left.
            */}
            <div className="w-full md:w-1/2 flex items-center justify-center   ">
              <div className="max-w-xl w-full flex flex-col justify-center  ">
                
                {/* SUBTITLE PRE-HEADER */}
                <span className="text-[11px] font-inter font-bold tracking-[0.18em] text-[#80162B] uppercase">
                  Est. Bhaktapur · Nepal
                </span>

                {/* HERO MAIN HEADER */}
                <h1 className="mt-5 font-cormorant text-[38px] sm:text-[20px] lg:text-[60px] leading-[1.05] text-[#1C1C1C] dark:text-white ">
                  Where timeless style meets <span className="text-[#80162B]">true value.</span>
                </h1>

                {/* DESCRIPTION BODY PARAGRAPH */}
                <p className="mt-6 font-inter text-[14px] sm:text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed font-normal max-w-md">
                  Heritage Nepali clothing — Haku Patasi, Gunyu Cholo, Daura Suruwal, 
                  Dhaka Topi — crafted slowly, by hand, in the courtyards of Bhaktapur.
                </p>

                {/* ACTION DIRECTIVE INTERACTIVE BUTTON GROUPS */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/shop">
                  <button className="bg-[#F0B229] hover:bg-[#e0a420] text-[#1C1C1C] font-medium text-[16px] tracking-[2px] px-6 py-3 flex items-center justify-center transition-colors shadow-sm cursor-pointer select-none ">
                    Explore the Collection
                  </button>
                  </Link>
                  <button className="bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border border-[#80162B] text-[#80162B] font-medium text-[13px] tracking-widest uppercase px-6 h-12 flex items-center justify-center transition-colors cursor-pointer select-none">
                    View Lookbook
                  </button>
                </div>

                {/* METRICS & STUDIO COUNTERS BLOCK */}
                <div className="mt-5 border-gray-200/60 grid grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <div className="font-cormorant text-[24px] text-gray-900 dark:text-white">12</div>
                    <div className="text-[10px] font-inter font-bold tracking-[0.12em] text-gray-400 uppercase">
                      Heritage Pieces
                    </div>
                  </div>
                  <div>
                    <div className="font-cormorant text-[24px] text-gray-900 dark:text-white">5</div>
                    <div className="text-[10px] font-inter font-bold tracking-[0.12em] text-gray-400 uppercase ">
                      Atelier Weavers
                    </div>
                  </div>
                  <div>
                    <div className="font-cormorant text-[24px] text-gray-900 dark:text-white">∞</div>
                    <div className="text-[10px] font-inter font-bold tracking-[0.12em] text-gray-400 uppercase ">
                      Stories Woven
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Global Footer View */}
        <Footer />
      </main>
    </>
  );
};

export default Home;