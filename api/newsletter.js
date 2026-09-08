function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json").json(body);
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const email = String(body.email || "").trim().toLowerCase().slice(0, 180);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(res, 400, { ok: false, error: "Enter a valid email address." });

  const key = process.env.RESEND_API_KEY;
  const inbox = process.env.NEWSLETTER_TO_EMAIL || process.env.CONTACT_TO_EMAIL || "bookings@fategamer.com";
  const from = process.env.RESEND_FROM_EMAIL;

  if (!key || !from) {
    return json(res, 200, { ok: true, configured: false, message: "Newsletter service is not configured yet." });
  }

  const html = `<h2>New FATE GAMER subscriber</h2><p>${escapeHtml(email)}</p><p>Source: FATE GAMER HQ website</p>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [inbox],
        subject: "New FATE GAMER newsletter subscriber",
        html
      })
    });

    const data = await response.json();
    if (!response.ok) return json(res, 502, { ok: false, error: data.message || "Subscription delivery failed." });
    return json(res, 200, { ok: true, configured: true, id: data.id || null });
  } catch (error) {
    console.error("Newsletter error", error);
    return json(res, 500, { ok: false, error: "Unable to subscribe right now." });
  }
};
