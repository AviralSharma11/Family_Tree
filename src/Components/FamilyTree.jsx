import React from "react";
import MemberCard from "./MemberCard.jsx";

/*
 Simple recursive renderer:
 - Find roots (members with no parents)
 - Render each node and its children horizontally
*/

export default function FamilyTree({ members = {}, updateMember }) {
  const map = members;

  const roots = Object.values(map).filter(m => !m.parents || m.parents.length === 0);

  return (
    <div>
      {roots.length === 0 ? <div>No root members. Add someone in Dashboard.</div> : null}
      <div style={styles.forest}>
        {roots.map(root => (
          <div key={root.id} style={styles.root}>
            <Node node={root} map={map} updateMember={updateMember} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Node({ node, map, updateMember }) {
  const children = Object.values(map).filter(m => (m.parents || []).includes(node.id));

  return (
    <div style={styles.node}>
      <MemberCard member={node} updateMember={updateMember} spouse={map[node.spouseId]} />
      {children.length > 0 && (
        <div style={styles.children}>
          {children.map(child => (
            <div key={child.id} style={styles.child}>
              <Node node={child} map={map} updateMember={updateMember} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  forest: { display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" },
  root: { minWidth: 220 },
  node: { display: "flex", flexDirection: "column", alignItems: "center" },
  children: { display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" },
  child: { minWidth: 160 }
};