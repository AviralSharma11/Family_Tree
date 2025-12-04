import React, { useMemo, useState } from "react";

/*
 Dashboard to add members:
 - choose relation type: root / child / spouse
 - choose target (existing member) when needed
 - add name + gender + imageUrl + socialMedia + dob + dod + description
*/

export default function Dashboard({ members = {}, onAdd }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [rel, setRel] = useState("root");
  const [targetId, setTargetId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [dob, setDob] = useState("");
  const [dod, setDod] = useState("");
  const [description, setDescription] = useState("");

  const list = useMemo(
    () =>
      Object.values(members)
        .filter(Boolean)
        .sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    [members]
  );

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const memberPayload = {
      name: name.trim(),
      gender,
      imageUrl: imageUrl.trim() || null,
      socialMedia: socialMedia.trim() || null,
      dob: dob || null,
      dod: dod || null,
      description: description.trim() || "",
    };
    onAdd(memberPayload, { type: rel, targetId: targetId ? Number(targetId) : null });
    // reset
    setName("");
    setTargetId("");
    setImageUrl("");
    setSocialMedia("");
    setDob("");
    setDod("");
    setDescription("");
    setGender("male");
    setRel("root");
  };

  const reset = () => {
    setName("");
    setTargetId("");
    setGender("male");
    setRel("root");
    setImageUrl("");
    setSocialMedia("");
    setDob("");
    setDod("");
    setDescription("");
  };

  return (
    <div style={styles.card}>
      <h3
        style={{
          marginTop: 0,
          fontSize: 24,
          fontWeight: 700,
          color: "var(--neutral-800)",
          marginBottom: "var(--spacing-2)",
        }}
      >
        Dashboard
      </h3>
      <form onSubmit={submit} style={styles.form}>
        <label style={styles.label}>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} style={styles.input} placeholder="Full name" />
        </label>

        <label style={styles.label}>
          Gender
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={styles.input}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label style={styles.label}>
          Image URL (optional)
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={styles.input}
            placeholder="https://...jpg (paste an image URL)"
          />
        </label>

        {/* preview if imageUrl present */}
        {imageUrl.trim() ? (
          <div style={styles.previewRow}>
            <div style={styles.previewBox}>
              <img src={imageUrl} alt="preview" style={styles.previewImg} onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
            <div style={{ fontSize: 12, color: "#444", alignSelf: "center" }}>
              Image preview. If it does not appear the URL may be invalid or blocked.
            </div>
          </div>
        ) : null}

        <label style={styles.label}>
          Social media (profile link)
          <input value={socialMedia} onChange={(e) => setSocialMedia(e.target.value)} style={styles.input} placeholder="https://facebook.com/..." />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <label style={{ ...styles.label, flex: 1 }}>
            Date of birth (DOB)
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={styles.input} />
          </label>

          <label style={{ ...styles.label, flex: 1 }}>
            Date of death (DOD) — leave empty if alive
            <input type="date" value={dod} onChange={(e) => setDod(e.target.value)} style={styles.input} />
          </label>
        </div>

        <label style={styles.label}>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...styles.input, minHeight: 80 }} placeholder="Short description, notes, biography..." />
        </label>

        <label style={styles.label}>
          Relation
          <select value={rel} onChange={(e) => setRel(e.target.value)} style={styles.input}>
            <option value="root">Root / top-level member</option>
            <option value="child">Child of selected member</option>
            <option value="spouse">Spouse of selected member</option>
          </select>
        </label>

        {(rel === "child" || rel === "spouse") && (
          <label style={styles.label}>
            Target member
            <select value={targetId} onChange={(e) => setTargetId(e.target.value)} style={styles.input}>
              <option value="">-- choose --</option>
              {list.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.id})
                </option>
              ))}
            </select>
          </label>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button type="submit" style={styles.btnPrimary}>
            Add
          </button>
          <button type="button" onClick={reset} style={styles.btnAlt}>
            Reset
          </button>
        </div>
      </form>

      <div
        style={{
          marginTop: "var(--spacing-3)",
          padding: "var(--spacing-2)",
          background: "linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%)",
          borderRadius: "var(--radius-md)",
          borderLeft: "4px solid var(--primary-500)",
        }}
      >
        <strong
          style={{
            color: "var(--neutral-800)",
            fontSize: 15,
            display: "block",
            marginBottom: "var(--spacing-1)",
          }}
        >
          Tips:
        </strong>
        <ul
          style={{
            paddingLeft: 20,
            margin: "var(--spacing-1) 0 0 0",
            color: "var(--neutral-700)",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          <li style={{ marginBottom: "var(--spacing-1)" }}>
            Add spouse first, then children will automatically have both parents if you attach to one parent who has a spouse.
          </li>
          <li style={{ marginBottom: "var(--spacing-1)" }}>Use Edit on avatars to quickly update names and details.</li>
          <li>Image URL and Social media are optional — if provided they will be used in member profile and export.</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "var(--spacing-3)",
    borderRadius: "var(--radius-xl)",
    boxShadow: "var(--shadow-lg)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(10px)",
    transition: "all var(--transition-base)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-2)",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: "clamp(13px, 3vw, 14px)",
    fontWeight: 500,
    color: "var(--neutral-700)",
    gap: "var(--spacing-1)",
  },
  input: {
    padding: "clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)",
    fontSize: "clamp(14px, 3vw, 15px)",
    borderRadius: "var(--radius-md)",
    border: "2px solid var(--neutral-200)",
    background: "white",
    transition: "all var(--transition-fast)",
    outline: "none",
    fontFamily: "inherit",
  },
  btnPrimary: {
    padding: "clamp(10px, 2vw, 12px) clamp(16px, 4vw, 24px)",
    background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-md)",
    fontWeight: 600,
    fontSize: "clamp(14px, 3vw, 15px)",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
    boxShadow: "var(--shadow-sm)",
  },
  btnAlt: {
    padding: "clamp(10px, 2vw, 12px) clamp(16px, 4vw, 24px)",
    background: "var(--neutral-100)",
    border: "2px solid var(--neutral-200)",
    borderRadius: "var(--radius-md)",
    fontWeight: 600,
    fontSize: "clamp(14px, 3vw, 15px)",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
    color: "var(--neutral-700)",
  },

  previewRow: {
    display: "flex",
    gap: "var(--spacing-2)",
    alignItems: "center",
    marginTop: "var(--spacing-1)",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "var(--shadow-sm)",
    border: "2px solid white",
  },
  previewImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
};
