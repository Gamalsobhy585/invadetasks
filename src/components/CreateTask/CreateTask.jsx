import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Joi from 'joi';

export default function CreateTask() {
  const [task, setTask] = useState({
    user_id: 1, 
    title: '',
    description: '',
    status: 'pending',
    due_date: '',
    category_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories');
      console.log('Fetched categories:', response.data.data);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const schema = Joi.object({
    user_id: Joi.number().required(), // Ensuring it's a number
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(5).max(255).allow(''),
    status: Joi.string().valid('pending', 'completed').required(),
    due_date: Joi.date().allow(''),
    category_id: Joi.number().required()
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting task:', task);
    const { error } = schema.validate(task, { abortEarly: false });
    if (error) {
      const validationErrors = {};
      error.details.forEach(detail => {
        validationErrors[detail.path[0]] = detail.message;
      });
      console.log('Validation errors:', validationErrors);
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/tasks', task, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response.data);
      navigate('/tasks');
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        setErrors({ form: 'Failed to create task. Please check the form data.' });
      } else {
        console.error('Error message:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Create a New Task</title>
      </Helmet>
      <div className="container mt-5">
        <h1>Create a New Task</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
            {errors.title && <small className="text-danger">{errors.title}</small>}
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Enter task description"
            />
            {errors.description && <small className="text-danger">{errors.description}</small>}
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              className="form-select"
              id="status"
              name="status"
              value={task.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && <small className="text-danger">{errors.status}</small>}
          </div>
          <div className="mb-3">
            <label htmlFor="due_date" className="form-label">Due Date</label>
            <input
              type="date"
              className="form-control"
              id="due_date"
              name="due_date"
              value={task.due_date}
              onChange={handleChange}
            />
            {errors.due_date && <small className="text-danger">{errors.due_date}</small>}
          </div>
          <div className="mb-3">
            <label htmlFor="category_id" className="form-label">Category</label>
            <select
              className="form-select"
              id="category_id"
              name="category_id"
              value={task.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <small className="text-danger">{errors.category_id}</small>}
          </div>
          <button type="submit" className="btn invadebtn" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Create Task'}
          </button>
        </form>
      </div>
    </>
  );
}
