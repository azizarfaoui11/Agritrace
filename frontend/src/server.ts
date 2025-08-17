import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques du build CRA
app.use(express.static(path.join(__dirname, "build")));

// Rediriger toutes les routes vers index.html (SPA)
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend listening on port ${PORT}`);
});
