import AdminSideBar from "../component/AdminSideBar";
import Navbar from "../component/Navbar";

const AdminSetting = () => {
  return <>
   <main>
      <div className="sticky top-0 z-50">
      <Navbar />
    </div>
    <div className="bg-[#f9efe7] dark:bg-black min-h-screen lg:flex">
          <aside className="hidden lg:block">
            <AdminSideBar />
          </aside>
          
          <section className="flex-1 px-5 lg:px-10 pt-5">
            <span className="text-[12px] tracking-[4px] text-yellow-500 uppercase">
              Configuration
            </span>

            <h2 className="text-[25px] md:text-[30px] font-cormorant">
              Store Settings

            </h2>

           
          </section>
    </div>
   </main>
  </>;
};

export default AdminSetting;
