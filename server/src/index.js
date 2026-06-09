const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const seedDatabase = require("./data/seedDatabase");
const bootstrapSuperAdmin = require("./data/bootstrapSuperAdmin");
const repairAccountProfiles = require("./data/repairAccountProfiles");
const backfillDemoDetails = require("./data/backfillDemoDetails");
const seedMissingData = require("./data/seedMissingData");
const systemRoutes = require("./routes/systemRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const profileRoutes = require("./routes/profileRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup CORS origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://fitnessh-ub.netlify.app"
];

// Add CLIENT_URL from environment variables if specified (supports comma-separated origins)
if (process.env.CLIENT_URL) {
  const envOrigins = process.env.CLIENT_URL.split(",").map(url => url.trim());
  envOrigins.forEach(url => {
    if (url && !allowedOrigins.includes(url)) {
      allowedOrigins.push(url);
    }
  });
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      
      const normalizedOrigin = origin.replace(/\/$/, "");
      const isAllowed = allowedOrigins.some(allowed => {
        return allowed.replace(/\/$/, "") === normalizedOrigin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api", systemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "FitnessHub API is running" });
});

async function startServer() {
  try {
    await connectDB();
    const seeded = await seedDatabase();
    if (seeded) {
      console.log("[mongodb] Seeded initial FitnessHub data");
    }

    const bootstrappedAdmin = await bootstrapSuperAdmin();
    if (bootstrappedAdmin.created) {
      console.log(`[auth] Bootstrapped super-admin account for ${bootstrappedAdmin.email}`);
      console.log(`[auth] Super-admin temporary password: ${bootstrappedAdmin.temporaryPassword}`);
    }

    const repairedProfiles = await repairAccountProfiles();
    if (repairedProfiles.changed) {
      console.log(`[auth] Repaired ${repairedProfiles.changed} coach/member profile records`);
    }

    const demoBackfill = await backfillDemoDetails();
    if (demoBackfill.changed) {
      console.log(`[demo] Backfilled demo details for ${demoBackfill.changed} records`);
    }

    const missingData = await seedMissingData();
    if (missingData.changed) {
      console.log(`[demo] Seeded missing collections/fields: ${missingData.changed} records`);
    }

    app.listen(PORT, () => {
      console.log(`[server] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("[server] Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
