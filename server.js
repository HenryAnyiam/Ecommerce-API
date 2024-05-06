require("dotenv").config()
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db.config");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const jobs = require("./utils/cronjob");

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => { res.send("Welcome") });

sequelize.sync({ alter: true })
  .then((result) => {
    jobs.cronJob();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    })
  })
  .catch((err) => {
    console.log(err)
  });
