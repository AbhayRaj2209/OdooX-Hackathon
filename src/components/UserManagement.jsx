import React, { useState } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@company.com',
      role: 'Employee',
      manager: 'Jane Smith',
      department: 'Engineering',
      status: 'Active',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@company.com',
      role: 'Manager',
      manager: 'Admin User',
      department: 'Engineering',
      status: 'Active',
      joinDate: '2023-08-20'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'Employee',
      manager: 'Jane Smith',
      department: 'Marketing',
      status: 'Active',
      joinDate: '2024-03-10'
    }
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Employee',
    manager: '',
    department: '',
    password: ''
  });

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.password) {
      const user = {
        id: users.length + 1,
        ...newUser,
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, user]);
      setNewUser({
        name: '',
        email: '',
        role: 'Employee',
        manager: '',
        department: '',
        password: ''
      });
      setShowAddUserModal(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddUserModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...newUser } : user
      ));
      setEditingUser(null);
      setNewUser({
        name: '',
        email: '',
        role: 'Employee',
        manager: '',
        department: '',
        password: ''
      });
      setShowAddUserModal(false);
    }
  };

  const managers = users.filter(user => user.role === 'Manager');

  return (
    <div className="user-management">
      <div className="section-header">
        <div className="header-content">
          <h2>User Management</h2>
          <p>Manage employees, managers, and their roles</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowAddUserModal(true)}
        >
          <span className="btn-icon">+</span>
          Add User
        </button>
      </div>

      {/* User Statistics */}
      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍💼</div>
          <div className="stat-info">
            <h3>{users.filter(u => u.role === 'Manager').length}</h3>
            <p>Managers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍💻</div>
          <div className="stat-info">
            <h3>{users.filter(u => u.role === 'Employee').length}</h3>
            <p>Employees</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{users.filter(u => u.status === 'Active').length}</h3>
            <p>Active Users</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <div className="table-header">
          <div className="table-title">All Users</div>
          <div className="table-filters">
            <select className="filter-select">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Employee</option>
            </select>
            <select className="filter-select">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>HR</option>
            </select>
          </div>
        </div>

        <div className="users-table">
          <div className="table-row header">
            <div className="col-name">Name</div>
            <div className="col-email">Email</div>
            <div className="col-role">Role</div>
            <div className="col-manager">Manager</div>
            <div className="col-department">Department</div>
            <div className="col-status">Status</div>
            <div className="col-actions">Actions</div>
          </div>

          {users.map(user => (
            <div key={user.id} className="table-row">
              <div className="col-name">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="user-name">{user.name}</div>
                    <div className="user-join-date">Joined {user.joinDate}</div>
                  </div>
                </div>
              </div>
              <div className="col-email">{user.email}</div>
              <div className="col-role">
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>
              <div className="col-manager">{user.manager || '-'}</div>
              <div className="col-department">{user.department}</div>
              <div className="col-status">
                <span className={`status-badge ${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </div>
              <div className="col-actions">
                <button 
                  className="btn-small primary"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </button>
                <button 
                  className="btn-small danger"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAddUserModal(false);
                  setEditingUser(null);
                  setNewUser({
                    name: '',
                    email: '',
                    role: 'Employee',
                    manager: '',
                    department: '',
                    password: ''
                  });
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label>Password {!editingUser && '*'}</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              {newUser.role === 'Employee' && (
                <div className="form-group">
                  <label>Manager</label>
                  <select
                    value={newUser.manager}
                    onChange={(e) => setNewUser({...newUser, manager: e.target.value})}
                  >
                    <option value="">Select Manager</option>
                    {managers.map(manager => (
                      <option key={manager.id} value={manager.name}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Department</label>
                <select
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowAddUserModal(false);
                  setEditingUser(null);
                  setNewUser({
                    name: '',
                    email: '',
                    role: 'Employee',
                    manager: '',
                    department: '',
                    password: ''
                  });
                }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={editingUser ? handleUpdateUser : handleAddUser}
              >
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
