import './Register.css'
import {useState} from 'react';
function Register(){
    let [form,setForm] = useState({
      username:"",
      email:"",
      password:""
    });
    function displayDetails(e){
      setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
    async function registerDetails(){
      try {
        const res = await fetch("http://localhost:8080/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username:form.username,
            email:form.email,
            password:form.password
          }),
        });
        const data = await res.json();
        setForm({
          username:"",
          email:"",
          password:""
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
            <h1>Hello! Please Register Here!</h1>
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
            <p>Already Have An Account?<a href="/login">Login Here!</a></p>
            <button type="submit" onClick={registerDetails}>
              Submit
            </button>
          </div>
        </div>
      </>
    );
}
export default Register;