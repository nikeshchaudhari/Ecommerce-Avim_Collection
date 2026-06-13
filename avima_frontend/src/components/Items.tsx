import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { LuShoppingBag } from "react-icons/lu";
import { Riple } from "react-loading-indicators";
import { Link } from "react-router-dom";

interface Product {
  name: string;
  id: number;
  title: string;
  category: string;
  photos: string;
  price: number;
}

const Items = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/product/all-products",
        );
        setProducts([...res.data.products].reverse());
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const getFirstPhotoUrl = (photosJson: string | null): string => {
    const defaultImage =
      "https://st4.depositphotos.com/14953852/22772/v/450/depositphotos_227725120-stock-illustration-image-available-icon-flat-vector.jpg";
    try {
      if (!photosJson) return defaultImage;
      const parsed = JSON.parse(photosJson);
      return parsed?.[0]?.url || defaultImage;
    } catch {
      return defaultImage;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center h-screen items-center">
        <Riple color="#32cd32" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 font-inter text-gray-600  dark:text-white font-medium text-sm md:text-base">
        <h2>{products.length} pieces available</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {products.map((item) => {
          const imageUrl = getFirstPhotoUrl(item.photos);

          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between dark:bg-black bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-amber-500/40 transition-all duration-300 relative"
            >
              {/* Product Image & Category */}
              <div className="relative overflow-hidden dark:bg-black bg-gray-50 aspect-3/4 w-full">
                <Link to={`/shop/${item.id}`} className="block w-full h-full">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
                <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-700/90 backdrop-blur-xs px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[9px] md:text-[11px] font-medium tracking-wider text-white uppercase shadow-xs z-10">
                  {item.category}
                </span>
              </div>

              <div className="relative p-3 md:p-4 flex flex-col justify-between grow ">
                {/* Product Name */}
                <div className="">
                  <h3 className="font-cormorant text-base md:text-lg font-semibold text-gray-800 line-clamp-1 group-hover:text-amber-700 dark:text-white transition-colors duration-200">
                    {item.name}
                  </h3>
                </div>

                {/* Price Display */}
                <div className=" flex items-center gap-2">
                  <span className="text-[10px] md:text-xs text-gray-400 font-medium">
                    Price
                  </span>
                  <span className="text-amber-700 dark:text-red-500 font-semibold text-sm md:text-base font-sans">
                    $ {item.price.toLocaleString()}
                  </span>
                </div>

                <div className="hidden md:absolute md:inset-0 md:flex md:justify-around md:items-center md:bg-white dark:bg-black  md:opacity-0 md:group-hover:opacity-100 md:transition-all md:duration-300 md:px-2">
                  <button className="border border-gray-300 p-2 rounded-full hover:border-red-600 hover:bg-red-600 text-black dark:text-white hover:text-white transition-all duration-300 cursor-pointer">
                    <FaRegHeart size={16} />
                  </button>
                  <Link
                    to={`/shop/${item.id}`}
                    className="bg-red-600 hover:bg-red-700 text-white font-inter text-center text-sm py-2 px-4 rounded-full grow mx-2 transition-all cursor-pointer"
                  >
                    <button>Buy Now</button>
                  </Link>
                  <button className="border border-gray-300 p-2 rounded-full dark:hover:bg-whitehover:border-black dark:hover:bg-white hover:bg-black dark:text-white text-black hover:text-black transition-all duration-300 cursor-pointer">
                    <LuShoppingBag size={16} />
                  </button>
                </div>
              </div>
              <div className="flex md:hidden border-t border-gray-100 p-2 gap-1.5 bg-gray-50/50">
                <button className="border border-gray-200 p-2 rounded-full text-gray-600 active:bg-red-50 active:text-red-600 active:border-red-200 transition-all">
                  <FaRegHeart size={16} />
                </button>

                <Link
                  to={`/shop/${item.id}`}
                  className="grow bg-red-600 active:bg-red-700 text-white text-xs font-medium font-inter py-2 rounded-full text-center transition-all flex items-center justify-center"
                >
                  Buy Now
                </Link>

                <button className="border border-gray-200 p-2 rounded-full text-gray-600 active:bg-gray-200 active:text-black transition-all">
                  <LuShoppingBag size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Items;
