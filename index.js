require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/user");
const productsRouter = require("./routes/products");
const categoryRouter = require("./routes/category");
const cors = require("cors");
require("express-async-errors");
require("./db");
const port = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use("/user", userRouter);
app.use("/products", productsRouter);
app.use("/category", categoryRouter);

app.use((err, req, res, next) => {
  // console.error(err);
  const statusCode = err.statusCode || 500;
  //   if (statusCode >= 500) {
  //     const err = res.status(statusCode).json({
  //       message: "something went wrong",
  //       type: "Internal_server_Error",
  //       details: [],
  //     });
  //   } else {
  console.error(err);
  res.status(statusCode).json({
    message: err.message,
    type: err.type,
    details: err.details,
  });
  //   }
});

app.listen(port, () => {
  console.log(`app listening on port : ${port}`);
});
