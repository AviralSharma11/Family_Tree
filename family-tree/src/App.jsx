import React, { useState, useEffect } from "react";
import FamilyTree from "./Components/FamilyTree";
import Dashboard from "./Components/Dashboard";
import { API_BASE } from "./api";
import "./App.css";

function App() {
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    const res = await fetch(API_BASE);
    const data = await res.json();
    setMembers(data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="app-container">
      <div className="app-content">
        <div className="app-header">
          <h1>Family Tree</h1>
          <p className="app-subtitle">Build and manage your family connections</p>
        </div>
        <Dashboard onAdd={fetchMembers} members={members} />
        <FamilyTree members={members} />
      </div>
    </div>
  );
}

export default App;
