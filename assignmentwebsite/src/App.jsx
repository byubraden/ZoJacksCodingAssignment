import { useState } from "react";
import "./App.css";

const LAMBDA_URL =
  "https://eid2jyx3yq6em44lpgkarvqcn40gixum.lambda-url.us-east-2.on.aws/";

function App() {
  const [limit, setLimit] = useState(25);
  const [statusFilter, setStatusFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${LAMBDA_URL}?limit=${limit}`, { method: "GET" });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      
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

  const statusColors = {
    active: "#22c55e",
    inactive: "#ef4444",
    pending: "#f59e0b",
  };

  return (
    <div className="container">
      <h1>Data Viewer</h1>

      <div className="layout">
        <div className="sidebar">
          <div className="control-group">
            <label>Limit <span className="hint">(max 100)</span></label>
            <input
              type="number"
              min={1}
              max={100}
              value={limit}
              onChange={(e) =>
                setLimit(Math.min(100, Math.max(1, Number(e.target.value))))
              }
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

          <button onClick={fetchData} disabled={loading}>
            {loading ? "Loading..." : "Fetch Data"}
          </button>

          {error && <p className="error">Error: {error}</p>}
          {count !== null && (
            <p className="result-count">Showing {items.length} of {count} results</p>
          )}
        </div>

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
