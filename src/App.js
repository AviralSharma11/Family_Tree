import React, { useEffect, useState } from "react";
import FamilyTree from "./Components/FamilyTree.jsx";
import Dashboard from "./Components/Dashboard.jsx";

const STORAGE_KEY = "family_tree_data_v1";

const sampleData = {
  members: {
    1: { id: 1, name: "Kaushalya", gender: "female", imageUrl: "https://www.indianetzone.com/kaushalya_wife_king_dasaratha", spouseId: 2, parents: [], children: [3]},
    2: { id: 2, name: "Dashrath", gender: "male", spouseId: 1, parents: [], children: [3] },
    3: { id: 3, name: "Ram", gender: "male", spouseId: null, parents: [1,2], children: [] },
    // 4: { id: 4, name: "", gender: "female", spouseId: 5, parents: [1,2], children: [6] },
    // 5: { id: 5, name: "", gender: "male", spouseId: 4, parents: [], children: [6] },
    // 6: { id: 6, name: "", gender: "female", spouseId: null, parents: [4,5], children: [] }
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
    const id = Date.now();
    const newMembers = {
      ...data.members,
      [id]: { id, name: member.name, gender: member.gender, spouseId: null, parents: [], children: [] }
    };

    if (attach?.type === "spouse" && attach.targetId) {
      const target = { ...newMembers[attach.targetId], spouseId: id };
      newMembers[attach.targetId] = target;
      newMembers[id].spouseId = attach.targetId;
    } else if (attach?.type === "child" && attach.targetId) {
      const target = newMembers[attach.targetId];
      const spouseId = target?.spouseId || null;
      newMembers[id].parents = spouseId ? [attach.targetId, spouseId] : [attach.targetId];
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

  const deleteMember = (idToDelete) => {
    setData(prev => {
      const copy = { ...prev.members };

      // If the member doesn't exist, do nothing
      if (!copy[idToDelete]) return prev;

      // 1) Remove references to this member from all other members
      Object.keys(copy).forEach(k => {
        const m = copy[k];
        if (!m) return;

        // clear spouse link if pointing to deleted id
        if (m.spouseId && m.spouseId === idToDelete) {
          copy[k] = { ...m, spouseId: null };
        }

        // remove from parents array if present
        if (Array.isArray(m.parents) && m.parents.some(p => p === idToDelete)) {
          copy[k] = { ...copy[k], parents: m.parents.filter(p => p !== idToDelete) };
        }

        // remove from children array if present
        if (Array.isArray(m.children) && m.children.some(c => c === idToDelete)) {
          copy[k] = { ...copy[k], children: m.children.filter(c => c !== idToDelete) };
        }
      });

      // 2) delete member itself
      delete copy[idToDelete];

      return { members: copy };
    });
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>Family Tree</h1>

      {/* Tree fills the viewport height and is scrollable */}
      <div style={styles.treeContainer}>
        <FamilyTree members={data.members} updateMember={updateMember} deleteMember={deleteMember} />
      </div>

      {/* Dashboard sits below the tree */}
      <div style={styles.dashboardContainer}>
        <Dashboard members={data.members} onAdd={addMember} />
      </div>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: "'Inter', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial",
    padding: "var(--spacing-3)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-3)",
    alignItems: "stretch",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  title: {
    margin: "var(--spacing-2) 0",
    fontSize: "clamp(28px, 5vw, 42px)",
    fontWeight: 700,
    background: "linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.02em",
    textAlign: "center",
  },

  treeContainer: {
    borderRadius: "var(--radius-xl)",
    padding: "var(--spacing-4)",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(10px)",
    height: "70vh",
    overflowY: "auto",
    overflowX: "hidden",
    boxShadow: "var(--shadow-lg)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    transition: "all var(--transition-base)",
  },

  dashboardContainer: {
    marginTop: "var(--spacing-2)",
    width: "100%",
    maxWidth: "980px",
    alignSelf: "center",
  },
};
