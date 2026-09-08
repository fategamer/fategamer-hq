module.exports = async function handler(_req, res) {
  res.status(200).json({
    ok: true,
    service: "FATE GAMER HQ",
    timestamp: new Date().toISOString(),
    payments: Boolean(process.env.PAYSTACK_SECRET_KEY),
    email: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL)
  });
};
