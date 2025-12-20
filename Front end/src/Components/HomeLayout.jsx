import { Outlet } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Sidebar from "./sidebar.jsx";

const HomeLayout = ({isLoggedIn}) => {

  return (
    <div className="Homepage">
      <Navbar isLoggedIn={isLoggedIn} />
      <Sidebar isLoggedIn={isLoggedIn} />

      <div className="FeedLayout">
        <Outlet />
      </div>
    </div>
  );
};

export default HomeLayout;
