import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

/*
 MemberCard:
 - avatar-only
 - click opens a modal that initially shows read-only details
 - Edit button toggles form mode (Save / Cancel / Delete)
*/

export default function MemberCard({ member, members = {}, updateMember, deleteMember }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  // editing form state
  const [editing, setEditing] = useState(false);
  const [editingName, setEditingName] = useState(member?.name || "");
  const [editingImage, setEditingImage] = useState(member?.imageUrl || "");
  const [editingSocial, setEditingSocial] = useState(member?.socialMedia || "");
  const [editingDob, setEditingDob] = useState(member?.dob || "");
  const [editingDod, setEditingDod] = useState(member?.dod || "");
  const [editingDesc, setEditingDesc] = useState(member?.description || "");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // sync fields when member prop changes
    setEditingName(member?.name || "");
    setEditingImage(member?.imageUrl || "");
    setEditingSocial(member?.socialMedia || "");
    setEditingDob(member?.dob || "");
    setEditingDod(member?.dod || "");
    setEditingDesc(member?.description || "");
    setImgError(false);
  }, [member]);

  // parents lookups
  const mother = (member.parents || []).map(id => members[id]).find(m => m && m.gender === "female");
  const father = (member.parents || []).map(id => members[id]).find(m => m && m.gender === "male");

  // show tooltip handlers
  const showTooltip = () => setHover(true);
  const hideTooltip = () => setHover(false);

  // open modal in read-only mode
  const openModal = () => {
    setEditing(false);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(false);
  };

  // begin editing
  const startEdit = () => {
    setEditing(true);
  };

  // cancel edits (revert to member values)
  const cancelEdit = () => {
    setEditingName(member?.name || "");
    setEditingImage(member?.imageUrl || "");
    setEditingSocial(member?.socialMedia || "");
    setEditingDob(member?.dob || "");
    setEditingDod(member?.dod || "");
    setEditingDesc(member?.description || "");
    setEditing(false);
  };

  // save edits
  const save = () => {
    const patch = {};
    if (editingName !== member.name) patch.name = editingName;
    if ((editingImage || null) !== (member.imageUrl || null)) patch.imageUrl = editingImage || null;
    if ((editingSocial || null) !== (member.socialMedia || null)) patch.socialMedia = editingSocial || null;
    if ((editingDob || null) !== (member.dob || null)) patch.dob = editingDob || null;
    if ((editingDod || null) !== (member.dod || null)) patch.dod = editingDod || null;
    if ((editingDesc || "") !== (member.description || "")) patch.description = editingDesc || "";
    if (Object.keys(patch).length) updateMember?.(member.id, patch);
    setEditing(false);
    // keep modal open and show updated read-only view
  };

  // delete
  const onDelete = () => {
    const ok = window.confirm(`Delete "${member?.name}"?`);
    if (!ok) return;
    deleteMember?.(member.id);
    setOpen(false);
    setEditing(false);
  };

  // modal content - either read-only or edit form
  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      style={modalStyles.overlay}
      onMouseDown={(e) => {
        // clicking backdrop closes modal
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div style={modalStyles.dialog}>
        <h3 style={{ marginTop: 0 }}>{member?.name || "Member"}</h3>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={modalStyles.avatarBox}>
            {member?.imageUrl && !imgError ? (
              <img src={member.imageUrl} alt={member.name} style={modalStyles.avatarImg} onError={() => setImgError(true)} />
            ) : (
              <div style={modalStyles.fallback(member?.gender)}>
                {member?.name ? member.name[0].toUpperCase() : "?"}
              </div>
            )}
          </div>

          {/* Read-only details panel */}
          {!editing ? (
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 8 }}>
                <strong>Parents:</strong>{" "}
                {member.parents && member.parents.length
                  ? `${mother ? mother.name : "Mother: —"}${father ? `, ${father.name}` : ""}`
                  : "— none —"}
              </div>

              <div style={{ marginBottom: 8 }}>
                <strong>DOB:</strong> {member?.dob || "—"}
                {member?.dod ? (<span style={{ marginLeft: 10 }}><strong>DOD:</strong> {member.dod}</span>) : null}
              </div>

              <div style={{ marginBottom: 8 }}>
                <strong>Social:</strong> {member?.socialMedia ? <a href={member.socialMedia} target="_blank" rel="noreferrer">{member.socialMedia}</a> : "—"}
              </div>

              <div style={{ marginTop: 6 }}>
                <strong>Description:</strong>
                <div style={{ marginTop: 6, color: "#333" }}>{member?.description || "—"}</div>
              </div>
            </div>
          ) : (
            /* Edit form */
            <div style={{ flex: 1 }}>
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
            </div>
          )}
        </div>

        <hr style={{ margin: "12px 0" }} />

        {/* Footer buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
          {/* Always show Close on left */}
          <button onClick={closeModal} style={modalStyles.btnAlt}>Close</button>

          {!editing ? (
            // read-only footer: Edit / Delete
            <>
              <button onClick={startEdit} style={modalStyles.btnSave}>Edit</button>
              <button onClick={onDelete} style={modalStyles.btnDelete}>Delete</button>
            </>
          ) : (
            // editing footer: Save / Cancel / Delete
            <>
              <button onClick={save} style={modalStyles.btnSave}>Save</button>
              <button onClick={cancelEdit} style={modalStyles.btnAlt}>Cancel</button>
              <button onClick={onDelete} style={modalStyles.btnDelete}>Delete</button>
            </>
          )}
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
        <button onClick={openModal} style={avatarStyles.button} aria-label={member?.name || "Member"}>
          {member?.imageUrl && !imgError ? (
            <img src={member.imageUrl} alt={member.name} style={avatarStyles.img} onError={() => setImgError(true)} />
          ) : (
            <div style={avatarStyles.fallback(member?.gender)}>{member?.name ? member.name[0].toUpperCase() : "?"}</div>
          )}
        </button>

        {hover && <div style={avatarStyles.tooltip}>{member?.name || "Unnamed"}</div>}
      </div>

      {open && ReactDOM.createPortal(modalContent, document.body)}
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
  avatarBox: { width: 72, height: 72, borderRadius: 12, overflow: "hidden", background: "#f3f4f6" },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  fallback: (g) => ({ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: g === "female" ? "#ec4899" : "#3b82f6", color: "#fff", fontWeight: 700 }),
  label: { display: "flex", flexDirection: "column", gap: 6, marginTop: 10 },
  input: { padding: 8, borderRadius: 6, border: "1px solid #ddd", fontSize: 14, marginTop: 6 },
  btnAlt: { background: "#e5e7eb", padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer" },
  btnSave: { background: "#2563eb", color: "#fff", padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer" },
  btnDelete: { background: "#ef4444", color: "#fff", padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer" },
};
