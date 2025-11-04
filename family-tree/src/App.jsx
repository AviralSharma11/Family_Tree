import React, { useState, useEffect } from "react";
import FamilyTree from "./Components/FamilyTree";
import Dashboard from "./Components/Dashboard";
import { API_BASE } from "./api";

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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>👨‍👩‍👧 Family Tree</h1>
      <Dashboard onAdd={fetchMembers} members={members} />
      <FamilyTree members={members} />
    </div>
  );
}

export default App;
