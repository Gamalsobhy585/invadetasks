import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchDescription, setSearchDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('');
    const [paginationData, setPaginationData] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async (url = 'http://localhost:8000/api/tasks') => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTasks(response.data.data);
            setFilteredTasks(response.data.data);
            setPaginationData(response.data.meta);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleSearchTitle = (e) => {
        setSearchTitle(e.target.value);
        filterTasks(e.target.value, searchDescription, dueDate, status);
    };

    const handleSearchDescription = (e) => {
        setSearchDescription(e.target.value);
        filterTasks(searchTitle, e.target.value, dueDate, status);
    };

    const handleDueDateChange = (e) => {
        setDueDate(e.target.value);
        filterTasks(searchTitle, searchDescription, e.target.value, status);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        filterTasks(searchTitle, searchDescription, dueDate, e.target.value);
    };

    const filterTasks = (title, description, dueDate, status) => {
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

        if (dueDate) {
            filtered = filtered.filter(task =>
                new Date(task.due_date) <= new Date(dueDate)
            );
        }

        if (status) {
            filtered = filtered.filter(task =>
                task.status.toLowerCase() === status.toLowerCase()
            );
        }

        setFilteredTasks(filtered);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.delete(`http://localhost:8000/api/tasks/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchTasks();
            toast(
                <div>
                    <span className='task-deleted' >Task deleted successfully</span>
                    <button className='handle-restore' onClick={() => handleRestore(id)} >
                        Restore
                    </button>
                </div>,
                {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false, // Show the progress bar
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    style: {
                        background: 'linear-gradient(to right, #ff5f6d, #ffc371)',
                        color: 'white'
                    }
                }
            );
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Error deleting task');
        }
    };

    const handleRestore = async (id) => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.post(`http://localhost:8000/api/tasks/${id}/restore`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success(
                <div className='task-deleted'>Task restored successfully</div>,
                {
                    position: "bottom-right",
                    autoClose: 2000, 
                    hideProgressBar: false, 
                    style: {
                        background: 'linear-gradient(to right, #00b09b, #96c93d)',
                        color: 'white'
                    }
                }
            );
            fetchTasks();
        } catch (error) {
            console.error('Error restoring task:', error);
            toast.error('Error restoring task');
        }
    };

    const handlePageChange = (url) => {
        fetchTasks(url);
    };

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Tasks</title>
            </Helmet>
            <div className="container  my-5">
                <div className="row mb-3">
                <div className="col-md-3 col-6">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Search by title"
                        value={searchTitle}
                        onChange={handleSearchTitle}
                    />
                    </div>
                    <div className="col-md-3 col-6">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Search by description"
                        value={searchDescription}
                        onChange={handleSearchDescription}
                    />
</div>
<div className="col-md-3 col-6">
<input
                        type="date"
                        className="form-control me-2"
                        value={dueDate}
                        onChange={handleDueDateChange}
                    />
</div>

<div className="col-md-3 col-6">
<select
                        className="form-control"
                        value={status}
                        onChange={handleStatusChange}
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
</div>

                
                  
                
                </div>
         
                <div className="table-responsive mb-3 table-active">
                    <table className="table">
                        <thead id="table-header" className="table-header">
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Due Date</th>
                                <th>Category</th>
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
                                    <td>{task.category ? task.category.name : 'No Category'}</td>
                                    <td>
                                        <Link to={`/edit-task/${task.id}`} className="btn btn-edit me-2">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="btn btn-delete me-2"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleRestore(task.id)}
                                            className="btn btn-restore"
                                        >
                                            Restore
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <nav id='nav-paginataion' aria-label="Page nav-paginataion navigation">
                    <ul className="pagination justify-content-center">
                        {paginationData && paginationData.prev_page_url && (
                            <li className="page-item">
                                <button className="page-link me-5" onClick={() => handlePageChange(paginationData.prev_page_url)}>
                                    Previous
                                </button>
                            </li>
                        )}
                        {paginationData && paginationData.next_page_url && (
                            <li className="page-item">
                                <button className="page-link" onClick={() => handlePageChange(paginationData.next_page_url)}>
                                    Next
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </>
    );
}
