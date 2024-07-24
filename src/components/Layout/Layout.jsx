import React from 'react';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout({ userData, setUserData, logOut }) {
  return (
    <>
      <Navbar logOut={logOut} userData={userData} />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
}
