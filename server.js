const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./controllers/db");

dotenv.config({ path: "./config/config.env" });

connectDb();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/admin", require("./routes/admin.routes"));
app.use("/user", require("./routes/user.routes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port in a ${process.env.NODE_ENV}`);
});
