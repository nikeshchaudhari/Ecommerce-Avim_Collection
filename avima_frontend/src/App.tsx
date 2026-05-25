import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./AdminDashboard/component/Navbar";
import UserNavbar from "./components/UserNavbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Shop from "./pages/Shop";
import Dashboard from "./AdminDashboard/pages/Dashboard";
import AdminDashbaord from "./AdminDashboard/pages/AdminDashbaord";
import UserAccount from "./pages/UserAccount";
import AdminProducts from "./AdminDashboard/pages/AdminProducts";

export const myRouter = createBrowserRouter([
  {path:"",element:<Home/>},
  {path:"home",element:<Home/>},
  {path:"shop",element:<Shop/>},
  {path:"register",element:<Register/>},
  {path:"login",element:<Login/>},
  {path:"account",element:<UserAccount/>},
  {path:"dashboard",element:<Dashboard/>, children:[
    {path:"", element:<AdminDashbaord/>},
    {path:"admin", element:<AdminDashbaord/>},
    {path:"products", element:<AdminProducts/>},
  ]}
])
const App = () => {
  return (
   <>
   <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
   <RouterProvider router={myRouter}/>
 <ToastContainer/>
 </div>
   </>
  )

};

export default App;
