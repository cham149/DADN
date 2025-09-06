import login from "./login.js";
import user from "./user.js";
import category from "./categories.js";
import post from "./post.js";
import chat from "./chat.js";
import report from "./report.js";
import admin from "./admin.js";

const configure = (app) => {
  app.use("/api", login);
  app.use("/api", user);
  app.use("/api", category);
  app.use("/api", post);
  app.use("/api", chat);
  app.use("/api", report);
  app.use("/api", admin);
};

export default configure;