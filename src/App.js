import React, { useEffect, useState } from "react";
import FamilyTree from "./Components/FamilyTree.jsx";
import Dashboard from "./Components/Dashboard.jsx";

const STORAGE_KEY = "family_tree_data_v1";

const sampleData = {
  members: {
    1: { id: 1, name: "Alice (mother)", gender: "female", spouseId: 2, parents: [], children: [3,4] },
    2: { id: 2, name: "Bob (father)", gender: "male", spouseId: 1, parents: [], children: [3,4] },
    3: { id: 3, name: "Charlie", gender: "male", spouseId: null, parents: [1,2], children: [] },
    4: { id: 4, name: "Dina", gender: "female", spouseId: 5, parents: [1,2], children: [6] },
    5: { id: 5, name: "Evan (spouse of Dina)", gender: "male", spouseId: 4, parents: [], children: [6] },
    6: { id: 6, name: "Fay", gender: "female", spouseId: null, parents: [4,5], children: [] }
  }
};

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : sampleData;
    } catch {
      return sampleData;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addMember = (member, attach) => {
    // member = { name, gender }
    // attach = { type: 'root'|'child'|'spouse', targetId }
    const id = Date.now();
    const newMembers = { ...data.members, [id]: { id, name: member.name, gender: member.gender, spouseId: null, parents: [], children: [] } };

    if (attach?.type === "spouse" && attach.targetId) {
      // set spouse both ways
      const target = { ...newMembers[attach.targetId], spouseId: id };
      newMembers[attach.targetId] = target;
      newMembers[id].spouseId = attach.targetId;
    } else if (attach?.type === "child" && attach.targetId) {
      // add child to target and if target has spouse, set both as parents
      const target = newMembers[attach.targetId];
      const spouseId = target?.spouseId || null;
      // update parents in new child
      newMembers[id].parents = spouseId ? [attach.targetId, spouseId] : [attach.targetId];
      // add child id to parents children arrays
      newMembers[attach.targetId] = { ...target, children: [...(target.children || []), id] };
      if (spouseId) {
        const spouse = newMembers[spouseId];
        newMembers[spouseId] = { ...spouse, children: [...(spouse.children || []), id] };
      }
    }

    setData({ members: newMembers });
  };

  const updateMember = (id, patch) => {
    setData(prev => {
      const copy = { ...prev.members };
      copy[id] = { ...copy[id], ...patch };
      return { members: copy };
    });
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>Family Tree</h1>
      <div style={styles.container}>
        <div style={styles.treeWrap}>
          <FamilyTree members={data.members} updateMember={updateMember} />
        </div>
        <div style={styles.dashboardWrap}>
          <Dashboard members={data.members} onAdd={addMember} />
        </div>
      </div>

      <style>{`
        /* small responsive tweaks */
        @media (max-width: 720px) {
          .ft-row { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  app: { fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial", padding: 12 },
  title: { margin: "8px 0 16px" },
  container: { display: "flex", gap: 16, alignItems: "flex-start", flexDirection: "row" , maxWidth: 1100},
  treeWrap: { flex: 1, minWidth: 260, overflowX: "auto" },
  dashboardWrap: { width: 360, minWidth: 260 }
};