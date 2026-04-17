import React from 'react';
import { Pencil, Trash2, User, Plus, Check } from 'lucide-react';
import '../style/Table.css';

const StaticTable = () => {
  const employeeData = [
    { name: "John Doe", company: "Tech Solutions", role: "Admin", roleClass: "admin", skills: ["React", "JS", "CSS"], active: true },
    { name: "Jane Smith", company: "Innovate Corp", role: "HR", roleClass: "hr", skills: ["Python", "Django"], active: true },
    { name: "Michael Brown", company: "Web Wizards", role: "Developer", roleClass: "developer", skills: ["React", "Node", "MongoDB"], active: true },
    { name: "Emily Davis", company: "Design Hub", role: "Designer", roleClass: "designer", skills: ["Figma", "UI/UX", "CSS"], active: false },
    { name: "David Wilson", company: "Tech Solutions", role: "Developer", roleClass: "developer", skills: ["Java", "Spring", "SQL"], active: true },
    { name: "Sarah Johnson", company: "Innovate Corp", role: "HR", roleClass: "hr", skills: ["Recruitment", "Excel"], active: false }
  ];

  return (
    <div className="table-container-static">
      <div className="table-header-row">
        <h2>Employee List</h2>
        <button className="btn btn-primary">
          <Plus size={16} strokeWidth={3} />
          Add Employee
        </button>
      </div>

      <div className="card table-card">
        <table className="pixel-table">
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
            {employeeData.map((emp, i) => (
              <tr key={i}>
                <td className="name-cell">
                  <div className="avatar-small">
                    <img src={`https://i.pravatar.cc/150?u=${emp.name}`} alt="" />
                  </div>
                  <span>{emp.name}</span>
                </td>
                <td>{emp.company}</td>
                <td>
                  <span className={`badge-pixel badge-${emp.roleClass}`}>
                    {emp.role}
                  </span>
                </td>
                <td>
                  <div className="skills-row">
                    {emp.skills.map((s, idx) => (
                      <span key={idx} className="skill-bubble">{s}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className={`active-box ${emp.active ? 'checked' : ''}`}>
                    {emp.active && <Check size={12} strokeWidth={4} />}
                  </div>
                </td>
                <td>
                  <div className="actions-row">
                    <button className="act-btn edit"><Pencil size={14} fill="white" /></button>
                    <button className="act-btn delete"><Trash2 size={14} fill="white" /></button>
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

export default StaticTable;
