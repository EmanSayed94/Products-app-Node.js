const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.info("connected to mongo successfuly"))
  .catch((err) => {
    console.error(err);
  });
