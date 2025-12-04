import React, { useMemo, useState } from "react";

/*
 Dashboard to add members:
 - choose relation type: root / child / spouse
 - choose target (existing member) when needed
 - add name + gender
*/

export default function Dashboard({ members = {}, onAdd }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [rel, setRel] = useState("root");
  const [targetId, setTargetId] = useState("");

  const list = useMemo(() => Object.values(members).sort((a,b)=>a.name.localeCompare(b.name)), [members]);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), gender }, { type: rel, targetId: targetId ? Number(targetId) : null });
    setName("");
    setTargetId("");
  };

  return (
    <div style={styles.card}>
      <h3 style={{ marginTop: 0 }}>Dashboard</h3>
      <form onSubmit={submit} style={styles.form}>
        <label style={styles.label}>Name
          <input value={name} onChange={e=>setName(e.target.value)} style={styles.input} placeholder="Full name" />
        </label>

        <label style={styles.label}>Gender
          <select value={gender} onChange={e=>setGender(e.target.value)} style={styles.input}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label style={styles.label}>Relation
          <select value={rel} onChange={e=>setRel(e.target.value)} style={styles.input}>
            <option value="root">Root / top-level member</option>
            <option value="child">Child of selected member</option>
            <option value="spouse">Spouse of selected member</option>
          </select>
        </label>

        {(rel === "child" || rel === "spouse") && (
          <label style={styles.label}>Target member
            <select value={targetId} onChange={e=>setTargetId(e.target.value)} style={styles.input}>
              <option value="">-- choose --</option>
              {list.map(m => <option key={m.id} value={m.id}>{m.name} ({m.id})</option>)}
            </select>
          </label>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button type="submit" style={styles.btnPrimary}>Add</button>
          <button type="button" onClick={()=>{ setName(""); setTargetId(""); setGender("male"); setRel("root"); }} style={styles.btnAlt}>Reset</button>
        </div>
      </form>

      <div style={{ marginTop: 12 }}>
        <strong>Tips:</strong>
        <ul style={{ paddingLeft: 18 }}>
          <li>Add spouse first, then children will automatically have both parents if you attach to one parent who has a spouse.</li>
          <li>Use Rename on cards to quickly update names.</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  card: { background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" },
  form: { display: "flex", flexDirection: "column", gap: 8 },
  label: { display: "flex", flexDirection: "column", fontSize: 13, color: "#333" },
  input: { padding: 8, fontSize: 14, borderRadius: 6, border: "1px solid #ddd" },
  btnPrimary: { padding: "8px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6 },
  btnAlt: { padding: "8px 12px", background: "#e5e7eb", border: "none", borderRadius: 6 }
};