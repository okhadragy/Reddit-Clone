import { useState } from "react";
import { useAuth } from "./LoginContext";


function Login_Signup() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [islogin, SetIsLogin] = useState(true);
  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const [ConfirmPassword, SetConfirmPassword] = useState("");


  const HandleSubmit = (e) => {
    e.preventDefault();

    if (islogin) {
      console.log("Logging in with: ", { Email, Password });
      //api call 
      //variable result=response(token,UserData)
      //save el token,UserData  fel local storage
      setIsLoggedIn(true)
    } else {
      if (Password !== ConfirmPassword) {
        console.log("Passwords Don't match!,Try Again");
        return;
      }
      console.log("Signing up with:", { Email, Password });
    }
  };

  return (
    
     
      <div className="Overlay">  

       
        <div className="LoginCard">  

          <h1>{islogin ? "Log In" : "Sign Up"}</h1>

          <form onSubmit={HandleSubmit} className="Login_Signup">

            <div className="OtherLogins">
              <button className="LoginButtons">Continue With Phone Number</button>
              <button className="LoginButtons">Continue With Google</button>
              <button className="LoginButtons">Continue With Apple</button>
              <button className="LoginButtons">Email me a one-time link</button>
            </div>

          
            <span className="ORSeparator">OR</span>

            <div className="Email_Password">
              <input
                type="Email"
                placeholder="Email or Username"
                value={Email}
                onChange={(e) => {
                  SetEmail(e.target.value);
                }}
                required
              />
            </div>

            <div className="Email_Password">
              <input
                type="Password"
                placeholder="Password"
                value={Password}
                onChange={(e) => {
                  SetPassword(e.target.value);
                }}
                required
              />
            </div>

      
            {!islogin && (
              <div className="Email_Password">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={ConfirmPassword}
                  onChange={(e) => SetConfirmPassword(e.target.value)}
                  
                  required
                />
              </div>
            )}

 

          </form>
       <div className="forgotandnewtoreddit">
          {islogin && (
            <a className="Forgot_Password" href="#">
              Forgot Password?
            </a>
          )}

          {islogin && (
            <p>
              New to Reddit ? <a className="newtoreddit" href="#" onClick={() => SetIsLogin(false)}>Sign Up</a>
            </p>
          )}
        </div>
<button  
            type="submit"  
            onClick={HandleSubmit}
            disabled={
                !Email ||
                !Password ||
                (!islogin && !ConfirmPassword)
            }
            className="SubmitButton"
            >
            {islogin ? "Log In" : "Sign Up"}
         </button>
        </div>


      </div>

    
  );
}

export default Login_Signup;
