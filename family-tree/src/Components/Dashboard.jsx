import React, { useState } from "react";
import { API_BASE } from "../api";
import "./Dashboard.css"; 

export default function Dashboard({ onAdd, members }) {
  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    parent_id: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("gender", form.gender);
    formData.append("parent_id", form.parent_id);
    if (form.image) formData.append("image", form.image);

    await fetch(API_BASE, {
      method: "POST",
      body: formData,
    });

    setForm({ name: "", gender: "Male", parent_id: "", image: null });
    onAdd();
  };

  return (
    <div className="dashboard-container">
      <h2>Add Family Member</h2>
      <form className="dashboard-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <select
          value={form.parent_id}
          onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
        >
          <option value="">No Parent</option>
          {(Array.isArray(members) ? members : []).map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />
        <button type="submit">Add Member</button>
      </form>
    </div>
  );
}
