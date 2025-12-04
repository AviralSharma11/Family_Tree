import React, { useState } from "react";

/*
 Member card shows name, gender, spouse quick info and allows quick rename.
*/

export default function MemberCard({ member, spouse, updateMember }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(member.name);

  const save = () => {
    updateMember(member.id, { name });
    setEditing(false);
  };

  return (
    <div style={cardStyles.card}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={cardStyles.avatar(member.gender)}>{member.name ? member.name[0] : "?"}</div>
        <div>
          {editing ? (
            <div style={{ display: "flex", gap: 6 }}>
              <input value={name} onChange={e => setName(e.target.value)} style={cardStyles.input} />
              <button onClick={save} style={cardStyles.btn}>Save</button>
              <button onClick={() => setEditing(false)} style={cardStyles.btnAlt}>Cancel</button>
            </div>
          ) : (
            <>
              <div style={cardStyles.name}>{member.name}</div>
              <div style={cardStyles.meta}>{member.gender}{member.spouseId ? ` · married` : ""}</div>
            </>
          )}
        </div>
      </div>

      {spouse && (
        <div style={cardStyles.spouse}>
          <small>Spouse:</small>
          <div style={{ fontWeight: 600 }}>{spouse.name}</div>
        </div>
      )}

      {!editing && <div style={{ marginTop: 8 }}><button onClick={() => setEditing(true)} style={cardStyles.link}>Rename</button></div>}
    </div>
  );
}

const cardStyles = {
  card: { background: "#fff", padding: 10, borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", width: 220, boxSizing: "border-box" },
  avatar: (g) => ({ width: 44, height: 44, borderRadius: 22, background: g === "male" ? "#3b82f6" : "#ec4899", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }),
  name: { fontWeight: 700 },
  meta: { color: "#666", fontSize: 12 },
  spouse: { marginTop: 10, paddingTop: 8, borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" },
  input: { padding: 6, fontSize: 14 },
  btn: { padding: "6px 8px", background: "#10b981", color: "#fff", border: "none", borderRadius: 6 },
  btnAlt: { padding: "6px 8px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6 },
  link: { background: "none", border: "none", color: "#2563eb", padding: 0, cursor: "pointer" }
};