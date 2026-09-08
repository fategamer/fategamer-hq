function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json").json(body);
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { ok: false, error: "Method not allowed" });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return json(res, 503, { ok: false, error: "Payments are not configured yet." });

  const reference = String(req.query?.reference || "").trim();
  if (!reference) return json(res, 400, { ok: false, error: "Missing transaction reference." });

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const data = await response.json();

    if (!response.ok || !data.status) {
      return json(res, 502, { ok: false, error: data.message || "Unable to verify payment." });
    }

    return json(res, 200, {
      ok: true,
      status: data.data?.status || "unknown",
      reference: data.data?.reference || reference,
      amount: data.data?.amount,
      currency: data.data?.currency,
      channel: data.data?.channel,
      paid_at: data.data?.paid_at || null
    });
  } catch (error) {
    console.error("Paystack verification error", error);
    return json(res, 500, { ok: false, error: "Unable to verify payment." });
  }
};
