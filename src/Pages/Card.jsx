import React from 'react'
import { FaUsers } from "react-icons/fa";
import { FiUserCheck } from "react-icons/fi";
import { FaHospital } from "react-icons/fa";
import '../style/Card.css'
function Card() {
  return (
    <div className="cards-wrapper">

      <div className="card">
        <div className="card-icon-box blue">
          <FaUsers />
        </div>
        <div>
          <span className="card-label">Total Employees</span>
          <span className="card-value">6</span>
        </div>
      </div>

      <div className="card">
        <div className="card-icon-box green">
          <FiUserCheck />
        </div>
        <div>
          <span className="card-label">Active Employees</span>
          <span className="card-value">4</span>
        </div>
      </div>

      <div className="card">
        <div className="card-icon-box yellow">
          <FaHospital />
        </div>
        <div>
          <span className="card-label">Companies</span>
          <span className="card-value">3</span>
        </div>

</div>
    </div>
    
  )
}

export default Card
