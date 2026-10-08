

// src/api/enquiry.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function sendEnquiry(values) {
  const res = await fetch(`${API_URL}/api/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  // fetch doesn't throw on 400/500 responses, so we check res.ok ourselves.
  // Throwing here makes the Contact form show its "couldn't send" banner.
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Send failed");
  }

  return true;
}