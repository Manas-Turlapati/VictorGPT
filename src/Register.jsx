import "./Register.css";
import valid from "validator";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  let [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function displayDetails(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function registerDetails(e) {
    e.preventDefault();
    if (form.username === "" || form.email === "" || form.password === "") {
      toast.error("Please Fill All The Details");
      return;
    }
    if (!valid.isEmail(form.email)) {
      toast.error("This email is not valid");
      return;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(form.password)) {
      toast.error("Password must be at least 6 characters, with 1 uppercase and 1 lowercase letter!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            email: form.email,
            password: form.password,
          }),
        },
      );
      
      const data = await res.json();
      if (!res.ok) {
        toast.error("User already exists! Try logging in");
        setForm({
          username: "",
          email: "",
          password: "",
        });
        setIsSubmitting(false);
        return;
      }
      
      setForm({
        username: "",
        email: "",
        password: "",
      });
      toast.success("Registered Successfully!");
      setTimeout(() => {
        navigate("/login");
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
        <form className="form" onSubmit={registerDetails}>
          <h1>Hello! Please Register!</h1>
          <label htmlFor="username">Enter Your Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter Username"
            onChange={displayDetails}
            value={form.username}
          />
          <label htmlFor="email">Enter Your Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={displayDetails}
            value={form.email}
          />
          <label htmlFor="password">Enter Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={displayDetails}
            value={form.password}
          />
          <p>
            Already Have An Account? <Link to="/login">Login Here!</Link>
          </p>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
