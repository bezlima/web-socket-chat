import app from "./app";
require("dotenv").config();

const PORT = process.env.APP_PORT!;

app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
