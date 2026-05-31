import "./Register.css";
import { useState } from "react";
function Register() {
  const [userExist, setExist] = useState(false);
  let [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  function displayDetails(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }
  async function registerDetails() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
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
        setExist(true);
        setForm({
          username: "",
          email: "",
          password: "",
        });
        return;
      }
      setForm({
        username: "",
        email: "",
        password: "",
      });
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <div className="body">
        <div className="form">
          <h1 style={{ color: userExist ? "red" : "black" }}>
            {userExist
              ? "User already Exists! Please Login!"
              : "Hello! Please Register!"}
          </h1>
          <label htmlFor="username">Enter Your Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter Username"
            onChange={displayDetails}
            value={form.username}
          />
          <br />
          <br />
          <label htmlFor="email">Enter Your Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={displayDetails}
            value={form.email}
          />
          <br />
          <br />
          <label htmlFor="password">Enter Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={displayDetails}
            value={form.password}
          />
          <br />
          <br />
          <p>
            Already Have An Account?<a href="/login">Login Here!</a>
          </p>
          <button type="submit" onClick={registerDetails}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
export default Register;
