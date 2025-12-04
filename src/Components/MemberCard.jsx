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
            <h3 style={{
              marginTop: 0,
              fontSize: 24,
              fontWeight: 700,
              color: "var(--neutral-800)",
              marginBottom: "var(--spacing-2)",
            }}>Edit Member</h3>

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

const styles = {
  wrapper: {
    display: "inline-block",
    position: "relative",
    margin: "var(--spacing-1)",
  },

  avatarButton: {
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    outline: "none",
    transition: "transform var(--transition-fast)",
    display: "block",
  },

  avatarImg: {
    width: "clamp(60px, 12vw, 80px)",
    height: "clamp(60px, 12vw, 80px)",
    borderRadius: "var(--radius-full)",
    objectFit: "cover",
    display: "block",
    boxShadow: "var(--shadow-lg)",
    border: "3px solid white",
    transition: "all var(--transition-base)",
  },

  fallbackAvatar: (gender) => ({
    width: "clamp(60px, 12vw, 80px)",
    height: "clamp(60px, 12vw, 80px)",
    borderRadius: "var(--radius-full)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: gender === "female"
      ? "linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
      : "linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%)",
    color: "#fff",
    fontSize: "clamp(24px, 5vw, 32px)",
    fontWeight: 700,
    boxShadow: "var(--shadow-lg)",
    border: "3px solid white",
    transition: "all var(--transition-base)",
  }),

  hoverName: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "8px 16px",
    background: "var(--neutral-800)",
    color: "#fff",
    borderRadius: "var(--radius-md)",
    fontSize: 14,
    fontWeight: 500,
    whiteSpace: "nowrap",
    zIndex: 20,
    boxShadow: "var(--shadow-lg)",
    animation: "fadeIn var(--transition-fast)",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    padding: "var(--spacing-3)",
    animation: "fadeIn var(--transition-base)",
  },

  modal: {
    width: "clamp(280px, 90vw, 480px)",
    maxWidth: "100%",
    background: "#fff",
    padding: "clamp(var(--spacing-2), 4vw, var(--spacing-4))",
    borderRadius: "var(--radius-xl)",
    boxShadow: "var(--shadow-xl)",
    animation: "slideUp var(--transition-base)",
  },

  modalLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-1)",
    marginTop: "var(--spacing-2)",
    fontSize: "clamp(13px, 3vw, 14px)",
    fontWeight: 500,
    color: "var(--neutral-700)",
  },

  modalInput: {
    padding: "clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)",
    borderRadius: "var(--radius-md)",
    border: "2px solid var(--neutral-200)",
    fontSize: "clamp(14px, 3vw, 15px)",
    transition: "all var(--transition-fast)",
    outline: "none",
    fontFamily: "inherit",
  },

  previewRow: {
    display: "flex",
    gap: "var(--spacing-2)",
    alignItems: "center",
    marginTop: "var(--spacing-2)",
    padding: "var(--spacing-2)",
    background: "var(--neutral-50)",
    borderRadius: "var(--radius-md)",
  },

  previewBox: {
    width: "clamp(70px, 15vw, 80px)",
    height: "clamp(70px, 15vw, 80px)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    background: "var(--neutral-100)",
    boxShadow: "var(--shadow-sm)",
    border: "2px solid white",
  },

  previewImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "var(--spacing-2)",
    marginTop: "var(--spacing-4)",
  },

  btnAlt: {
    background: "var(--neutral-100)",
    padding: "12px 20px",
    borderRadius: "var(--radius-md)",
    border: "2px solid var(--neutral-200)",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
    transition: "all var(--transition-fast)",
    color: "var(--neutral-700)",
  },

  btnSave: {
    background: "linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-600) 100%)",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "var(--radius-md)",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
    transition: "all var(--transition-fast)",
    boxShadow: "var(--shadow-sm)",
  },

  btnDelete: {
    background: "linear-gradient(135deg, var(--error-500) 0%, var(--error-600) 100%)",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "var(--radius-md)",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
    transition: "all var(--transition-fast)",
    boxShadow: "var(--shadow-sm)",
  },
};
