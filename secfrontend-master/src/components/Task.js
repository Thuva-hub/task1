import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import * as Yup from 'yup';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Task.css';

const Task = () => {
    // State variables
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        status: ''
    });
    const [errors, setErrors] = useState({});
    const [tasks, setTasks] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    // Form validation schema
    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        due_date: Yup.date().required('Due date is required'),
        status: Yup.string().required('State is required')
    });

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    };

    // Format date for input field
    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Get all tasks
    const getAllTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/task');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            if (selectedTaskId) {
                await axios.put(`http://localhost:5001/api/task/${selectedTaskId}`, formData);
                toast.success('Task updated successfully.');
            } else {
                await axios.post('http://localhost:5001/api/task', formData);
                toast.success('Task created successfully.');
            }
            resetForm();
            getAllTasks();
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const newErrors = {};
                error.inner.forEach((validationError) => {
                    newErrors[validationError.path] = validationError.message;
                });
                setErrors(newErrors);
            } else {
                console.error('Error saving data:', error);
            }
        }
    };

    // Reset form fields and selected task ID
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            due_date: '',
            status: ''
        });
        setSelectedTaskId(null);
    };

    // Handle editing a task
    const handleEdit = (task) => {
        const { title, description, due_date, status, _id } = task;
        setFormData({
            title,
            description,
            due_date: formatDateForInput(due_date),
            status,
        });
        setSelectedTaskId(_id);
    };

    // Handle filtering tasks
    const handleFilter = async (filterStatus) => {
        try {
            setFilterStatus(filterStatus);
            const response = await axios.get(filterStatus ? `http://localhost:5001/api/task/${filterStatus}` : 'http://localhost:5001/api/task');
            setTasks(response.data);
        } catch (error) {
            console.error('Error filtering tasks:', error);
        }
    };

    // Handle deleting a task
    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5001/api/task/${taskId}`);
            toast.success('Task deleted successfully.');
            getAllTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Fetch tasks on component mount
    useEffect(() => {
        getAllTasks();
    }, []);

    // JSX
    return (
        <div className="container">
            <div className="TaskContainer">
                <div className='content-area'>
                    <div className="table-header">
                        <h2 className="table-title">Task Detail</h2>
                        <Form onSubmit={handleSubmit} className='form'>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.title}
                                    className='inputbox'
                                />
                                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.description}
                                />
                                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="due_date">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Due Date"
                                    name="due_date"
                                    value={formData.due_date}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.due_date}
                                />
                                <Form.Control.Feedback type="invalid">{errors.due_date}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="status">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.status}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                {selectedTaskId ? 'Update Task' : 'Create Task'}
                            </Button>
                        </Form>
                    </div>
                </div>
                <div className='TaskDetail'>
                    <div className='table-top'>
                        {selectedTaskId && <Button variant="primary" onClick={resetForm}>Create New Task</Button>}
                    </div>
                    <Form onSubmit={handleSubmit} className='form'>
                        <Form.Group className="mb-3" controlId="filterStatus">
                            <Form.Label>Filter by Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="filterStatus"
                                value={filterStatus}
                                onChange={(e) => handleFilter(e.target.value)}
                            >
                                <option value="">All Tasks</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>{item.due_date}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <Button variant="info" onClick={() => handleEdit(item)} style={{ marginRight: '5px' }}>Edit</Button>
                                        <Button variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Task;
