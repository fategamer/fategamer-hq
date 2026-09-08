function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json").json(body);
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 180);
  const reason = String(body.reason || "Inquiry").trim().slice(0, 120);
  const message = String(body.message || "").trim().slice(0, 5000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(res, 400, { ok: false, error: "Name, valid email and message are required." });
  }

  const key = process.env.RESEND_API_KEY;
  const inbox = process.env.CONTACT_TO_EMAIL || "bookings@fategamer.com";
  const from = process.env.RESEND_FROM_EMAIL;

  if (!key || !from) {
    return json(res, 200, { ok: true, configured: false, message: "Contact service is not configured; use email fallback." });
  }

  const html = `<h2>FATE GAMER Website Inquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Inquiry:</strong> ${escapeHtml(reason)}</p><hr><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [inbox],
        reply_to: email,
        subject: `FATE GAMER — ${reason}`,
        html
      })
    });

    const data = await response.json();
    if (!response.ok) return json(res, 502, { ok: false, error: data.message || "Email delivery failed." });
    return json(res, 200, { ok: true, configured: true, id: data.id || null });
  } catch (error) {
    console.error("Contact email error", error);
    return json(res, 500, { ok: false, error: "Unable to send the inquiry right now." });
  }
};
