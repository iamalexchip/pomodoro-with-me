import { useState } from "react";

export default function Sessionlabel() {
  const [editingSessionLabel, setEditingSessionLabel] = useState(false);

  if (editingSessionLabel) {
    return <input className="nav-label-input" />
  }

  return <button className="nav-label-button" onClick={() => setEditingSessionLabel(true)}>Board bar</button>
}
