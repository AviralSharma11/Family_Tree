import React, { useEffect, useState, useRef } from "react";
import FamilyTree from "./Components/FamilyTree.jsx";
import Dashboard from "./Components/Dashboard.jsx";

const STORAGE_KEY = "family_tree_data_v1";

const sampleData = {
  members: {
    1: { id: 1, name: "Kaushalya", gender: "female", imageUrl: "https://www.indianetzone.com/kaushalya_wife_king_dasaratha", spouseId: 2, parents: [], children: [3]},
    2: { id: 2, name: "Dashrath", gender: "male", spouseId: 1, parents: [], children: [3] },
    3: { id: 3, name: "Ram", gender: "male", spouseId: null, parents: [1,2], children: [] },
  }
};

/** Robust loader: accepts multiple formats and returns canonical { members: {..} } */
function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleData;

    const parsed = JSON.parse(raw);

    // Already canonical shape
    if (parsed && typeof parsed === "object" && parsed.members && typeof parsed.members === "object") {
      return parsed;
    }

    // Top-level members map (keys are ids)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const values = Object.values(parsed);
      if (values.length > 0 && values[0] && typeof values[0] === "object" && ("id" in values[0] || "name" in values[0])) {
        return { members: parsed };
      }
    }

    // Array of member objects
    if (Array.isArray(parsed)) {
      const members = {};
      parsed.forEach(m => {
        if (m && (m.id || m.name)) members[m.id ?? Date.now()] = { ...m };
      });
      return { members };
    }

    // fallback
    return sampleData;
  } catch (err) {
    console.warn("Failed to parse localStorage, using sampleData", err);
    return sampleData;
  }
}

export default function App() {
  const [data, setData] = useState(() => loadFromLocalStorage());
  const treeRef = useRef(null);

  // persist canonical shape
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to write localStorage", e);
    }
  }, [data]);

  // export to print/PDF
  const exportToPdf = () => {
    const node = treeRef.current;
    if (!node) {
      alert("Tree not found.");
      return;
    }

    const cloned = node.cloneNode(true);
    const html = `
      <html>
        <head>
          <title>Family Tree</title>
          <style>
            body { margin: 20px; font-family: system-ui, Arial, sans-serif; }
            .tree-wrapper { width: 100%; }
            img { max-width: 100%; height: auto; }
            * { box-shadow: none !important; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center">Family Tree</h2>
          <div class="tree-wrapper">${cloned.innerHTML}</div>
          <script>
            window.onload = function() { setTimeout(function(){ window.print(); }, 250); };
          </script>
        </body>
      </html>
    `;

    const w = window.open("", "_blank");
    if (!w) {
      alert("Popup blocked. Allow popups for this site to export.");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  // addMember: functional update and preserve existing members map
  // member payload may include optional fields: imageUrl, socialMedia, dob, dod, description
  const addMember = (member, attach) => {
    setData(prev => {
      const id = Date.now();
      const newMember = {
        id,
        name: member.name,
        gender: member.gender,
        imageUrl: member.imageUrl ?? null,
        socialMedia: member.socialMedia ?? null,
        description: member.description ?? "",
        dob: member.dob ?? null,
        dod: member.dod ?? null,
        spouseId: null,
        parents: [],
        children: []
      };

      const members = { ...(prev.members || {}), [id]: newMember };

      if (attach?.type === "spouse" && attach.targetId) {
        const target = { ...(members[attach.targetId] || {}), spouseId: id };
        members[attach.targetId] = target;
        members[id].spouseId = attach.targetId;
      } else if (attach?.type === "child" && attach.targetId) {
        const target = members[attach.targetId];
        const spouseId = target?.spouseId || null;
        members[id].parents = spouseId ? [attach.targetId, spouseId] : [attach.targetId];
        members[attach.targetId] = { ...target, children: [...(target.children || []), id] };
        if (spouseId) {
          const spouse = members[spouseId];
          members[spouseId] = { ...spouse, children: [...(spouse.children || []), id] };
        }
      }

      return { members };
    });
  };

  // update member safely (functional)
  const updateMember = (id, patch) => {
    setData(prev => {
      const members = { ...(prev.members || {}) };
      if (!members[id]) return prev;
      members[id] = { ...members[id], ...patch };
      return { members };
    });
  };

  // delete member safely and remove references
  const deleteMember = (idToDelete) => {
    setData(prev => {
      const members = { ...(prev.members || {}) };
      if (!members[idToDelete]) return prev;

      Object.keys(members).forEach(k => {
        const m = members[k];
        if (!m) return;
        if (m.spouseId && m.spouseId === idToDelete) members[k] = { ...m, spouseId: null };
        if (Array.isArray(m.parents)) members[k] = { ...members[k], parents: m.parents.filter(p => p !== idToDelete) };
        if (Array.isArray(m.children)) members[k] = { ...members[k], children: m.children.filter(c => c !== idToDelete) };
      });

      delete members[idToDelete];
      return { members };
    });
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>Family Tree</h1>

      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        <button onClick={exportToPdf} style={{ padding: "8px 12px", borderRadius: 6 }}>Download PDF</button>
      </div>

      {/* attach ref to this wrapper so export can clone its contents */}
      <div ref={treeRef} style={styles.treeContainer}>
        <FamilyTree members={data.members} updateMember={updateMember} deleteMember={deleteMember} />
      </div>

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
    padding: "clamp(var(--spacing-2), 3vw, var(--spacing-4))",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(10px)",
    height: "clamp(50vh, 70vh, 80vh)",
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