import { useState,useEffect } from 'react';
import './AddUser.css'; // Add styling for the modal

const UserModal = ({ isVisible, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    position: '',
    country: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phoneNo: '',
    position: '',
    country: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phoneNo) newErrors.phoneNo = 'Phone number is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.country) newErrors.country = 'Country is required';
    return newErrors;
  };

  useEffect(() => {
    if (isVisible) {
      // Reset form data when the modal becomes visible
      setFormData({
        name: '',
        email:  '',
        phoneNo: '',
        position: '',
        country:  ''
      });
      setErrors({});
    }
  }, [isVisible]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      onSave(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </label>
          <label>
            Email:
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </label>
          <label>
            Phone No:
            <input 
              type="tel" 
              name="phoneNo" 
              value={formData.phoneNo} 
              onChange={handleChange} 
              required 
            />
            {errors.phoneNo && <span className="error">{errors.phoneNo}</span>}
          </label>
          <label>
            Position:
            <input 
              type="text" 
              name="position" 
              value={formData.position} 
              onChange={handleChange} 
              required 
            />
            {errors.position && <span className="error">{errors.position}</span>}
          </label>
          <label>
            Country:
            <input 
              type="text" 
              name="country" 
              value={formData.country} 
              onChange={handleChange} 
              required 
            />
            {errors.country && <span className="error">{errors.country}</span>}
          </label>
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
