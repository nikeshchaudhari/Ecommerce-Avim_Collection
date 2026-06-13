import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { LuTrash2, LuTag, LuMessageCircle } from "react-icons/lu";
import UserNavbar from "../components/UserNavbar";
const Cart = () => {
  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  );
  const isOpen = useSelector((state:RootState)=>state.cartOpen.isOpen)

  console.log(cartItems);

  return (
    <>
     <main className="bg-[#faf5ec] dark:bg-black">
        <div>
            <UserNavbar />
        </div>
        {
    isOpen &&(
        <div className="bg-[#FAF8F5] min-h-screen text-[#1C1C1C] font-sans antialiased selection:bg-transparent px-4 sm:px-6 lg:px-12 py-16">
      <div className="max-w-6xl mx-auto">
        
        {/* PAGE MAIN TITLE */}
        <div className="font-serif text-[38px] text-[#1C1C1C] tracking-wide mb-12">
          Your Cart
        </div>

        {/* TWO COLUMN GRID CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT PANEL: CART ITEMS LIST (7 Columns) */}
          <div className="lg:col-span-7 divide-y divide-gray-200">
            
            {/* ITEM 1 */}
            <div className="py-8 first:pt-0 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex flex-col gap-1">
                <div className="font-serif text-[20px] text-gray-900 font-normal tracking-wide">
                  Palpa Heritage Topi Cap
                </div>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center justify-between border border-gray-300 bg-[#FAF8F5] h-8 w-24 px-2 text-gray-500">
                    <div className="font-light text-base px-1">–</div>
                    <div className="text-gray-900 font-normal text-xs">1</div>
                    <div className="font-light text-sm px-1">+</div>
                  </div>

                  <div className="flex items-center gap-1 text-[12px] text-gray-400">
                    <LuTrash2 size={13} className="text-gray-400" />
                    <div>Remove</div>
                  </div>
                </div>
              </div>

              <div className="font-sans font-medium text-[16px] text-gray-900 pt-1 whitespace-nowrap self-end sm:self-start">
                NPR 2,400
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="py-8 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex flex-col gap-1">
                <div className="font-serif text-[20px] text-gray-900 font-normal tracking-wide">
                  Palpa Heritage Topi Cap
                </div>
                <div className="text-[12px] text-gray-400 font-medium tracking-wide mt-0.5">
                  56 · Ivory
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center justify-between border border-gray-300 bg-[#FAF8F5] h-8 w-24 px-2 text-gray-500">
                    <div className="font-light text-base px-1">–</div>
                    <div className="text-gray-900 font-normal text-xs">6</div>
                    <div className="font-light text-sm px-1">+</div>
                  </div>

                  <div className="flex items-center gap-1 text-[12px] text-gray-400">
                    <LuTrash2 size={13} className="text-gray-400" />
                    <div>Remove</div>
                  </div>
                </div>
              </div>

              <div className="font-sans font-medium text-[16px] text-gray-900 pt-1 whitespace-nowrap self-end sm:self-start">
                NPR 14,400
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: SUMMARY BOX (5 Columns) */}
          <div className="lg:col-span-5 bg-white border border-gray-200/60 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
            
            <div className="font-serif text-[22px] text-gray-900 tracking-wide mb-8">
              Order Summary
            </div>

            <div className="space-y-5 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-center text-[14px]">
                <div className="text-gray-500">Items</div>
                <div className="font-medium text-gray-900">NPR 16,800</div>
              </div>

              <div className="flex justify-between items-center text-[14px]">
                <div className="text-gray-500">VAT (13%)</div>
                <div className="font-medium text-gray-900">NPR 2,184</div>
              </div>

              <div className="flex justify-between items-center text-[14px]">
                <div className="text-gray-500">Shipping</div>
                <div className="text-[13px] text-gray-400 italic">Confirmed via WhatsApp</div>
              </div>
            </div>

            {/* COUPON SECTION */}
            <div className="py-6 border-b border-gray-200">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] text-gray-500 uppercase mb-3">
                <LuTag size={12} className="rotate-90 text-gray-400" />
                <div>Have a coupon?</div>
              </div>
              
              <div className="flex gap-2 h-10 w-full">
                <div className="flex-1 bg-white border border-gray-300 px-3 text-[12px] tracking-wider text-gray-300 uppercase flex items-center">
                  ENTER CODE
                </div>
                <div className="bg-[#5C1321] text-white text-[12px] font-semibold tracking-wide px-6 h-full flex items-center justify-center">
                  Apply
                </div>
              </div>
            </div>

            {/* GRAND TOTAL ROW */}
            <div className="py-6 flex justify-between items-baseline">
              <div className="font-serif text-[16px] text-gray-800">Total</div>
              <div className="font-sans font-medium text-[22px] text-[#80162B]">NPR 18,984</div>
            </div>

            {/* WHATSAPP BUTTON */}
            <div className="w-full bg-[#1BD741] text-white font-sans text-[14px] font-semibold tracking-wide h-12 flex items-center justify-center gap-2 rounded-md">
              <LuMessageCircle size={18} className="fill-white stroke-none" />
              <div>Checkout via WhatsApp</div>
            </div>

            <div className="mt-5 text-center px-2">
              <div className="text-[11px] leading-relaxed text-gray-400 font-normal">
                We confirm size, fabric & shipping personally on WhatsApp before processing your order.
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
    )
   }
     </main>
   
    </>
  );
};

export default Cart;