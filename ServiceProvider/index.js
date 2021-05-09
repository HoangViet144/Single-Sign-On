const app = require("./app");
const PORT = process.env.PORT || 4001

app.listen(PORT, () => {
  console.info(`service provider listening on port ${PORT}`);
});