import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#faf5ec] border-t border-gray-200/60 font-sans mt-auto">
      {/* Upper Footer Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">
          
          {/* Column 1: Brand Introduction Block (takes up 4 cols on desktop) */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h2 className="font-serif text-3xl text-[#80162B] font-normal tracking-wide">
              AVIMA
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs font-inter">
              Where timeless style meets true value. Heritage Nepali clothing, made by hand.
            </p>
          </div>

          {/* Column 2: Shop Category Menu Links (takes up 3 cols on desktop) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-[11px] font-semibold text-[#80162B] uppercase tracking-[0.2em] font-inter block mb-1">
              Shop
            </span>
            <ul className="space-y-2.5 text-sm text-[#1c1c1c] font-inter">
              <li><Link to="/shop/haku-patasi" className="hover:text-[#80162B] transition-colors">Haku Patasi</Link></li>
              <li><Link to="/shop/gunyu-cholo" className="hover:text-[#80162B] transition-colors">Gunyu Cholo</Link></li>
              <li><Link to="/shop/saris" className="hover:text-[#80162B] transition-colors">Saris</Link></li>
              <li><Link to="/shop/daura-suruwal" className="hover:text-[#80162B] transition-colors">Daura Suruwal</Link></li>
              <li><Link to="/shop/dhaka-topi" className="hover:text-[#80162B] transition-colors">Dhaka Topi</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col gap-3">
            <span className="text-[11px] font-semibold text-[#80162B] uppercase tracking-[0.2em] font-inter block mb-1">
              House
            </span>
            <ul className="space-y-2.5 text-sm text-[#1c1c1c] font-inter">
              <li><Link to="/heritage" className="hover:text-[#80162B] transition-colors">Our Heritage</Link></li>
              <li><Link to="/lookbook" className="hover:text-[#80162B] transition-colors">Lookbook</Link></li>
              <li><Link to="/contact" className="hover:text-[#80162B] transition-colors">Contact</Link></li>
              <li><Link to="/account" className="hover:text-[#80162B] transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact / Location Details (takes up 3 cols on desktop) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-[11px] font-semibold text-[#80162B] uppercase tracking-[0.2em] font-inter block mb-1">
              Atelier
            </span>
            <div className="space-y-4 text-sm text-gray-600 font-inter leading-relaxed">
              <p>
                Balkot, Bhaktapur<br />
                Nepal
              </p>
              <p>
                <a 
                  href="mailto:hello@avima.com" 
                  className="text-[#1c1c1c] hover:text-[#80162B] transition-colors"
                >
                  hello@avima.com
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Lower Copyright Strip */}
      <div className="border-t border-gray-200/50 py-6 text-center text-xs text-gray-500 font-inter tracking-wide">
        <p>© 2026 AVIMA · All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;