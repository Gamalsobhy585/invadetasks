import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
import { Helmet } from "react-helmet";

export default function Register() {
  let navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  function getUSerData(eventinfo) {
    let myUser = { ...user };
    myUser[eventinfo.target.name] = eventinfo.target.value;
    setUser(myUser);
  }

  async function sendingRegisterDataToApi() {
    try {
      let { data } = await axios.post(`http://localhost:8000/api/register`, user);
      if (data.message === "Registration successful") {
        setIsLoading(false);
        navigate("/login");
      } else {
        setIsLoading(false);
        setError(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      setError("Something went wrong. Please try again later.");
    }
  }

  function saveUserDataToLocalStorage() {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    storedUsers.push({ name: user.name, email: user.email });
    localStorage.setItem("users", JSON.stringify(storedUsers));
  }

  function submitRegisterForm(e) {
    e.preventDefault();
    setIsLoading(true);

    let validation = validateRegisterForm();
    if (validation.error) {
      setIsLoading(false);
      let errors = {};
      validation.error.details.forEach((error) => {
        errors[error.path[0]] = error.message;
      });
      setFieldErrors(errors);
    } else {
      sendingRegisterDataToApi();
      saveUserDataToLocalStorage();
    }
  }

  function validateRegisterForm() {
    let schema = Joi.object({
      name: Joi.string().pattern(/^[A-Za-z0-9]{2,10}$/).required().messages({
        'string.pattern.base': 'Username must be 2-10 characters long and can only contain letters and numbers.',
      }),
      email: Joi.string().email({ tlds: { allow: ["com", "net"] } }).required().messages({
        'string.email': 'Please enter a valid email address.',
      }),
      password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required().messages({
        'string.pattern.base': 'Password must be at least 8 characters long and contain at least one letter and one number. Example: Pass1234',
      }),
    });
  
    return schema.validate(user, { abortEarly: false });
  }
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Register To InvadeTasks</title>
      </Helmet>

      <form className="m-3 p-4" onSubmit={submitRegisterForm} action="">
        <label htmlFor="name">UserName</label>
        <input onChange={getUSerData} type="text" className="form-control my-input bg-white my-2" name="name" id="name" />
        {fieldErrors.name && <div className="alert alert-danger text-black">{fieldErrors.name}</div>}

        <label htmlFor="email">Email</label>
        <input onChange={getUSerData} type="email" className="form-control my-input bg-white my-2" name="email" id="email" />
        {fieldErrors.email && <div className="alert alert-danger text-black">{fieldErrors.email}</div>}

        <label htmlFor="password">Password</label>
        <input onChange={getUSerData} type="password" className="form-control my-input bg-white my-2" name="password" id="password" />
        {fieldErrors.password && <div className="alert alert-danger text-black">{fieldErrors.password}</div>}

    
        <button className="btn reg-button" disabled={isLoading}>
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Register"}
        </button>

        {error && <p className="text-danger mt-2">{error}</p>}
      </form>
    </>
  );
}
