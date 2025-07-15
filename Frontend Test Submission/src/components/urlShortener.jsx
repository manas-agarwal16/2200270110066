import React, { useState } from "react";
import "../UrlShortenerPage.css";
import { Log } from "../../../Logging Middleware/logger";

const MAX_URLS = 5;

export default function UrlShortener() {
  const [urls, setUrls] = useState([
    { url: "", validity: "", shortCode: "", result: null, error: null },
  ]);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const handleAddUrl = () => {
    if (urls.length < MAX_URLS) {
      setUrls([
        ...urls,
        { url: "", validity: "", shortCode: "", result: null, error: null },
      ]);
    }
  };

  const handleRemoveUrl = (index) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidShortCode = (code) => {
    return /^[a-zA-Z0-9_-]{4,20}$/.test(code);
  };

  const handleSubmit = async () => {
    const newUrls = await Promise.all(
      urls.map(async (entry) => {
        const { url, validity, shortCode } = entry;

        // Validation
        if (!url || !isValidUrl(url)) {
          return { ...entry, result: null, error: "Invalid URL" };
        }

        if (validity && (isNaN(validity) || Number(validity) <= 0)) {
          return {
            ...entry,
            result: null,
            error: "Validity must be a positive number",
          };
        }

        if (shortCode && !isValidShortCode(shortCode)) {
          return {
            ...entry,
            result: null,
            error: "Invalid shortCode format (4–20 chars, alphanum/_/-)",
          };
        }

        // API Call
        try {
          const res = await fetch("http://localhost:8000/shorturls", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: url,
              validity: validity ? Number(validity) : undefined,
              shortCode: shortCode || undefined,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            await Log(
              "frontend",
              "error",
              "api",
              `Error shortening URL: ${data.error || "Unknown error"}`
            );
            throw new Error(data?.error || "Failed to shorten URL");
          }

          return { ...entry, result: data.data, error: null };
        } catch (err) {
          await Log(
            "frontend",
            "error",
            "api",
            `Error shortening URL: ${err.message}`
          );
          return { ...entry, result: null, error: err.message };
        }
      })
    );

    setUrls(newUrls);
  };

  return (
    <div className="shortener-container">
      <h2>URL Shortener</h2>
      {urls.map((url, index) => (
        <div key={index} className="url-entry">
          <input
            type="text"
            placeholder="Original URL"
            value={url.url}
            onChange={(e) => handleChange(index, "url", e.target.value)}
          />
          <input
            type="number"
            placeholder="Validity in minutes (default 30mins)"
            value={url.validity}
            onChange={(e) => handleChange(index, "validity", e.target.value)}
          />
          <input
            type="text"
            placeholder="Preferred Shortcode if any (4–20 chars)"
            value={url.shortCode}
            onChange={(e) => handleChange(index, "shortCode", e.target.value)}
          />
          {urls.length > 1 && (
            <button
              className="remove-btn"
              onClick={() => handleRemoveUrl(index)}
            >
              ✕
            </button>
          )}

          {url.result && (
            <div className="result">
              <p>
                🔗 Short Link:{" "}
                <a
                  href={url.result.shortLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.result.shortLink}
                </a>
              </p>
              <p>
                ⏳ Expires at: {new Date(url.result.expiry).toLocaleString()}
              </p>
            </div>
          )}

          {url.error && <p className="error">❌ {url.error}</p>}
        </div>
      ))}

      <div className="controls">
        <button disabled={urls.length >= MAX_URLS} onClick={handleAddUrl}>
          + Add Another
        </button>
        <button onClick={handleSubmit}>Shorten</button>
      </div>
    </div>
  );
}
