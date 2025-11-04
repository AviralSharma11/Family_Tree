import React, { useState, useEffect } from "react";
import FamilyTree from "./Components/FamilyTree";
import Dashboard from "./Components/Dashboard";
import { API_BASE } from "./api";
import "./App.css";

function App() {
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_BASE}`);
      if (!res.ok) throw new Error("Failed to fetch members");
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Error fetching members:", err);
      setMembers([]); 
    }
  };

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
