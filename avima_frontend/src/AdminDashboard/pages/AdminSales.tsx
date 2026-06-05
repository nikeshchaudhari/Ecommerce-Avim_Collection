import AdminSideBar from "../component/AdminSideBar"
import Navbar from "../component/Navbar"


const AdminSales = () => {
  return (
   <>
   
    <main>
        <div className="sticky top-0 z-50">
             <Navbar/>
 
        </div>
        <div className="bg-[#f9efe7] dark:bg-black min-h-screen lg:flex">
            <aside className="hidden lg:block">
            <AdminSideBar/>
          </aside>

          <section className="flex-1 px-5 lg:px-10 pt-5">
             <span className="text-[12px] tracking-[4px] text-yellow-500">
              OVERVIEW
            </span>

            <h2 className="text-[25px] md:text-[30px] font-cormorant">
              Dashboard
            </h2>

            <p className="font-inter text-black/60">
              Live snapshot of revenue, orders and the catalog.
            </p>

               {/* BOX */}
            <div className="grid grid-cols-2 md:grid-cols-4  lg:grid-cols-5 gap-4 mt-6">
              <div className="bg-linear-to-br from-yellow-500/30 via-white  to-white h-auto rounded dark:bg-linear-to-br dark:from-red-500/30 dark:via-black dark:to-black transform transition-all hover:translate-1.5 duration-300 cursor-pointer ">
                <div className="flex justify-between  items-start py-2 px-5">
                  <div>
                    <span className="font-inter uppercase text-[10px] lg:text-[10px] 2xl:text-[12px] tracking-[1px] lg:tracking-[4px] ">
                      Total Revenue
                    </span>
                    <h1 className="text-[20px] lg:text-[25px]  font-cormorant text-red-800">
                      NPR {}
                      <span className="text-[16px] lg:text-[20px]">
                        {new Intl.NumberFormat().format(12)}
                      </span>
                    </h1>
                    <span className=" dark:text-white/60 text-[10px] lg:text-[12px] text-black/60">
                      Orders + manual sales
                    </span>
                  </div>
                  <div>
                    <span className="lg:text-[20px] font-inter text-red-800">
                      $
                    </span>
                  </div>
                </div>
              </div>

{/*  */}

              </div>

          </section>

        </div>
    </main>
   </>
  )
}

export default AdminSales
