import React, { useState, useEffect} from "react";

/*
 MemberCard:
 - shows only circular profile picture
 - name appears on hover (via react state)
 - click opens modal to edit/delete
*/

export default function MemberCard({ member, updateMember, deleteMember }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [editingName, setEditingName] = useState(member?.name || "");
  const [editingImage, setEditingImage] = useState(member?.imageUrl || "");
  const [imgError, setImgError] = useState(false);

  // Sync edits when member changes
  useEffect(() => {
  setEditingName(member?.name || "");
  setEditingImage(member?.imageUrl || "");
  setImgError(false);
}, [member]);

  const save = () => {
    const patch = {};
    if (editingName !== member.name) patch.name = editingName;
    if ((editingImage || null) !== (member.imageUrl || null)) patch.imageUrl = editingImage || null;
    if (Object.keys(patch).length) updateMember?.(member.id, patch);
    setOpen(false);
  };

  const onDelete = () => {
    const ok = window.confirm(`Delete "${member?.name}"?`);
    if (!ok) return;
    deleteMember?.(member.id);
    setOpen(false);
  };

  return (
    <>
      {/* Avatar Wrapper */}
      <div
        style={styles.wrapper}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <button
          onClick={() => setOpen(true)}
          style={styles.avatarButton}
        >
          {member?.imageUrl && !imgError ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              style={styles.avatarImg}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={styles.fallbackAvatar(member?.gender)}>
              {member?.name ? member.name[0].toUpperCase() : "?"}
            </div>
          )}
        </button>

        {/* Hover tooltip */}
        {hover && (
          <div style={styles.hoverName}>
            {member?.name || "Unnamed"}
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={styles.modalOverlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div style={styles.modal}>
            <h3>Edit Member</h3>

            <label style={styles.modalLabel}>
              Name
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                style={styles.modalInput}
              />
            </label>

            <label style={styles.modalLabel}>
              Image URL
              <input
                value={editingImage || ""}
                onChange={(e) => setEditingImage(e.target.value)}
                style={styles.modalInput}
                placeholder="https://example.com/photo.jpg"
              />
            </label>

            {/* Preview */}
            {editingImage ? (
              <div style={styles.previewRow}>
                <div style={styles.previewBox}>
                  <img
                    src={editingImage}
                    style={styles.previewImg}
                    alt="preview"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
                <span style={{ fontSize: 12, color: "#444" }}>
                  Preview (if it doesn't appear, URL may be invalid).
                </span>
              </div>
            ) : null}

            <div style={styles.modalButtons}>
              <button onClick={() => setOpen(false)} style={styles.btnAlt}>
                Cancel
              </button>
              <button onClick={save} style={styles.btnSave}>
                Save
              </button>
              <button onClick={onDelete} style={styles.btnDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* styles */
const styles = {
  wrapper: {
    display: "inline-block",
    position: "relative",
    margin: 6,
  },

  avatarButton: {
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    outline: "none",
  },

  avatarImg: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },

  fallbackAvatar: (gender) => ({
    width: 60,
    height: 60,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: gender === "female" ? "#ec4899" : "#3b82f6",
    color: "#fff",
    fontSize: 20,
    fontWeight: 700,
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  }),

  hoverName: {
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    marginTop: 6,
    padding: "4px 10px",
    background: "rgba(0,0,0,0.75)",
    color: "#fff",
    borderRadius: 6,
    fontSize: 13,
    whiteSpace: "nowrap",
    zIndex: 20,
  },

  /* Modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    padding: 20,
  },

  modal: {
    width: 420,
    maxWidth: "100%",
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
  },

  modalLabel: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 10,
    fontSize: 14,
  },

  modalInput: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ddd",
    fontSize: 14,
  },

  previewRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginTop: 10,
  },

  previewBox: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: "hidden",
    background: "#f3f4f6",
  },

  previewImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },

  btnAlt: {
    background: "#e5e7eb",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },

  btnSave: {
    background: "#2563eb",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },

  btnDelete: {
    background: "#ef4444",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
};
