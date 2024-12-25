const express = require("express");
const { spawn } = require("child_process");
const pythonRouter = require("./routes/python");
const cppRouter = require("./routes/cpp");

const app = express();

app.use(express.json());

app.use("/python", pythonRouter);
app.use("/cpp", cppRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
