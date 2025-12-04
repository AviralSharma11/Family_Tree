import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

/*
 MemberCard: avatar-only. On click opens modal that shows/edit:
 - name, imageUrl, socialMedia, dob, dod, description
 - parents (mother/father names resolved via members map)
*/

export default function MemberCard({ member, members = {}, updateMember, deleteMember }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const [editingName, setEditingName] = useState(member?.name || "");
  const [editingImage, setEditingImage] = useState(member?.imageUrl || "");
  const [editingSocial, setEditingSocial] = useState(member?.socialMedia || "");
  const [editingDob, setEditingDob] = useState(member?.dob || "");
  const [editingDod, setEditingDod] = useState(member?.dod || "");
  const [editingDesc, setEditingDesc] = useState(member?.description || "");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setEditingName(member?.name || "");
    setEditingImage(member?.imageUrl || "");
    setEditingSocial(member?.socialMedia || "");
    setEditingDob(member?.dob || "");
    setEditingDod(member?.dod || "");
    setEditingDesc(member?.description || "");
    setImgError(false);
  }, [member]);

  const mother = (member.parents || []).map(id => members[id]).find(m => m && m.gender === "female");
  const father = (member.parents || []).map(id => members[id]).find(m => m && m.gender === "male");

  const save = () => {
    const patch = {};
    if (editingName !== member.name) patch.name = editingName;
    if ((editingImage || null) !== (member.imageUrl || null)) patch.imageUrl = editingImage || null;
    if ((editingSocial || null) !== (member.socialMedia || null)) patch.socialMedia = editingSocial || null;
    if ((editingDob || null) !== (member.dob || null)) patch.dob = editingDob || null;
    if ((editingDod || null) !== (member.dod || null)) patch.dod = editingDod || null;
    if ((editingDesc || "") !== (member.description || "")) patch.description = editingDesc || "";
    if (Object.keys(patch).length) updateMember?.(member.id, patch);
    setOpen(false);
  };

  const onDelete = () => {
    const ok = window.confirm(`Delete "${member?.name}"?`);
    if (!ok) return;
    deleteMember?.(member.id);
    setOpen(false);
  };

  // hover/touch handlers
  const showTooltip = () => setHover(true);
  const hideTooltip = () => setHover(false);

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      style={modalStyles.overlay}
      onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div style={modalStyles.dialog}>
        <h3 style={{ marginTop: 0 }}>{member?.name || "Edit member"}</h3>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 12, overflow: "hidden", background: "#f3f4f6" }}>
            {member?.imageUrl && !imgError ? (
              <img src={member.imageUrl} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setImgError(true)} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: member?.gender === "female" ? "#ec4899" : "#3b82f6", color: "#fff", fontWeight: 700 }}>
                {member?.name ? member.name[0].toUpperCase() : "?"}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 6 }}>
              <strong>Parents:</strong> {mother ? mother.name : member.parents && member.parents.length ? "Unknown (mother not recorded)" : "— none —"}{father ? `, ${father.name}` : ""}
            </div>
            <div style={{ marginBottom: 6 }}>
              <strong>DOB:</strong> {member?.dob || "—"}
              {member?.dod ? (<><span style={{ marginLeft: 10 }}><strong>DOD:</strong> {member.dod}</span></>) : null}
            </div>
            <div><strong>Social:</strong> {member?.socialMedia ? <a href={member.socialMedia} target="_blank" rel="noreferrer">{member.socialMedia}</a> : "—"}</div>
          </div>
        </div>

        <hr style={{ margin: "12px 0" }} />

        <label style={modalStyles.label}>Name
          <input value={editingName} onChange={e => setEditingName(e.target.value)} style={modalStyles.input} />
        </label>

        <label style={modalStyles.label}>Image URL
          <input value={editingImage || ""} onChange={e => setEditingImage(e.target.value)} style={modalStyles.input} />
        </label>

        <label style={modalStyles.label}>Social media (link)
          <input value={editingSocial || ""} onChange={e => setEditingSocial(e.target.value)} style={modalStyles.input} placeholder="https://..." />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <label style={{ ...modalStyles.label, flex: 1 }}>DOB
            <input type="date" value={editingDob || ""} onChange={e => setEditingDob(e.target.value)} style={modalStyles.input} />
          </label>
          <label style={{ ...modalStyles.label, flex: 1 }}>DOD
            <input type="date" value={editingDod || ""} onChange={e => setEditingDod(e.target.value)} style={modalStyles.input} />
          </label>
        </div>

        <label style={modalStyles.label}>Description
          <textarea value={editingDesc} onChange={e => setEditingDesc(e.target.value)} style={{ ...modalStyles.input, minHeight: 80 }} placeholder="Short bio, notes..." />
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
          <button onClick={() => setOpen(false)} style={modalStyles.btnAlt}>Cancel</button>
          <button onClick={save} style={modalStyles.btnSave}>Save</button>
          <button onClick={onDelete} style={modalStyles.btnDelete}>Delete</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        style={{ display: "inline-block", position: "relative", margin: 6 }}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onTouchStart={showTooltip}
        onTouchEnd={hideTooltip}
        onTouchCancel={hideTooltip}
      >
        <button onClick={() => setOpen(true)} style={avatarStyles.button} aria-label={member?.name || "Member"}>
          {member?.imageUrl && !imgError ? (
            <img src={member.imageUrl} alt={member.name} style={avatarStyles.img} onError={() => setImgError(true)} />
          ) : (
            <div style={avatarStyles.fallback(member?.gender)}>{member?.name ? member.name[0].toUpperCase() : "?"}</div>
          )}
        </button>

        {hover && <div style={avatarStyles.tooltip}>{member?.name || "Unnamed"}</div>}
      </div>

      {open && ReactDOM.createPortal(modal, document.body)}
    </>
  );
}

/* small style objects */
const avatarStyles = {
  button: { background: "transparent", border: "none", padding: 0, cursor: "pointer", outline: "none" },
  img: { width: 60, height: 60, borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" },
  fallback: (g) => ({ width: 60, height: 60, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: g === "female" ? "#ec4899" : "#3b82f6", color: "#fff", fontSize: 20, fontWeight: 700 }),
  tooltip: { position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 6, padding: "4px 10px", background: "rgba(0,0,0,0.85)", color: "#fff", borderRadius: 6, fontSize: 13, whiteSpace: "nowrap", zIndex: 9999 }
};

const modalStyles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2147483647, padding: 20 },
  dialog: { width: 520, maxWidth: "100%", background: "#fff", padding: 18, borderRadius: 10, boxShadow: "0 10px 40px rgba(0,0,0,0.25)" },
  label: { display: "flex", flexDirection: "column", gap: 6, marginTop: 10 },
  input: { padding: 8, borderRadius: 6, border: "1px solid #ddd", fontSize: 14, marginTop: 6 },
  btnAlt: { background: "#e5e7eb", padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer" },
  btnSave: { background: "#2563eb", color: "#fff", padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer" },
  btnDelete: { background: "#ef4444", color: "#fff", padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer" },
};
