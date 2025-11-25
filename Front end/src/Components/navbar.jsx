import { useAuth } from "./LoginContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="Navbar">
      <div className="redditname_logo"
      onClick={() => navigate("/")}>
        <img className="redditlogo" src="\Reddit-symbol.png" alt="Reddit Logo" />
        <h1>reddit</h1>
      </div>

      <div className="search-container">
        <svg
          className="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="#ffffff"
          width="16"
          height="16"
          viewBox="0 0 20 20"
        >
          <path d="M18.736 17.464l-3.483-3.483A7.961 7.961 0 0016.999 9 8 8 0 109 17a7.961 7.961 0 004.981-1.746l3.483 3.483a.9.9 0 101.272-1.273zM9 15.2A6.207 6.207 0 012.8 9c0-3.419 2.781-6.2 6.2-6.2s6.2 2.781 6.2 6.2-2.781 6.2-6.2 6.2z" />
        </svg>
        <input type="text" placeholder="Search Reddit" />
      </div>

      <div className="navbar-right">
  {!isLoggedIn ? (
    <>
      
      <button onClick={() => navigate("/Login")} className="LoginButton">Log In</button>
      <button className="threedots">...</button>
    </>
  ) : (
    <>

    <button className="ADS"><svg rpl="" fill="currentColor" height="20" icon-name="ad-group" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.972 5.028C16.831 3.338 15.426 2 13.7 2H3.3C1.481 2 0 3.48 0 5.3v6.4c0 1.726 1.337 3.131 3.028 3.272C3.169 16.662 4.574 18 6.3 18h10.4c1.819 0 3.3-1.48 3.3-3.3V8.3c0-1.726-1.337-3.131-3.028-3.272zM3 8.3v4.87a1.5 1.5 0 01-1.199-1.47V5.3c0-.827.672-1.5 1.499-1.5h10.4c.724 0 1.33.516 1.469 1.2H6.3C4.481 5 3 6.48 3 8.3zm15.199 6.4c0 .827-.672 1.5-1.499 1.5H6.3a1.501 1.501 0 01-1.499-1.5V8.3c0-.827.672-1.5 1.499-1.5h10.4c.827 0 1.499.673 1.499 1.5v6.4zM9.545 8.741H8.281L6 14.259h1.709l.389-1.009h1.635l.389 1.009h1.707L9.545 8.741zm.067 3.344H8.22l.681-1.793h.027l.684 1.793zm5.937-3.053a3.162 3.162 0 00-1.339-.291h-1.965v5.517h2.053c.458 0 .898-.108 1.307-.32a2.532 2.532 0 001.008-.958c.256-.422.386-.932.386-1.516 0-.596-.137-1.107-.405-1.519a2.48 2.48 0 00-1.046-.914l.001.001zm-.147 2.441c0 .304-.058.557-.171.753a1.097 1.097 0 01-.414.424 1.01 1.01 0 01-.487.136h-.488v-2.569h.488c.163 0 .329.042.496.125.161.081.295.21.407.397.112.184.169.431.169.735v-.001z"></path>
    </svg></button>
      <button className="messages"><svg rpl="" fill="currentColor" height="20" icon-name="chat" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1a9 9 0 00-9 9c0 1.947.79 3.58 1.935 4.957L.231 17.661A.784.784 0 00.785 19H10a9 9 0 009-9 9 9 0 00-9-9zm0 16.2H6.162c-.994.004-1.907.053-3.045.144l-.076-.188a36.981 36.981 0 002.328-2.087l-1.05-1.263C3.297 12.576 2.8 11.331 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2zm5.2-7.2a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0zm-4 0a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0zm-4 0a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"></path>
    </svg></button>
    <button>
    <div className="+Create">
      <svg rpl="" fill="currentColor" height="20" icon-name="add-square" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.7 2H5.3C3.481 2 2 3.48 2 5.3v9.4C2 16.519 3.48 18 5.3 18h9.4c1.819 0 3.3-1.48 3.3-3.3V5.3C18 3.481 16.52 2 14.7 2zm1.499 12.7a1.5 1.5 0 01-1.499 1.499H5.3A1.5 1.5 0 013.801 14.7V5.3A1.5 1.5 0 015.3 3.801h9.4A1.5 1.5 0 0116.199 5.3v9.4zM14 10.9h-3.1V14H9.1v-3.1H6V9.1h3.1V6h1.8v3.1H14v1.8z"></path>
    </svg>
    <span>Create</span>
    </div>
    </button>
    <button className="notifications">
      <svg rpl="" fill="currentColor" height="20" icon-name="notifications" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.176 14.218l-.925-1.929a2.577 2.577 0 01-.25-1.105V8c0-3.86-3.142-7-7-7-3.86 0-7 3.14-7 7v3.184c0 .38-.088.762-.252 1.105l-.927 1.932A1.103 1.103 0 002.82 15.8h3.26A4.007 4.007 0 0010 19a4.008 4.008 0 003.918-3.2h3.26a1.1 1.1 0 00.934-.514 1.1 1.1 0 00.062-1.068h.002zM10 17.2c-.93 0-1.722-.583-2.043-1.4h4.087a2.197 2.197 0 01-2.043 1.4zM3.925 14l.447-.933c.28-.584.43-1.235.43-1.883V8c0-2.867 2.331-5.2 5.198-5.2A5.205 5.205 0 0115.2 8v3.184c0 .648.147 1.299.428 1.883l.447.933H3.925z"></path>
    </svg>  
    </button>
    <button className="avatar">
      <img src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png" alt="User Avatar" class="h-full w-full"/>
    </button>
      
    </>
  )}
</div>
    </header>
  );
}

export default Navbar;
