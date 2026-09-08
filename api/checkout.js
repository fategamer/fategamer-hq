const crypto = require("crypto");

const CATALOG = {
  "classic-tshirt": { name: "Classic T-Shirt", amount: 25, type: "merch" },
  "premium-hoodie": { name: "Premium Hoodie", amount: 60, type: "merch" },
  "limited-vinyl": { name: "Limited Vinyl", amount: 40, type: "merch" },
  "bundle-pack": { name: "Bundle Pack", amount: 100, type: "merch" },
  "studio-session": { name: "Studio Session", amount: 200, type: "service" },
  "masterclass": { name: "Masterclass", amount: 75, type: "service" },
  "meet-greet": { name: "Meet & Greet", amount: 100, type: "service" },
  "custom-song": { name: "Custom Song", amount: 500, type: "service" },
  "feature-collab": { name: "Feature Collab", amount: 1000, type: "service" },
  "music-video": { name: "Music Video", amount: 750, type: "service" },
  "private-performance": { name: "Private Performance", amount: 2500, type: "service" }
};

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json").json(body);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed" });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return json(res, 503, { ok: false, error: "Payments are not configured yet." });

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  } catch (_) {
    return json(res, 400, { ok: false, error: "Invalid request body." });
  }

  const productId = String(body.productId || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const customerName = String(body.name || "").trim().slice(0, 120);
  const phone = String(body.phone || "").trim().slice(0, 30);
  const shippingAddress = String(body.shippingAddress || "").trim().slice(0, 500);
  const item = CATALOG[productId];

  if (!item) return json(res, 400, { ok: false, error: "Unknown product or service." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(res, 400, { ok: false, error: "A valid email is required." });
  if (item.type === "merch" && !shippingAddress) return json(res, 400, { ok: false, error: "A shipping address is required for physical products." });

  const currency = (process.env.PAYSTACK_CURRENCY || "USD").toUpperCase();
  const reference = `fg_${productId}_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
  const origin = req.headers.origin || `https://${req.headers.host}`;

  const payload = {
    email,
    amount: String(Math.round(item.amount * 100)),
    currency,
    reference,
    callback_url: `${origin}/?payment=verify&reference=${encodeURIComponent(reference)}`,
    metadata: JSON.stringify({
      brand: "FATE GAMER",
      productId,
      product: item.name,
      type: item.type,
      customerName,
      phone,
      shippingAddress
    })
  };

  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || !data.status) {
      return json(res, 502, { ok: false, error: data.message || "Payment initialization failed." });
    }

    return json(res, 200, {
      ok: true,
      product: item.name,
      amount: item.amount,
      currency,
      reference,
      authorization_url: data.data.authorization_url
    });
  } catch (error) {
    console.error("Paystack checkout error", error);
    return json(res, 500, { ok: false, error: "Unable to start checkout. Please try again." });
  }
};
