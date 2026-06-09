import React from "react";
import { useSmallScreen } from "./utils";

export function Table({ headers, rows }) {
  const isSmallScreen = useSmallScreen();

  if (isSmallScreen) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {row.map((cell, ci) => (
                <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 5, paddingBottom: ci === row.length - 1 ? 0 : 10, borderBottom: ci === row.length - 1 ? "none" : "1px solid var(--border)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {headers[ci]}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text)" }}>{cell}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: "10px 16px", textAlign: "left", color: "var(--muted)",
                fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em",
                borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: "14px 16px", color: "var(--text)", fontSize: 14, verticalAlign: "top" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
