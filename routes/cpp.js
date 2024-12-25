const express = require("express");
const { spawn } = require("child_process");
const fs = require("fs-extra");

const router = express.Router();

const preprocessUserCode = (userCode) => {
  // Ensure #include <iostream> exists
  if (!userCode.includes("#include <iostream>")) {
    userCode = `#include <iostream>\n` + userCode;
  }

  // Dynamically inject unbuffered output setting into main function
  const updatedCode = userCode.replace(
    /int\s+main\s*\(\s*\)\s*{/,
    `int main() {\n    std::cout.setf(std::ios::unitbuf);` // Enable unbuffered mode
  );

  return updatedCode;
};

router.get("/", async (req, res) => {
  const cppCode = `#include <iostream>
using namespace std;
int main() {
  cout << "Hello, C++!" << endl;
  return 0;
}`;

  try {
    const tempFilePath = "./temp.cpp";
    await fs.writeFile(tempFilePath, cppCode);

    const compileProcess = spawn("g++", [tempFilePath, "-o", "temp"]);

    compileProcess.stdout.on("data", (data) => {
      const outputString = data.toString();
      console.log("Compile Output:", outputString, Date.now());
    });

    compileProcess.stderr.on("data", (data) => {
      console.error("Compile Error:", data.toString());
    });

    compileProcess.on("close", (compileCode) => {
      if (compileCode === 0) {
        const execProcess = spawn("./temp");

        execProcess.stdout.on("data", (data) => {
          const outputString = data.toString();
          console.log("Real-time Output:", outputString, Date.now());
        });

        execProcess.stderr.on("data", (data) => {
          console.error("Execution Error:", data.toString());
        });

        execProcess.on("close", (execCode) => {
          if (execCode === 0) {
            console.log("C++ code executed successfully.");
          } else {
            console.error("C++ code execution failed.");
          }
        });
      } else {
        console.error("C++ code compilation failed.");
      }
    });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
});

router.post("/", async (req, res) => {
  const { code } = req.body;

  try {
    const processedCode = await preprocessUserCode(code);
    console.log("check process code", processedCode);

    const tempFilePath = "./temp.cpp";
    await fs.writeFile(tempFilePath, processedCode);

    const compileProcess = spawn("g++", [tempFilePath, "-o", "temp"]);

    compileProcess.stdout.on("data", (data) => {
      const outputString = data.toString();
      process.stdout.write("Compile Output: " + outputString); // Print to console
    });

    compileProcess.stderr.on("data", (data) => {
      console.error("Compile Error:", data.toString());
    });

    compileProcess.on("close", (compileCode) => {
      if (compileCode === 0) {
        const execProcess = spawn("./temp");

        execProcess.stdout.on("data", (data) => {
          const outputString = data.toString();
          process.stdout.write("Real-time Output: " + outputString); // Print to console
        });

        execProcess.stderr.on("data", (data) => {
          console.error("Execution Error:", data.toString());
        });

        execProcess.on("close", (execCode) => {
          if (execCode === 0) {
            console.log("C++ code executed successfully.");
          } else {
            console.error("C++ code execution failed.");
          }
        });
      } else {
        console.error("C++ code compilation failed.");
      }
    });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
});

module.exports = router;
