import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { LuTrash2, LuTag, LuMessageCircle } from "react-icons/lu";
import UserNavbar from "../components/UserNavbar";
import { decreaseQuantiy, increaseQuantity, removeCart } from "../features/cartSlice";
import { BiMinus, BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch: AppDispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isOpen = useSelector((state: RootState) => state.cartOpen.isOpen);

  console.log(cartItems);

  const itemsSubtotal = cartItems.reduce(
    (accumulator: number, item: any) =>
      accumulator + item.price * item.quantity,
    0,
  );
  const vatAmount = itemsSubtotal * 0.13; // 13% VAT
  const orderTotal = itemsSubtotal + vatAmount;


  return (
    <>
      <div className="bg-[#FAF5EC] dark:bg-black min-h-screen text-[#1C1C1C] font-sans antialiased selection:bg-transparent">
        <div>
          <UserNavbar />
        </div>

        {isOpen && (
          <div className="px-4 sm:px-6 lg:px-12 py-16">
            <div className="max-w-6xl mx-auto">
              
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-24 px-4">
                  <div className="font-serif text-[36px] sm:text-[42px] text-[#5C1321] tracking-wide mb-3">
                    Your cart is empty
                  </div>
                  <div className="text-[16px] sm:text-[18px] text-gray-500 font-normal tracking-wide mb-8">
                    Discover heritage pieces hand-woven for you.
                  </div>
                 <Link to="/shop">
                  <div className="bg-[#FFC132] text-gray-900 font-sans font-semibold text-[15px] tracking-wide px-8 h-12 flex items-center justify-center rounded shadow-sm hover:bg-[#e6ac2d] transition-colors cursor-pointer select-none">
                    Browse the Atelier
                  </div>
                 </Link>
                </div>
              ) : (
                
                <>
                  <div className="font-serif text-[38px] text-[#1C1C1C] tracking-wide mb-12">
                    Your Cart
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    <div className="lg:col-span-7 divide-y divide-gray-200">
                      {cartItems.map((item: any, index: number) => (
                        <div
                          key={item.id || index}
                          className="py-6 first:pt-0 flex flex-col sm:flex-row justify-between items-start gap-4"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="font-serif text-[20px] text-gray-900 font-normal tracking-wide">
                              {item.name || "Product Item"}
                            </div>

                            {(item.size || item.color) && (
                              <div className="text-[12px] text-gray-400 font-medium tracking-wide mt-0.5">
                                {item.size && (
                                  <div className="inline-block">{item.size}</div>
                                )}
                                {item.size && item.color && (
                                  <div className="inline-block mx-1">·</div>
                                )}
                                {item.color && (
                                  <div className="inline-block">{item.color}</div>
                                )}
                              </div>
                            )}

                            <div className="flex items-center gap-4 mt-4">
                              <div className="flex items-center justify-between border border-gray-300 bg-[#FAF8F5] h-8 w-24 px-2 text-gray-500">
                                <div
                                  className="font-light text-base cursor-pointer select-none flex items-center justify-center"
                                  onClick={() =>
                                    dispatch(
                                      decreaseQuantiy({
                                        id: item.id,
                                        size: item.size,
                                        color: item.color,
                                      }),
                                    )
                                  }
                                >
                                  <BiMinus size={14} />
                                </div>
                                <div className="text-gray-900 font-normal text-xs select-none">
                                  {item.quantity}
                                </div>
                                <div
                                  className="font-light text-sm cursor-pointer select-none flex items-center justify-center"
                                  onClick={() =>
                                    dispatch(
                                      increaseQuantity({
                                        id: item.id,
                                        size: item.size,
                                        color: item.color,
                                        stock: item.stock,
                                        quantity: item.quantity
                                      }),
                                    )
                                  }
                                >
                                  <BiPlus size={14} />
                                </div>
                              </div>

                              <div
                                className="flex items-center gap-1 text-[12px] text-gray-400 cursor-pointer select-none hover:text-gray-600 transition-colors"
                                onClick={() =>
                                  dispatch(
                                    removeCart({
                                      id: item.id,
                                      size: item.size,
                                      color: item.color,
                                    }),
                                  )
                                }
                              >
                                <LuTrash2 size={13} className="text-gray-400" />
                                <div>Remove</div>
                              </div>
                            </div>
                          </div>

                          <div className="font-sans font-medium text-[16px] text-gray-900 pt-1 whitespace-nowrap self-end sm:self-start">
                            NPR {(
                              (item.price || 0) * (item.quantity || 1)
                            ).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="lg:col-span-5 bg-white border border-gray-200/60 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
                      <div className="font-serif text-[22px] text-gray-900 tracking-wide mb-8">
                        Order Summary
                      </div>

                      <div className="space-y-5 pb-6 border-b border-gray-200">
                        <div className="flex justify-between items-center text-[14px]">
                          <div className="text-gray-500">Items</div>
                          <div className="font-medium text-gray-900">
                            NPR {itemsSubtotal.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[14px]">
                          <div className="text-gray-500">VAT (13%)</div>
                          <div className="font-medium text-gray-900">
                            NPR {vatAmount.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[14px]">
                          <div className="text-gray-500">Shipping</div>
                          <div className="text-[13px] text-gray-400 italic">
                            Confirmed via WhatsApp
                          </div>
                        </div>
                      </div>

                      {/* <div className="py-6 border-b border-gray-200">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] text-gray-500 uppercase mb-3">
                          <LuTag size={12} className="rotate-90 text-gray-400" />
                          <div>Have a coupon?</div>
                        </div>

                        <div className="flex gap-2 h-10 w-full">
                          <div className="flex-1 bg-[#FAF8F5] border border-gray-300 px-3 text-[12px] tracking-wider text-gray-400 uppercase flex items-center select-none">
                            ENTER CODE
                          </div>
                          <div className="bg-[#5C1321] text-white text-[12px] font-semibold tracking-wide px-6 h-full flex items-center justify-center cursor-pointer hover:bg-[#4a0f1a] transition-colors select-none">
                            Apply
                          </div>
                        </div>
                      </div> */}

                      <div className="py-6 flex justify-between items-baseline">
                        <div className="font-serif text-[16px] text-gray-800">
                          Total
                        </div>
                        <div className="font-sans font-medium text-[22px] text-[#80162B]">
                          NPR {orderTotal.toLocaleString()}
                        </div>
                      </div>

                     <Link to="/checkout">
                      <div className="w-full bg-[#1BD741] text-white font-sans text-[14px] font-semibold tracking-wide h-12 flex items-center justify-center gap-2 rounded-md cursor-pointer hover:bg-[#18c33a] transition-colors">
                        <LuMessageCircle
                          size={18}
                          className="fill-white stroke-none"
                        />
                        <div>Checkout via WhatsApp</div>
                      </div>
                     </Link>

                      <div className="mt-5 text-center px-2">
                        <div className="text-[11px] leading-relaxed text-gray-400 font-normal">
                          We confirm size, fabric & shipping personally on WhatsApp
                          before processing your order.
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;