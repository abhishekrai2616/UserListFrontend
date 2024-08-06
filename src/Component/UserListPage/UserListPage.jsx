import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faFileExport, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddUser from '../AddUser/AddUser';
import EditUser from '../EditUser/EditUser';
import './UserListPage.css';
import { message } from '../message'; 
import { ToastContainer } from 'react-toastify';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/User');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.failure('Failed to fetch users');
    }
  };

  const handleAddUser = () => {
    setIsAddModalVisible(true);
  };

  const handleExportUsers = () => {
    const headers = ['Name', 'Position', 'Country', 'Status'];
    const rows = users.map(user => [
      user.name,
      user.position,
      user.country,
      user.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'users.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsEditModalVisible(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`http://localhost:3000/User/${id}`, {
        method: 'DELETE'
      });
      setUsers(users.filter(user => user._id !== id));
      message.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      message.failure('Failed to delete user');
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:3000/User', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const newUser = await response.json();
        setUsers([...users, newUser]);
        setIsAddModalVisible(false);
        message.success('User added successfully');
      } else {
        console.error('Failed to add user');
        message.failure('Failed to add user');
      }
    } catch (error) {
      console.error('Error:', error);
      message.failure('Error adding user');
    }
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:3000/User/${updatedData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user => user._id === updatedUser._id ? updatedUser : user));
        setIsEditModalVisible(false);
        setCurrentUser(null);
        message.success('User updated successfully');
      } else {
        console.error('Failed to update user');
        message.failure('Failed to update user');
      }
    } catch (error) {
      console.error('Error:', error);
      message.failure('Error updating user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-list-page">
      <header>
        <input 
          type="text" 
          placeholder="Search users..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <button>
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <button onClick={handleAddUser}>
          <FontAwesomeIcon icon={faUserPlus} />
        </button>
        <button onClick={handleExportUsers}>
          <FontAwesomeIcon icon={faFileExport} />
        </button>
      </header>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Country</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.position}</td>
              <td>{user.country}</td>
              <td>{user.status}</td>
              <td className='action-icons'>
                <button onClick={() => handleEditUser(user)}>
                  <span>Edit</span>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDeleteUser(user._id)}>
                  <span>Delete</span>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddUser
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSave={handleSaveUser}
      />

      <EditUser
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleUpdateUser}
        user={currentUser}
      />

      <ToastContainer />
    </div>
  );
};

export default UserListPage;
