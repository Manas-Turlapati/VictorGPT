import "./Login.css";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  let [loginform, setloginForm] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function displayDetails(e) {
    setloginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function loginDetails(e) {
    e.preventDefault();
    if (loginform.username === "" || loginform.password === "") {
      toast.error("Please fill in both fields");
      return;
    }
    
    // MOCK LOGIN FOR TESTING
    if (loginform.username === "test" && loginform.password === "Test123") {
      localStorage.setItem("token", "mock-token-123");
      localStorage.setItem("username", "test");
      toast.success("Welcome back! (Mock Mode)");
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
      return;
    }

    setIsSubmitting(true);
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
      if (!data.token) {
        toast.error("Username or Password is incorrect!");
        setloginForm({
          username: "",
          password: "",
        });
        setIsSubmitting(false);
        return;
      }
      
      localStorage.setItem("token", data.token); 
      localStorage.setItem("username", data.username); 
      toast.success("Welcome back!");
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } catch (err) {
      console.log(err);
      toast.error("Cannot connect to server. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="body">
        <form className="login-form" onSubmit={loginDetails}>
          <h1>Welcome back! Please Login!</h1>
          <label htmlFor="username">Enter Your Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter Username"
            value={loginform.username}
            onChange={displayDetails}
          />
          <label htmlFor="password">Enter Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter Password"
            value={loginform.password}
            onChange={displayDetails}
          />
          <p>
            New User? <Link to="/register">Register Here!</Link>
          </p>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
