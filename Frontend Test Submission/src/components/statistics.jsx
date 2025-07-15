import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Statistics.css";

export default function ShortUrlStats() {
  const { shortCode } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`http://localhost:8000/shorturls/${shortCode}`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Failed to fetch stats");

        setData(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, [shortCode]);

  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;
  if (!data) return <p>Loading stats...</p>;

  return (
    <div className="stats-container">
      <h2>📊 URL Statistics</h2>
      <p>
        <strong>🔗 Original URL:</strong>{" "}
        <a href={data.originalUrl} target="_blank" rel="noopener noreferrer">
          {data.originalUrl}
        </a>
      </p>
      <p>
        <strong>🧾 Short Code:</strong> {data.shortCode}
      </p>
      <p>
        <strong>📅 Created At:</strong>{" "}
        {new Date(data.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>⏳ Expiry:</strong> {new Date(data.expiry).toLocaleString()}
      </p>
      <p>
        <strong>👁️ Total Clicks:</strong> {data.totalClicks}
      </p>

      <h3>📌 Click History:</h3>
      {data.clickHistory.length === 0 ? (
        <p>No clicks yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User Agent</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {data.clickHistory.map((click, idx) => (
              <tr key={idx}>
                <td>{new Date(click.timestamp).toLocaleString()}</td>
                <td>{click.userAgent}</td>
                <td>{click.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
