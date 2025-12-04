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
  empty: { color: "#666" },

  stack: {
    display: "flex",
    flexDirection: "column",
    gap: 32,
    padding: 16,
    boxSizing: "border-box",
    width: "100%",
  },

  rootRow: { width: "100%" },

  nodeColumn: { display: "flex", flexDirection: "column", alignItems: "center" },

  parentRow: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center" },

  parentInner: { display: "flex", alignItems: "center", gap: 14, zIndex: 2, marginBottom: 8 },

  spouseGap: { width: 12 },

  marriageLine: { height: 2, width: "40%", background: "#9CA3AF", borderRadius: 2 },

  childrenSection: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center" },

  verticalSvg: { marginTop: 6, marginBottom: 6 },

  horizontalConnectorWrapper: { width: "90%", display: "flex", justifyContent: "center" },

  horizontalConnector: { height: 2, width: "100%", background: "#9CA3AF", borderRadius: 2 },

  /* IMPORTANT CHANGES HERE: remove horizontal scroll, allow wrap and center children */
  childrenScroll: {
    width: "100%",
    overflowX: "visible", /* not scroll */
    paddingTop: 12,
  },

  childrenRow: {
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    justifyContent: "center",  /* center children, even when wrapped */
    paddingBottom: 8,
    flexWrap: "wrap",          /* allow wrapping instead of scrolling */
  },

  childCell: {
    display: "inline-block",
    verticalAlign: "top",
    minWidth: 180,
    marginBottom: 12, /* spacing when wrapped */
  }
};
