import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchDescription, setSearchDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks');
      setTasks(response.data.data);
      setFilteredTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSearchTitle = (e) => {
    setSearchTitle(e.target.value);
    filterTasks(e.target.value, searchDescription);
  };

  const handleSearchDescription = (e) => {
    setSearchDescription(e.target.value);
    filterTasks(searchTitle, e.target.value);
  };

  const filterTasks = (title, description) => {
    let filtered = tasks;

    if (title) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    if (description) {
      filtered = filtered.filter(task =>
        task.description.toLowerCase().includes(description.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Tasks</title>
      </Helmet>
      <div className="container my-5">
        <div className="d-flex justify-content-end mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by title"
            value={searchTitle}
            onChange={handleSearchTitle}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search by description"
            value={searchDescription}
            onChange={handleSearchDescription}
          />
        </div>
        <div className="table-responsive mb-3 table-active">
          <table className="table">
            <thead id="table-header" className="table-header">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.status}</td>
                  <td>{task.due_date}</td>
                  <td>
                    <Link to={`/task/${task.id}`} className="btn btn-success me-2">Show</Link>
                    <Link to={`/task/${task.id}/edit`} className="btn btn-primary me-2">Edit</Link>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
    );
  }