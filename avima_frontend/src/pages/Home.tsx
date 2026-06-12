import photo from "../assets/herosection.jpg";
import UserNavbar from "../components/UserNavbar";
import Footer from "./Footer";
const Home = () => {
  return (
    <>
      <main className="bg-[#faf5ec] ">
        <div>
          <UserNavbar />
          <section className="relative">
            <div className="flex">
              <div className="flex w-1/2 items-center justify-center">
                <div className="  flex flex-col justify-center px-8 py-16 md:px-16 md:py-24">
                  <span className="font-inter text-red-900">Est. Bhaktapur · Nepal</span>
                  <h1 className="mt-6 font-cormorant text-5xl md:text-7xl leading-[0.95] text-foreground max-w-4xl">Where timeless style meets <br /> <span className="text-red-900">true value.</span> </h1>
                  <p className="mt-6 max-w-md text-base text-muted-foreground leading-relaxed">Heritage Nepali clothing — Haku Patasi, Gunyu Cholo, Daura Suruwal, Dhaka Topi — crafted slowly, by hand, in the courtyards of Bhaktapur.</p>
                </div>
              </div>

              <div className="w-1/2">
                <img src={photo} alt="Woman wearing traditional Nepali Haku Patasi" className=" inset-0 md:h-[88vh] w-full object-cover" />
              </div>
            </div>
          </section>
        </div>
        <Footer/>
      </main>
    </>
  );
};

export default Home;
