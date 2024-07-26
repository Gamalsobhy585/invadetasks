import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateTask from './components/CreateTask/CreateTask';
import EditTask from './components/EditTask/EditTask';
import CategoryList from './components/CategoryList/CategoryList.jsx';
import NotFound from './components/NotFound/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Offline } from 'react-detect-offline';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';


function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('userToken')) {
      saveUserData();
    }
  }, []);

  function saveUserData() {
    let token = localStorage.getItem('userToken');
    if (token) {
      setUserData({ token });
    }
  }

  const logOut = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.post('http://localhost:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      localStorage.removeItem('userToken');
      setUserData(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };



  const routers = createBrowserRouter([
    {
      path: '/',
      element: <Layout setUserData={setUserData} userData={userData} logOut={logOut} />,
      children: [
        { index: true, element: <PublicRoute userData={userData}><Register /></PublicRoute> },
        { path: 'login', element: <PublicRoute userData={userData}><Login saveUserData={saveUserData} /></PublicRoute> },
        { path: 'tasks', element: <ProtectedRoute userData={userData}><Home /></ProtectedRoute> },
        { path: 'categories', element: <ProtectedRoute userData={userData}><CategoryList /></ProtectedRoute> },
        { path: 'create-task', element: <ProtectedRoute userData={userData}><CreateTask /></ProtectedRoute> },
        { path: 'edit-task/:id', element: <ProtectedRoute userData={userData}><EditTask /></ProtectedRoute> },
      ]
    },
    { path: '*', element: <NotFound /> }
  ]);

  return (
    <>
      <div className="App">
        <ToastContainer />
      </div>
      <Offline><div className='offline'>You are offline</div></Offline>
      <RouterProvider router={routers} />
    </>
  );
}

export default App;
