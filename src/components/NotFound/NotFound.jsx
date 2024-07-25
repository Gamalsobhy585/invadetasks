import React from 'react'
import { Helmet } from 'react-helmet';

export default function NotFound() {
  return (
    <>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Momentum Store</title>
        <link rel="shortcut icon" href="/Momentum_Logo.png" type="image/x-icon" />
        <link rel="shortcut icon" href="/images.png" type="image/x-icon" />
      </Helmet>
    <div className="not-found-container text-center d-flex flex-column align-items-center justify-content-center mt-5 pt-5">
      <img src="404.jpg" alt="Not Found" className="not-found-image rounded-2 img-fluid" />
      <h1 className="mt-4">Page Not Found</h1>
      <p className="mt-2">Sorry, the page you are looking for does not exist.</p>
    </div>
  </>
  )
}
