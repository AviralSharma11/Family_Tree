import React from "react";
import MemberCard from "./MemberCard.jsx";

/*
  FamilyTree (updated)
  - removed horizontal scrolling for children
  - children now wrap to new lines (flex-wrap) and are centered
  - keeps canonical root logic and overall structure
*/

export default function FamilyTree({ members = {}, updateMember, deleteMember }) {
  const map = members;

  const isCanonicalRoot = (m) => {
    if (!m) return false;
    if (m.parents && m.parents.length) return false;
    const s = map[m.spouseId];
    if (!s) return true;
    if (s.parents && s.parents.length) return false;
    return m.id <= s.id;
  };

  const roots = Object.values(map).filter(isCanonicalRoot);

  return (
    <div style={styles.container}>
      {roots.length === 0 ? <div style={styles.empty}>No root members. Add someone in Dashboard.</div> : null}

      <div style={styles.stack}>
        {roots.map(root => (
          <div key={root.id} style={styles.rootRow}>
            <Node node={root} map={map} updateMember={updateMember} deleteMember={deleteMember} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Node({ node, map, updateMember, deleteMember }) {
  const children = Object.values(map).filter(m => (m.parents || []).includes(node.id));
  const spouse = map[node.spouseId];

  return (
    <div style={styles.nodeColumn}>
      <div style={styles.parentRow}>
        <div style={styles.parentInner}>
          <MemberCard member={node} spouse={spouse} updateMember={updateMember} deleteMember={deleteMember} />
          {spouse && <div style={styles.spouseGap} />}
          {spouse && <MemberCard member={spouse} spouse={node} updateMember={updateMember} deleteMember={deleteMember} />}
        </div>

        {spouse && <div style={styles.marriageLine} />}
      </div>

      {children.length > 0 && (
        <div style={styles.childrenSection}>
          <svg width="14" height="20" style={styles.verticalSvg}>
            <line x1="7" y1="0" x2="7" y2="20" stroke="#9CA3AF" strokeWidth="2" />
          </svg>

          <div style={styles.horizontalConnectorWrapper}>
            <div style={styles.horizontalConnector} />
          </div>

          {/* children row no longer scrolls horizontally; it wraps */}
          <div style={styles.childrenScroll}>
            <div style={styles.childrenRow}>
              {children.map(child => (
                <div key={child.id} style={styles.childCell}>
                  <Node node={child} map={map} updateMember={updateMember} deleteMember={deleteMember} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { width: "100%" },
  empty: {
    color: "var(--neutral-500)",
    fontSize: 16,
    textAlign: "center",
    padding: "var(--spacing-4)",
  },

  stack: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-5)",
    padding: "var(--spacing-3)",
    boxSizing: "border-box",
    width: "100%",
  },

  rootRow: { width: "100%" },

  nodeColumn: { display: "flex", flexDirection: "column", alignItems: "center" },

  parentRow: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  parentInner: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-3)",
    zIndex: 2,
    marginBottom: "var(--spacing-2)",
  },

  spouseGap: { width: "var(--spacing-2)" },

  marriageLine: {
    height: 3,
    width: "40%",
    background: "linear-gradient(90deg, var(--neutral-300) 0%, var(--neutral-400) 50%, var(--neutral-300) 100%)",
    borderRadius: "var(--radius-sm)",
    boxShadow: "var(--shadow-sm)",
  },

  childrenSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  verticalSvg: {
    marginTop: "var(--spacing-1)",
    marginBottom: "var(--spacing-1)",
  },

  horizontalConnectorWrapper: {
    width: "90%",
    display: "flex",
    justifyContent: "center",
  },

  horizontalConnector: {
    height: 3,
    width: "100%",
    background: "linear-gradient(90deg, var(--neutral-300) 0%, var(--neutral-400) 50%, var(--neutral-300) 100%)",
    borderRadius: "var(--radius-sm)",
    boxShadow: "var(--shadow-sm)",
  },

  childrenScroll: {
    width: "100%",
    overflowX: "visible",
    paddingTop: "var(--spacing-2)",
  },

  childrenRow: {
    display: "flex",
    gap: "var(--spacing-3)",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingBottom: "var(--spacing-2)",
    flexWrap: "wrap",
  },

  childCell: {
    display: "inline-block",
    verticalAlign: "top",
    minWidth: 180,
    marginBottom: "var(--spacing-2)",
  }
};
