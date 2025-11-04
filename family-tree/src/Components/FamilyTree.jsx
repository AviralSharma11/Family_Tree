import React from "react";
import { API_BASE } from "../api";
import "./FamilyTree.css"; 
export default function FamilyTree({ members }) {
  const renderTree = (parentId = null) => {
    const children = members.filter((m) => m.parent_id === parentId);
    if (!children.length) return null;

    return (
      <ul>
        {children.map((child) => (
          <li key={child.id}>
            <div className="member-node">
              {child.image && (
                <img
                  src={`http://localhost:5000${child.image}`}
                  alt={child.name}
                />
              )}
              <div className="member-info">
                <strong>{child.name}</strong>
                <span>{child.gender}</span>
              </div>
            </div>
            {renderTree(child.id)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="family-tree">
      <h2>Family Tree</h2>
      {renderTree(null)}
    </div>
  );
}
