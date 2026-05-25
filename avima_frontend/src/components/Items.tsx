import axios from 'axios'

import  { useEffect, useState } from 'react'

interface Items{
    id:number;
    
}
const Items = () => {
const [products,setProducts] =useState<Items[]>([])
    useEffect(()=>{
        const fetchItems = async()=>{
          try {
      const res = await axios.get("https://dummyjson.com/products");
      setProducts(res.data.products)
      console.log(res.data.products);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };
        fetchItems()
    },[])
  return (
    <>
    <main>
        <section className=' grid grid-cols-5 px-5 gap-2 mt-10 justify-items-center'>
 {products.map((item) => (
          <div key={item.id} className=' '>
            <div className='border border-amber-900/20 hover:border-amber-600 transition duration-500 rounded-lg p-5 mt-5 cursor-pointer'>
                <img src={item.images} alt="" className='w-[15vw] mb-3 transition transform  hover:scale-110 duration-500'/>
                <h2 className='font-inter'>{item.category}</h2>
            <h3 className='font-cormorant text-[20px]'>{item.title}</h3>
            <h3 className='text-red-600 font-semibold'>NRP {item.price}</h3>
            </div>
          </div>
        ))}
        </section>
    </main>
    </>
  )
}

export default Items
