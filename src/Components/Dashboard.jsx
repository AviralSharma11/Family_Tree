import React, { useMemo, useState } from "react";

/*
 Dashboard to add members:
 - choose relation type: root / child / spouse
 - choose target (existing member) when needed
 - add name + gender + imageUrl (optional)
*/

export default function Dashboard({ members = {}, onAdd }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [rel, setRel] = useState("root");
  const [targetId, setTargetId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const list = useMemo(
    () => Object.values(members).filter(Boolean).sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    [members]
  );

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const memberPayload = { name: name.trim(), gender, imageUrl: imageUrl.trim() || null };
    onAdd(memberPayload, { type: rel, targetId: targetId ? Number(targetId) : null });
    // reset
    setName("");
    setTargetId("");
    setImageUrl("");
  };

  const reset = () => {
    setName("");
    setTargetId("");
    setGender("male");
    setRel("root");
    setImageUrl("");
  };

  return (
    <div style={styles.card}>
      <h3 style={{ marginTop: 0 }}>Dashboard</h3>
      <form onSubmit={submit} style={styles.form}>
        <label style={styles.label}>Name
          <input value={name} onChange={e => setName(e.target.value)} style={styles.input} placeholder="Full name" />
        </label>

        <label style={styles.label}>Gender
          <select value={gender} onChange={e => setGender(e.target.value)} style={styles.input}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label style={styles.label}>Image URL (optional)
          <input
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            style={styles.input}
            placeholder="https://...jpg (paste an image URL)"
          />
        </label>

        {/* preview if imageUrl present */}
        {imageUrl.trim() ? (
          <div style={styles.previewRow}>
            <div style={styles.previewBox}>
              <img src={imageUrl} alt="preview" style={styles.previewImg} onError={(e)=>{ e.currentTarget.style.display='none'; }} />
            </div>
            <div style={{ fontSize: 12, color: "#444", alignSelf: "center" }}>
              Image preview. If it does not appear the URL may be invalid or blocked.
            </div>
          </div>
        ) : null}

        <label style={styles.label}>Relation
          <select value={rel} onChange={e => setRel(e.target.value)} style={styles.input}>
            <option value="root">Root / top-level member</option>
            <option value="child">Child of selected member</option>
            <option value="spouse">Spouse of selected member</option>
          </select>
        </label>

        {(rel === "child" || rel === "spouse") && (
          <label style={styles.label}>Target member
            <select value={targetId} onChange={e => setTargetId(e.target.value)} style={styles.input}>
              <option value="">-- choose --</option>
              {list.map(m => <option key={m.id} value={m.id}>{m.name} ({m.id})</option>)}
            </select>
          </label>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button type="submit" style={styles.btnPrimary}>Add</button>
          <button type="button" onClick={reset} style={styles.btnAlt}>Reset</button>
        </div>
      </form>

      <div style={{ marginTop: 12 }}>
        <strong>Tips:</strong>
        <ul style={{ paddingLeft: 18 }}>
          <li>Add spouse first, then children will automatically have both parents if you attach to one parent who has a spouse.</li>
          <li>Use Rename on cards to quickly update names.</li>
          <li>Image URL is optional — if provided it will be used as the member's avatar.</li>
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
  btnAlt: { padding: "8px 12px", background: "#e5e7eb", border: "none", borderRadius: 6 },

  previewRow: { display: "flex", gap: 12, alignItems: "center", marginTop: 6 },
  previewBox: { width: 64, height: 64, borderRadius: 8, overflow: "hidden", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.03)" },
  previewImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
};
