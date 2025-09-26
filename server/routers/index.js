import login from "./login.js";
import user from "./user.js";
import category from "./categories.js";
import post from "./post.js";
import chat from "./chat.js";
import report from "./report.js";
import reported from "./reported.js";
import admin from "./admin.js";
import statistics from "./statistics.js"; 

const configure = (app) => {
  app.use("/api", login);
  app.use("/api", user);
  app.use("/api", category);
  app.use("/api", post);
  app.use("/api", chat);
  app.use("/api", report);
  app.use("/api", reported);
  app.use("/api", admin);
    app.use("/api", statistics); 
};

export default configure;