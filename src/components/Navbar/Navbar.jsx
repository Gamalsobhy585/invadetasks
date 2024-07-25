import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ userData, logOut }) {
  return (
    <nav className='p-2 d-flex nav justify-content-between align-items-center'>
      <div className="left-nav d-flex align-items-center">
        <h1 className='m-0 pe-3 h4'>
          <Link className='text-decoration-none' to='/'>
            <img className='inavde-logo' src={'/INVADE_logo.png'} alt="Invade Tasks  Logo" style={{ height: '40px', marginRight: '10px' }} />
          </Link>
        </h1>
      </div>
      <div className="right-nav d-flex align-items-center">
        {userData ? (
          <ul className='list-unstyled d-flex m-0 align-items-center'>
            <li className='px-2'>
              <Link className='text-decoration-none link' to='/tasks'>Tasks</Link>
            </li>
            <li className='px-2'>
              <Link className='text-decoration-none link' to='/categories'>Categories</Link>
            </li>
            <li className='px-2'>
              <Link className='text-decoration-none link' to='/create-task'>Create a New Task</Link>
            </li>
            <li className='px-2 logout-button cursor-pointer' onClick={logOut}>
              <span className='link'>Logout</span>
            </li>
          </ul>
        ) : (
          <ul className='list-unstyled d-flex m-0 align-items-center'>
            <li className='px-2'>
              <Link className='text-decoration-none link' to='/login'>Login</Link>
            </li>
            <li className='px-2'>
              <Link className='text-decoration-none link' to='/'>Register</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
