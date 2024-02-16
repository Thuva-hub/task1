// Staff.js

import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import './Staff.css';

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    due_date: Yup.date().required('Due date is required'),
    state: Yup.string().required('State is required')
});

const Staff = () => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        state: ''
    });
    const [errors, setErrors] = useState([]);
    const [staff, setStaff] = useState([]);

    const handleClose = () => {
        setShow(false);
        setErrors({});
    };

    const handleShow = () => setShow(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchema.validate(formData, { abortEarly: false });

            const response = await axios.post('http://localhost:5000/api/v3/create', formData);
            if (response.data.success) {
                toast.success('Data saved successfully.', { autoClose: 3000 });
                handleClose();
                setFormData({
                    title: '',
                    description: '',
                    due_date: '',
                    state: ''
                });
                getallstaff();
            }
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

    const getallstaff = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v3/allStaff');
            if (!response) {
                console.log('No data');
            } else {
                setStaff(response.data.Staff);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getallstaff();
    }, []);

    async function deleteData(id) {
        try {
            await axios.delete(`http://localhost:5000/api/v3/delete/${id}`);
            alert('Data deleted successfully');
            getallstaff();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container">
            <div className="content-area">
                <h2 className="table-title">Task Detail</h2>
                <div className="table-header">
                    <Button variant="primary" onClick={handleShow}>
                        Add New Task Detail
                    </Button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create New Task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="title">
                                    <Form.Control
                                        type="text"
                                        placeholder="Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.title}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="description">
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
                                <Form.Group className="mb-3" controlId="state">
                                    <Form.Control
                                        type="text"
                                        placeholder="State"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.state}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSubmit} type="submit">
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <div className="search-bar">
                        <input type="text" placeholder="Search..." />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Due Date</th>
                            <th>State</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.title}</td>
                                <td>{item.description}</td>
                                <td>{item.due_date}</td>
                                <td>{item.state}</td>
                                <td>
                                    <button onClick={() => deleteData(item._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Staff;
