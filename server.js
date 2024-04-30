require("dotenv").config()
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db.config");


const PORT = process.env.PORT;
const app = express();

app.use(cors);
app.use(express.json());

app.get("/", (req, res) => { res.send("Welcome") });

sequelize.sync({ alter: true })
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    })
  })
  .catch((err) => {
    console.log(err)
  });
