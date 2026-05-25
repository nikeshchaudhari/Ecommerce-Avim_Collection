import AdminSideBar from "../component/AdminSideBar";
import Navbar from "../component/Navbar";

const AdminDashbaord = () => {
  return (
    <>
      {/* Dynamic Keyframes inject gareko jasle direct pass-through flow garcha */}
      <style>{`
        @keyframes diagonalPass {
          0% {
            transform: translate(-100%, -100%);
          }
          100% {
            transform: translate(100%, 100%);
          }
        }
        .animate-line-pass {
          animation: diagonalPass 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
      <nav className="">
        <Navbar />
      </nav>
      <main>
        <div className="bg-[#f9efe7] dark:bg-black min-h-screen lg:flex">
          <aside className="hidden lg:block">
            <AdminSideBar />
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
            <div className="grid grid-cols-2  lg:grid-cols-5 gap-4 mt-6">
              <div className="bg-linear-to-br from-yellow-500/30 via-white  to-white h-auto rounded dark:bg-linear-to-br dark:from-red-500/30 dark:via-black dark:to-black">
                <div className="flex justify-around items-start py-2 px-5">
                  <div>
                    <span className="font-inter uppercase text-[10px] lg:text-[12px] tracking-[1px] lg:tracking-[4px] ">
                      Total Revenue
                    </span>
                    <h1 className="text-[20px] lg:text-[35px] font-cormorant text-red-800">
                      NPR{" "}
                      <span className="text-[16px] lg:text-[30px]">
                        {new Intl.NumberFormat().format(4690000)}
                      </span>
                    </h1>
                    <span className=" dark:text-white/60 text-[10px] lg:text-[12px] text-black/60">
                      Orders + manual sales
                    </span>
                  </div>
                  <div>
                    <span className="lg:text-[30px] font-inter text-red-800">$</span>
                  </div>
                </div>
              </div>

              <div className="bg-white h-24 rounded">2</div>
              <div className="bg-white h-24 rounded">3</div>
              <div className="bg-white h-24 rounded">4</div>
              <div className="bg-white h-24 rounded">5</div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminDashbaord;
