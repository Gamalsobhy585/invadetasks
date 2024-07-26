import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EditTask() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({
        title: '',
        description: '',
        status: '',
        due_date: '',
        category_id: '',
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchTask();
        fetchCategories();
    }, []);

    const fetchTask = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get(`http://localhost:8000/api/tasks/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTask(response.data.data);
        } catch (error) {
            console.error('Error fetching task:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get('http://localhost:8000/api/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prevTask) => ({ ...prevTask, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            await axios.put(`http://localhost:8000/api/tasks/${id}`, task, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Task updated successfully');
            navigate('/tasks');
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error('Error updating task');
        }
    };
    return (
        <div className="container">
            <h2>Edit Task</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={task.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" name="description" value={task.description} onChange={handleChange}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select className="form-control" id="status" name="status" value={task.status} onChange={handleChange} required>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="due_date" className="form-label">Due Date</label>
                    <input type="date" className="form-control" id="due_date" name="due_date" value={task.due_date} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="category_id" className="form-label">Category</label>
                    <select className="form-control" id="category_id" name="category_id" value={task.category_id} onChange={handleChange} required>
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Update Task</button>
            </form>
        </div>
    );
}
