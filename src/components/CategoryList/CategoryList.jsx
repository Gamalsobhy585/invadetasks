import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('userToken');

        const response = await axios.get('http://localhost:8000/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Set the categories data
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);



  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Categories</title>
      </Helmet>
      <div className="container mt-3">
        <div className="row">
          {categories.map(category => (
            <div key={category.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className="card h-100 border-1 border-black bg-transparent">
                <div className="img-container">
                  <img 
                    src={category.image} 
                    className="card-img-top img-fluid" 
                    alt={category.name} 
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{category.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </>
  );
}
