import React from 'react';
import { Pencil, Trash2, User, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../style/Table.css';

const Table = ({ employees, deleteEmployee, toggleActive }) => {
  return (
    <div className="employee-list-page">
      <div className="page-header">
        <h2>Employee List</h2>
        <Link to="/add-employee" className="btn btn-primary">
          <Plus size={18} />
          Add Employee
        </Link>
      </div>

      <div className="table-container card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Role</th>
              <th>Skills</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td className="user-td">
                  <div className="avatar">
                    <User size={16} />
                  </div>
                  <span className="emp-name">{emp.name}</span>
                </td>
                <td>{emp.company}</td>
                <td>
                  <span className={`badge badge-${emp.role.toLowerCase()}`}>
                    {emp.role}
                  </span>
                </td>
                <td>
                  <div className="skills-tags">
                    {emp.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </td>
                <td>
                  {emp.active ? (
                    <div className="active-indicator">
                      <div className="check-box checked">
                        <Check size={12} strokeWidth={4} />
                      </div>
                    </div>
                  ) : (
                    <div className="active-indicator">
                      <div className="check-box"></div>
                    </div>
                  )}
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-action edit">
                      <Pencil size={16} />
                    </button>
                    <button 
                      className="btn-action delete" 
                      onClick={() => deleteEmployee(emp.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;   