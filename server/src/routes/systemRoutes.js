const express = require("express");
const SystemSettings = require("../models/SystemSettings");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "fitnesshub-api",
    time: new Date().toISOString()
  });
});

// Public endpoint — no auth required — used by login page to get branding
router.get("/settings", async (_req, res) => {
  try {
    const settings = await SystemSettings.getSingleton();
    return res.json({
      systemName: settings.systemName || "FitnessHub",
      tagline: settings.tagline || "Gym Management Platform",
      logoUrl: settings.logoUrl || "",
      heroImageUrl: settings.heroImageUrl || "",
      primaryColor: settings.primaryColor || "#2563eb",
      privacyPolicy: settings.privacyPolicy || "",
      termsOfUse: settings.termsOfUse || "",
      helpCenter: settings.helpCenter || ""
    });
  } catch {
    return res.json({
      systemName: "FitnessHub",
      tagline: "Gym Management Platform",
      logoUrl: "",
      heroImageUrl: "",
      primaryColor: "#2563eb"
    });
  }
});

module.exports = router;
