import "./Login.css";
import toast from "react-hot-toast";
import { useState } from "react";
function Login() {
  let [loginform, setloginForm] = useState({
    username: "",
    password: "",
  });
  function displayDetails(e) {
    setloginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }
  async function loginDetails() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: loginform.username,
            password: loginform.password,
          }),
        },
      );
      const data = await res.json();
      //got the token and username store them in local storage
      if(!data.token){
        toast.error("Username or Password is incorrect!");
        setloginForm({
          username: "",
          password: "",
        });
        return;
      }
      localStorage.setItem("token", data.token); // ← add this
      localStorage.setItem("username", data.username); // ← add this
      toast.success("Welcome back!");
      setTimeout(() => {
        window.location.href = "/chat";
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <div className="body">
        <div className="login-form">
          <h1>
            Welcome back!Please Login!
          </h1>
          <label htmlFor="username">Enter Your Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter Username"
            value={loginform.username}
            onChange={displayDetails}
          />
          <br />
          <br />
          <br />
          <label htmlFor="password">Enter Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter Password"
            value={loginform.password}
            onChange={displayDetails}
          />
          <br />
          <br />
          <p>
            New User? <a href="/register">Register Here!</a>
          </p>
          <button type="submit" onClick={loginDetails}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
export default Login;
