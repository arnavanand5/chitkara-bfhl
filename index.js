const express = require("express");
const dotenv = require("dotenv");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));


dotenv.config();


const app = express();
app.use(express.json({ limit: "1mb" }));

const EMAIL = process.env.OFFICIAL_EMAIL;

// ---------- Utility Functions ----------

// Fibonacci
function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];

  const res = [0, 1];
  while (res.length < n) {
    res.push(res[res.length - 1] + res[res.length - 2]);
  }
  return res;
}

// Prime check
function isPrime(num) {
  if (num <= 1 || !Number.isInteger(num)) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

// GCD
function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

// HCF
function hcf(arr) {
  return arr.reduce((acc, val) => gcd(acc, val));
}

// LCM
function lcm(arr) {
  const lcmTwo = (a, b) => Math.abs(a * b) / gcd(a, b);
  return arr.reduce((acc, val) => lcmTwo(acc, val));
}

// ---------- GET /health ----------

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: "arnav0198.be23@chitkara.edu.in",
  });
});

// ---------- POST /bfhl ----------

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    // Validate body
    if (!body || typeof body !== "object") {
      return res.status(400).json({
        is_success: false,
        official_email: "arnav0198.be23@chitkara.edu.in",
      });
    }

    const keys = Object.keys(body);

    // Must contain exactly ONE key
    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: "arnav0198.be23@chitkara.edu.in",
      });
    }

    const key = keys[0];
    const value = body[key];

    // ---------- fibonacci ----------
    if (key === "fibonacci") {
      if (!Number.isInteger(value) || value < 0) {
        return res.status(400).json({
          is_success: false,
          official_email: "arnav0198.be23@chitkara.edu.in",
        });
      }

      return res.status(200).json({
        is_success: true,
        official_email: "arnav0198.be23@chitkara.edu.in",
        data: fibonacci(value)
      });
    }

    // ---------- prime ----------
    if (key === "prime") {
      if (!Array.isArray(value)) {
        return res.status(400).json({
          is_success: false,
          official_email: "arnav0198.be23@chitkara.edu.in",
        });
      }

      const primes = value.filter(isPrime);

      return res.status(200).json({
        is_success: true,
        official_email: "arnav0198.be23@chitkara.edu.in",
        data: primes
      });
    }

    // ---------- lcm ----------
    if (key === "lcm") {
      if (!Array.isArray(value) || value.length === 0 || value.some(v => typeof v !== "number")) {
        return res.status(400).json({
          is_success: false,
          official_email: "arnav0198.be23@chitkara.edu.in",
        });
      }

      return res.status(200).json({
        is_success: true,
        official_email: "arnav0198.be23@chitkara.edu.in",
        data: lcm(value)
      });
    }

    // ---------- hcf ----------
    if (key === "hcf") {
      if (!Array.isArray(value) || value.length === 0 || value.some(v => typeof v !== "number")) {
        return res.status(400).json({
          is_success: false,
          official_email: "arnav0198.be23@chitkara.edu.in",
        });
      }

      return res.status(200).json({
        is_success: true,
        official_email: "arnav0198.be23@chitkara.edu.in",
        data: hcf(value)
      });
    }

/// ---------- AI ----------
if (key === "AI") {
  if (typeof value !== "string" || value.trim().length === 0) {
    return res.status(400).json({
      is_success: false,
      official_email: "arnav0198.be23@chitkara.edu.in",
    });
  }

  let geminiRes;
  let geminiData;

  try {
    // ✅ FIXED: Use gemini-1.5-flash or gemini-1.5-pro instead
    geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: value }],
            },
          ],
        }),
      }
    );
  } catch (err) {
    console.error("FETCH FAILED:", err);
    return res.status(500).json({
      is_success: false,
      official_email: "arnav0198.be23@chitkara.edu.in",
    });
  }

  try {
    geminiData = await geminiRes.json();
  } catch (err) {
    console.error("JSON PARSE FAILED:", err);
    return res.status(500).json({
      is_success: false,
      official_email: "arnav0198.be23@chitkara.edu.in",
    });
  }

  // Check for Gemini API errors
  if (!geminiRes.ok || geminiData.error) {
    console.error("GEMINI ERROR:", geminiData.error);
    return res.status(500).json({
      is_success: false,
      official_email: "arnav0198.be23@chitkara.edu.in",
    });
  }

  let answer = "Unknown";

  if (
    geminiData.candidates &&
    geminiData.candidates[0] &&
    geminiData.candidates[0].content &&
    geminiData.candidates[0].content.parts &&
    geminiData.candidates[0].content.parts[0] &&
    geminiData.candidates[0].content.parts[0].text
  ) {
    answer = geminiData.candidates[0].content.parts[0].text;
  }

  // ✅ FIXED: Return full answer instead of just first word
  return res.status(200).json({
    is_success: true,
    official_email: "arnav0198.be23@chitkara.edu.in",
  data: answer.replace(/[^a-zA-Z]/g, " ").trim().split(/\s+/).slice(-1)[0]
  });
}



    // ---------- Invalid key ----------
    return res.status(400).json({
      is_success: false,
      official_email: "arnav0198.be23@chitkara.edu.in",
    });

  } catch (err) {
    // Graceful error handling
    return res.status(500).json({
      is_success: false,
      official_email: "arnav0198.be23@chitkara.edu.in",
    });
  }
});

// ---------- Server ----------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
