import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Login({ saveUserData }) {
  let navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  function getUserData(eventinfo) {
    let myUser = { ...user };
    myUser[eventinfo.target.name] = eventinfo.target.value;
    setUser(myUser);
  }

  async function sendingLoginDataToApi() {
    try {
      let { data } = await axios.post(`http://localhost:8000/api/login`, user);
      console.log(data);

      if (data.status === 200) {
        setIsLoading(false);
        localStorage.setItem('userToken', data.token);
        navigate("/home");
      } else if (data.status === 422) {
        setIsLoading(false);
        setError("Credentials not correct");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("API request failed:", error);
      setError("An error occurred. Please try again.");
    }
  }

  function submitLoginForm(e) {
    e.preventDefault();
    setIsLoading(true);

    let validation = validateLoginForm();
    if (validation.error) {
      setIsLoading(false);
      let errors = {};
      validation.error.details.forEach((error) => {
        errors[error.path[0]] = error.message;
      });
      setFieldErrors(errors);
    } else {
      sendingLoginDataToApi();
    }
  }

  function validateLoginForm() {
    let schema = Joi.object({
      email: Joi.string().email({ tlds: { allow: ['com', 'net'] } }).required().messages({
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
        <title>Login To InvadeTasks</title>
      </Helmet>

      <form className="mt-3 p-4" onSubmit={submitLoginForm} action="">
        <label htmlFor="email">Email</label>
        <input
          onChange={getUserData}
          type="email"
          className='form-control bg-white my-input my-2'
          name='email'
          id='email'
          value={user.email}
        />
        {fieldErrors.email && <div className="alert alert-danger text-white">{fieldErrors.email}</div>}

        <label htmlFor="password">Password</label>
        <input
          onChange={getUserData}
          type="password"
          className='form-control bg-white my-input my-2'
          name='password'
          id='password'
          value={user.password}
        />
        {fieldErrors.password && <div className="alert alert-danger text-white">{fieldErrors.password}</div>}

        <button className='btn loginbtn' disabled={isLoading}>
          {isLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Login'}
        </button>

        {error.length > 0 && <div className="alert alert-danger text-white my-2">{error}</div>}
      </form>
    </>
  );
}
