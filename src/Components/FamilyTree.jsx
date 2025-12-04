import React, { useEffect, useRef, useState } from "react";
import MemberCard from "./MemberCard.jsx";

/*
  FamilyTree (fixed connector alignment)

  Key changes:
  - Each Node measures its parentInner width (the two avatars + gap) using a ref + ResizeObserver
  - Marriage connector and horizontal child connector are rendered as SVGs sized to that measured width
  - Children row uses justifyContent: "center" to align children under the connector
*/

export default function FamilyTree({
  members = {},
  updateMember,
  deleteMember,
}) {
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
      {roots.length === 0 ? (
        <div style={styles.empty}>
          No root members. Add someone in Dashboard.
        </div>
      ) : null}

      <div style={styles.stack}>
        {roots.map((root) => (
          <div key={root.id} style={styles.rootRow}>
            <Node
              node={root}
              map={map}
              updateMember={updateMember}
              deleteMember={deleteMember}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Node: recursive component representing a member + spouse + children */
function Node({ node, map, updateMember, deleteMember }) {
  const children = Object.values(map).filter((m) =>
    (m.parents || []).includes(node.id)
  );
  const spouse = map[node.spouseId];

  // ref to the parentInner (avatars container) so we can measure width
  const parentInnerRef = useRef(null);
  const [parentInnerWidth, setParentInnerWidth] = useState(0);

  useEffect(() => {
    const el = parentInnerRef.current;
    if (!el) return;

    // measure initially
    const measure = () => setParentInnerWidth(Math.max(0, Math.round(el.getBoundingClientRect().width)));

    // use ResizeObserver when available for better reactivity
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => measure());
      ro.observe(el);
      // initial
      measure();
      return () => ro.disconnect();
    }

    // fallback: window resize
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [parentInnerRef, spouse, node.id]); // re-run if spouse changes

  // width for the connector: if measured width is 0 fallback to 200
  const connectorWidth = parentInnerWidth > 0 ? parentInnerWidth : 200;

  return (
    <div style={styles.nodeColumn}>
      <div style={styles.parentRow}>
        {/* parentInner is the container for 1 or 2 MemberCards */}
        <div ref={parentInnerRef} style={styles.parentInner}>
          <MemberCard
            member={node}
            members={map}
            updateMember={updateMember}
            deleteMember={deleteMember}
          />

          {spouse && <div style={styles.spouseGap} />}

          {spouse && (
            <MemberCard
              member={spouse}
              members={map}
              updateMember={updateMember}
              deleteMember={deleteMember}
            />
          )}
        </div>

        {/* marriage connector drawn with measured width and centered */}
        {spouse && (
          <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 8 }}>
            <svg width={connectorWidth} height="6" role="img" aria-hidden="true">
              <line x1="0" y1="3" x2={connectorWidth} y2="3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      {children.length > 0 && (
        <div style={styles.childrenSection}>
          {/* small vertical line under parent pair */}
          <svg width="14" height="20" style={styles.verticalSvg} aria-hidden="true">
            <line x1="7" y1="0" x2="7" y2="20" stroke="#9CA3AF" strokeWidth="2" />
          </svg>

          {/* horizontal connector centered and sized to match parentInner */}
          <div style={styles.horizontalConnectorWrapper}>
            <svg width={connectorWidth} height="6" style={{ overflow: "visible" }} aria-hidden="true">
              <line x1="0" y1="3" x2={connectorWidth} y2="3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* children row: center children so they're aligned under the connector */}
          <div style={styles.childrenScroll}>
            <div style={styles.childrenRow}>
              {children.map((child) => (
                <div key={child.id} style={styles.childCell}>
                  <Node
                    node={child}
                    map={map}
                    updateMember={updateMember}
                    deleteMember={deleteMember}
                  />
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

  nodeColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    gap: "var(--spacing-3)",
    zIndex: 2,
    marginBottom: "var(--spacing-2)",
    // ensure parentInner shrinks to content and is centered by parent's flex
    alignSelf: "center",
  },

  spouseGap: { width: "var(--spacing-2)" },

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
    // center the connector svg (which is sized to parentInner width)
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: 8,
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
    justifyContent: "center", /* center children under connector */
    paddingBottom: "var(--spacing-2)",
    flexWrap: "wrap",
    boxSizing: "border-box",
    width: "100%",
  },

  childCell: {
    display: "inline-block",
    verticalAlign: "top",
    minWidth: 180,
    marginBottom: "var(--spacing-2)",
  },
};

export { Node };
