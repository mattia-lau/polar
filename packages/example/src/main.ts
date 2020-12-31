import { PolarApplication } from "@polar/core";
import { Router } from "@polar/router";

const boostrap = async () => {
  const app = new PolarApplication();

  const router = new Router();

  router.get("/test", async (ctx, next) => {
    ctx.response.body = "Hello World";

    next();
  });

  router.get("/test/:id", async (ctx, next) => {
    ctx.response.body = ctx.request.params;
    next();
  });
  
  app.use(router.routes());

  app.listen(3000);
};

boostrap();
