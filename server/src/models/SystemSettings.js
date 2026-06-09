const mongoose = require("mongoose");

// Singleton document — always use SystemSettings.findOne() or SystemSettings.getSingleton()
const systemSettingsSchema = new mongoose.Schema(
  {
    systemName: { type: String, default: "FitnessHub" },
    tagline: { type: String, default: "Gym Management Platform" },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    supportEmail: { type: String, default: "support@fitnesshub.io" },
    trialDays: { type: Number, default: 14 },
    privacyPolicy: { type: String, default: "" },
    termsOfUse: { type: String, default: "" },
    helpCenter: { type: String, default: "" },
    primaryColor: { type: String, default: "#2563eb" },
    heroImageUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

systemSettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne().lean();
  if (!doc) {
    doc = await this.create({});
    return doc.toObject ? doc.toObject() : doc;
  }
  return doc;
};

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);
