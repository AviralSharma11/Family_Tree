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
  const childCount = children.length;
  const horizontalLineWidth = Math.max(100, childCount * 80);

  return (
    <div style={styles.nodeColumn}>
      <div style={styles.parentRow}>
        <div style={styles.parentInner}>
          <MemberCard member={node} spouse={spouse} updateMember={updateMember} deleteMember={deleteMember} />
          {spouse && <div style={styles.spouseGap} />}
          {spouse && <MemberCard member={spouse} spouse={node} updateMember={updateMember} deleteMember={deleteMember} />}
        </div>

        {spouse && <svg style={styles.marriageLineSvg} viewBox="0 0 100 4" preserveAspectRatio="none">
          <line x1="0" y1="2" x2="100" y2="2" stroke="url(#marriageGradient)" strokeWidth="3" strokeLinecap="round" />
          <defs>
            <linearGradient id="marriageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--neutral-400)" stopOpacity="0.3" />
              <stop offset="50%" stopColor="var(--neutral-400)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--neutral-400)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>}
      </div>

      {children.length > 0 && (
        <div style={styles.childrenSection}>
          <svg width="2" height="16" style={styles.verticalSvg} viewBox="0 0 2 16" preserveAspectRatio="none">
            <line x1="1" y1="0" x2="1" y2="16" stroke="url(#verticalGradient)" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="verticalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--neutral-400)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--neutral-400)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--neutral-400)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          <svg style={styles.horizontalConnectorSvg} viewBox={`0 0 ${horizontalLineWidth} 4`} preserveAspectRatio="none">
            <line x1="0" y1="2" x2={horizontalLineWidth} y2="2" stroke="url(#horizontalGradient)" strokeWidth="3" strokeLinecap="round" />
            <defs>
              <linearGradient id="horizontalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--neutral-400)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--neutral-400)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--neutral-400)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

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
  container: {
    width: "100%",
    "@media (max-width: 768px)": {
      padding: "0 var(--spacing-2)",
    },
  },
  empty: {
    color: "var(--neutral-500)",
    fontSize: "clamp(14px, 4vw, 16px)",
    textAlign: "center",
    padding: "var(--spacing-4)",
  },

  stack: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(var(--spacing-3), 8vw, var(--spacing-5))",
    padding: "clamp(var(--spacing-2), 4vw, var(--spacing-3))",
    boxSizing: "border-box",
    width: "100%",
  },

  rootRow: { width: "100%" },

  nodeColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },

  parentRow: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  parentInner: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(var(--spacing-2), 4vw, var(--spacing-3))",
    zIndex: 2,
    marginBottom: "var(--spacing-2)",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  spouseGap: { width: "var(--spacing-2)" },

  marriageLineSvg: {
    width: "clamp(60px, 25vw, 120px)",
    height: "4px",
    marginTop: "var(--spacing-1)",
    marginBottom: "var(--spacing-1)",
  },

  childrenSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  verticalSvg: {
    width: "2px",
    height: "clamp(12px, 3vw, 16px)",
    marginTop: "clamp(4px, 1vw, var(--spacing-1))",
    marginBottom: "clamp(4px, 1vw, var(--spacing-1))",
  },

  horizontalConnectorSvg: {
    width: "clamp(100px, 80vw, 400px)",
    height: "4px",
  },

  childrenScroll: {
    width: "100%",
    overflowX: "visible",
    paddingTop: "var(--spacing-2)",
  },

  childrenRow: {
    display: "flex",
    gap: "clamp(var(--spacing-2), 3vw, var(--spacing-3))",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingBottom: "var(--spacing-2)",
    paddingLeft: "var(--spacing-1)",
    paddingRight: "var(--spacing-1)",
    flexWrap: "wrap",
  },

  childCell: {
    display: "inline-block",
    verticalAlign: "top",
    minWidth: "clamp(140px, 30vw, 180px)",
    marginBottom: "var(--spacing-2)",
    flexGrow: 0,
    flexShrink: 0,
  }
};
