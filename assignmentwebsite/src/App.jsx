import { useState } from "react";
import "./App.css";

// Lambda Function URL loaded from environment variable
const LAMBDA_URL = import.meta.env.VITE_LAMBDA_URL;

function App() {
  // State for user controls
  const [limit, setLimit] = useState(25);
  const [statusFilter, setStatusFilter] = useState("all");

  // State for fetched data and UI feedback
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data from Lambda, then filter client-side by status
  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      // Clamp limit at fetch time so the input can be freely edited
      const clampedLimit = Math.min(100, Math.max(1, Number(limit) || 25));
      const res = await fetch(`${LAMBDA_URL}?limit=${clampedLimit}`, { method: "GET" });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      // Apply status filter on the client side
      const filtered =
        statusFilter === "all"
          ? data.items
          : data.items.filter((item) => item.status === statusFilter);
      setItems(filtered);
      setCount(data.count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Badge colors for each status value — active uses ZoJacks brand green
  const statusColors = {
    active: "#3ecb7f",
    inactive: "#ef4444",
    pending: "#f59e0b",
  };

  return (
    <div className="container">
      <h1>Data Viewer</h1>

      <div className="layout">
        {/* Sidebar: controls for limit, status filter, and fetch button */}
        <div className="sidebar">
          <div className="control-group">
            <label>Limit <span className="hint">(max 100)</span></label>
            <input
              type="number"
              min={1}
              max={100}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              onBlur={(e) => setLimit(Math.min(100, Math.max(1, Number(e.target.value) || 25)))}
            />
          </div>

          <div className="control-group">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Fetch button — disabled while loading */}
          <button onClick={fetchData} disabled={loading}>
            {loading ? "Loading..." : "Fetch Data"}
          </button>

          {/* Error and result count messages */}
          {error && <p className="error">Error: {error}</p>}
          {count !== null && (
            <p className="result-count">Showing {items.length} of {count} results</p>
          )}
        </div>

        {/* Main area: results table or empty state */}
        <div className="main">
          {items.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                      <span
                        className="badge"
                        style={{ background: statusColors[item.status] }}
                      >
                        {item.status}
                      </span>
                    </td>
                    {/* Format ISO timestamp to a readable local date/time */}
                    <td>{new Date(item.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty">No data yet. Set your filters and click Fetch Data.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
