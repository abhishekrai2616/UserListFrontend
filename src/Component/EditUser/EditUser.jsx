import { useState, useEffect } from 'react';
import './EditUser.css'; // Add styling for the modal

const EditUser = ({ isVisible, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    position: '',
    country: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNo: user.phoneNo || '',
        position: user.position || '',
        country: user.country || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Phone No:
            <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required />
          </label>
          <label>
            Position:
            <input type="text" name="position" value={formData.position} onChange={handleChange} required />
          </label>
          <label>
            Country:
            <input type="text" name="country" value={formData.country} onChange={handleChange} required />
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

export default EditUser;
