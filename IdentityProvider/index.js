const app = require("./app");
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.info(`sso-server listening on port ${PORT}`);
});