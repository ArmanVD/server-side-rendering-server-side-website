import express from "express";
import { Liquid } from "liquidjs";
import { createServer as createViteServer } from "vite";

const app = express();

async function startServer() {
  // const vite = await createViteServer({
  //   server: { middlewareMode: "html" },
  // });

  // app.use(vite.middlewares);

  app.use(express.static("public"));

  const engine = new Liquid();
  app.engine("liquid", engine.express());
  app.set("views", "./views");
  app.set("view engine", "liquid");

  app.get("/", async (req, res) => {
    console.log("🟢 Received GET request at /");
    res.render("index.liquid");
  });

  app.get("/radio-veronica", async (req, res) => {
    res.render("radio-veronica.liquid");
  });

  app.use((req, res) => {
    res.status(404).render("404.liquid");
  });

  const PORT = 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
