const path = require("path");
const exphbs = require("express-handlebars");
const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const routes = require("../routes");
const errHandler = require("errorhandler");

module.exports = (app) => {
  // Settings
  app.set("port", process.env.PORT || 3000);
  app.set("views", path.join(__dirname, "views"));
  app.engine(
    ".hbs",
    exphbs.engine({
      defaultLayaout: "main",
      partialsDir: path.join(app.get("views"), "partials"),
      layautsDir: path.join(app.get("views"), "layauts"),
      extname: ".hbs",
      helpers: require("./helpers")
    })
  );
  app.set("view engine", ".hbs");

  // Middlewares
  app.use(morgan("dev"));
  app.use(
    multer({ dest: path.join(__dirname, "../public/upload/temp") }).single(
      "image"
    )
  );
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // routes
  routes(app);

  // static files
  app.use("/public", express.static(path.join(__dirname, "../public")));

  // Error handlers
  if ("development" === app.get("env")) {
    app.use(errHandler);
  }

  return app;
};
