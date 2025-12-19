import { useState, useEffect } from "react";
import { useAuth } from "./LoginContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";

function Login_Signup() {
  const { login } = useAuth();
  const [Name, SetName] = useState("");
  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const [ConfirmPassword, SetConfirmPassword] = useState("");
  const [errors, SetErrors] = useState({});
  const [backendError, SetBackendError] = useState("");

  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const islogin = mode !== "signup";
  const navigate = useNavigate();

<<<<<<< Updated upstream
  // Reset form on mode change
=======

>>>>>>> Stashed changes
  useEffect(() => {
    SetName("");
    SetEmail("");
    SetPassword("");
    SetConfirmPassword("");
    SetErrors({});
    SetBackendError("");
  }, [mode]);

  useEffect(() => {
    if (!mode) {
      navigate("/login?mode=login", { replace: true });
    }
  }, [mode, navigate]);

  useEffect(() => {
    const newErrors = {};
    SetBackendError("");

    if (!islogin) {
      // Signup validation
      if (Name && !/^[a-zA-Z0-9_]{3,20}$/.test(Name))
        newErrors.Name = "Username must be 3-20 characters, letters, numbers, or underscores.";

<<<<<<< Updated upstream
      if (Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email))
        newErrors.Email = "Invalid email format.";

      if (Password) {
        if (Password.length < 8) newErrors.Password = "Password must be at least 8 characters.";
        else if (!/[A-Z]/.test(Password)) newErrors.Password = "Password must contain an uppercase letter.";
        else if (!/[0-9]/.test(Password)) newErrors.Password = "Password must contain a number.";
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(Password)) newErrors.Password = "Password must contain a special character.";
=======
      // ---- Your API login logic here ----
      api.post("/users/login", { email: Email, password: Password })
        .then(response => {
          const { token, user } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          setIsLoggedIn(true);
          navigate("/");
        })
        .catch(error => {
          console.error("Login failed:", error);
        });
    } else {
      if (Password !== ConfirmPassword) {
        console.log("Passwords Don't Match!");
        return;
>>>>>>> Stashed changes
      }

      if (ConfirmPassword && Password !== ConfirmPassword)
        newErrors.ConfirmPassword = "Passwords do not match.";
    } else {
      // Login validation (optional: only check if identifier and password exist)
      if (!Email) newErrors.Email = "Username or email is required.";
      if (!Password) newErrors.Password = "Password is required.";
    }

<<<<<<< Updated upstream
    SetErrors(newErrors);
  }, [Name, Email, Password, ConfirmPassword, islogin]);



  const HandleSubmit = async (e) => {
    e.preventDefault();
    SetBackendError("");

    if (Object.keys(errors).length > 0) return; // Don't submit if errors

    try {
      if (islogin) {
        const response = await api.post("/users/login", { identifier: Email, password: Password });
        const { token, user } = response.data;
        login(token, user);
        navigate("/");
      } else {
        const response = await api.post("/users/signup", {
          name: Name,
          email: Email,
          password: Password,
          confirmPassword: ConfirmPassword
=======

      api.post("/users/signup", { email: Email, password: Password,confirmPassword:ConfirmPassword,role:"user",name: Email.split('@')[0] })
        .then(response => {
          console.log("Signup successful:", response.data);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setIsLoggedIn(true);
          SetIsLogin(true);
          navigate("/");
        })
        .catch(error => {
          console.error("Signup failed:", error);
>>>>>>> Stashed changes
        });
        const { token, user } = response.data;
        login(token, user);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data?.message && islogin) {
        SetBackendError("Incorrect email or password");
      } else if (error.response && error.response.data?.message && !islogin) {
        if (error.response.data.message === "Username already exists") {
          SetErrors({ Name: "Username already exists" });
        } else if (error.response.data.message === "Email already exists") {
          SetErrors({ Email: "Email already exists" });
        } else{
          SetBackendError(error.response.data.message);
        }
      } else {
        SetBackendError("Something went wrong. Please try again.");
      }
    }
  };

  // Determine if form is valid
  const isFormValid = Object.keys(errors).length === 0 &&
    Email && Password &&
    (islogin || (Name && ConfirmPassword));

  return (
    <div className="Overlay">
      <div className="LoginCard">
        <h1>{islogin ? "Log In" : "Sign Up"}</h1>

        <form key={mode} onSubmit={HandleSubmit} className="Login_Signup">

          <div className="OtherLogins">
            <button type="button" className="LoginButtons">Continue With Google</button>
            <button type="button" className="LoginButtons">Email me a one-time link</button>
          </div>

          <span className="ORSeparator">OR</span>

          {!islogin && (
            <div className="FormInputs">
              <input
                type="text"
                placeholder="Username"
                value={Name}
                onChange={(e) => SetName(e.target.value)}
                className={errors.Name ? "inputError" : ""}
              />
              {errors.Name && <small className="errorText">{errors.Name}</small>}
            </div>
          )}

          <div className="FormInputs">
            <input
              type="text"
              placeholder={"Email" + (islogin ? " or Username" : "")}
              value={Email}
              onChange={(e) => SetEmail(e.target.value)}
              className={errors.Email ? "inputError" : ""}
            />
            {errors.Email && <small className="errorText">{errors.Email}</small>}
          </div>

          <div className="FormInputs">
            <input
              type="password"
              placeholder="Password"
              value={Password}
              onChange={(e) => SetPassword(e.target.value)}
              className={errors.Password ? "inputError" : ""}
            />
            {errors.Password && <small className="errorText">{errors.Password}</small>}
          </div>

          {!islogin && (
            <div className="FormInputs">
              <input
                type="password"
                placeholder="Confirm Password"
                value={ConfirmPassword}
                onChange={(e) => SetConfirmPassword(e.target.value)}
                className={errors.ConfirmPassword ? "inputError" : ""}
              />
              {errors.ConfirmPassword && <small className="errorText">{errors.ConfirmPassword}</small>}
            </div>
          )}

          {backendError && <p className="errorText">{backendError}</p>}

          <div className="forgotandnewtoreddit">
            {islogin && (
              <button type="button" className="Forgot_Password newtoreddit">
                Forgot Password?
              </button>
            )}

            {islogin && (
              <p>
                New to Reddit?{" "}
                <button type="button" className="newtoreddit" onClick={() => navigate("/login?mode=signup")}>
                  Sign Up
                </button>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="SubmitButton"
          >
            {islogin ? "Log In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login_Signup;
