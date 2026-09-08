function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json").json(body);
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { ok: false, error: "Method not allowed" });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return json(res, 503, { ok: false, error: "Payments are not configured yet." });

  const reference = String(req.query?.reference || "").trim();
  if (!reference || reference.length > 100) return json(res, 400, { ok: false, error: "Invalid transaction reference." });

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const data = await response.json();

    if (!response.ok || !data.status) {
      return json(res, 502, { ok: false, error: data.message || "Unable to verify payment." });
    }

    const transaction = data.data || {};
    const metadata = typeof transaction.metadata === "string"
      ? (() => { try { return JSON.parse(transaction.metadata); } catch (_) { return {}; } })()
      : (transaction.metadata || {});

    return json(res, 200, {
      ok: true,
      status: transaction.status || "unknown",
      reference: transaction.reference || reference,
      amount: transaction.amount,
      currency: transaction.currency,
      channel: transaction.channel,
      paid_at: transaction.paid_at || null,
      product: metadata.product || null,
      productId: metadata.productId || null,
      type: metadata.type || null,
      customerName: metadata.customerName || null
    });
  } catch (error) {
    console.error("Paystack verification error", error);
    return json(res, 500, { ok: false, error: "Unable to verify payment." });
  }
};
