const express = require("express");
const { spawn } = require("child_process");

const router = express.Router();

router.get("/", (req, res) => {
  const pythonCode = `
print("Hello from Python!")
print("Python version:", __import__('sys').version)
    `;

  const pythonProcess = spawn("python3", ["-c", pythonCode]);

  let output = "";
  let error = "";

  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    error += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      res.json({ success: true, output });
    } else {
      res.json({ success: false, error });
    }
  });
});

router.post("/", (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "No code provided" });
  }

  const pythonProcess = spawn("python3", ["-u", "-c", code]);

  pythonProcess.stdout.on("data", (data) => {
    const outputString = data.toString();
    console.log("Real-time Output:", outputString, Date.now());
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Error:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      res.json({
        success: true,
        message: "Python script executed successfully.",
      });
    } else {
      res.json({ success: false, error: "Python script execution failed." });
    }
  });
});

module.exports = router;
