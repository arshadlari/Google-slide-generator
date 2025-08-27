import express from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load environment variables from .env.local
try {
  const envContent = readFileSync(join(__dirname, ".env.local"), "utf-8");
  const lines = envContent.split("\n");
  lines.forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
  console.log("Environment variables loaded from .env.local");
} catch (error) {
  console.log("No .env.local file found or error reading it");
}

// Import API handlers dynamically
async function loadApiHandler(path) {
  try {
    const module = await import(`./api/${path}.js`);
    return module.default;
  } catch (error) {
    console.error(`Error loading API handler ${path}:`, error);
    return null;
  }
}

// API routes
app.all("/api/:endpoint", async (req, res) => {
  const { endpoint } = req.params;
  const handler = await loadApiHandler(endpoint);

  if (!handler) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  try {
    // Create a mock Vercel request/response object
    const mockReq = {
      ...req,
      query: { ...req.query, ...req.body },
    };

    const mockRes = {
      status: (code) => {
        res.statusCode = code;
        return mockRes;
      },
      json: (data) => res.json(data),
      redirect: (url) => res.redirect(url),
      setHeader: (name, value) => res.setHeader(name, value),
      end: () => res.end(),
      writeHead: (code, headers) => {
        res.statusCode = code;
        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            res.setHeader(key, value);
          });
        }
      },
    };

    await handler(mockReq, mockRes);
  } catch (error) {
    console.error(`Error in ${endpoint} handler:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Dev API server running on http://localhost:${PORT}`);
  console.log("API endpoints:");
  console.log(`  - http://localhost:${PORT}/api/auth`);
  console.log(`  - http://localhost:${PORT}/api/user`);
  console.log(`  - http://localhost:${PORT}/api/logout`);
  console.log(
    "\nTo test: Update your frontend to use localhost:3001 for API calls"
  );
});
