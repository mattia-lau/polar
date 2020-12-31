import { compose } from "@polar/compose";
import { ApplicationContext } from "@polar/core";
import { HttpMethod, Middleware, Next } from "@polar/types";
import { match } from "path-to-regexp";

interface RouterOptions {
  methods?: HttpMethod[];
}

const initialOptions: RouterOptions = {
  methods: ["HEAD", "OPTIONS", "GET", "PUT", "PATCH", "POST", "DELETE"],
};

export class Router {
  private routers: any = {};

  constructor(private options: RouterOptions = initialOptions) {}

  get(path: string, fn: Middleware<ApplicationContext>) {
    this.register(path, "GET", fn);
    return this;
  }

  post(path: string, fn: Middleware<ApplicationContext>) {
    this.register(path, "POST", fn);
    return this;
  }

  put(path: string, fn: Middleware<ApplicationContext>) {
    this.register(path, "PUT", fn);
    return this;
  }

  del(path: string, fn: Middleware<ApplicationContext>) {
    this.register(path, "DELETE", fn);
    return this;
  }

  patch(path: string, fn: Middleware<ApplicationContext>) {
    this.register(path, "PATCH", fn);
    return this;
  }

  register(
    path: string,
    method: HttpMethod,
    middleware: Middleware<ApplicationContext>
  ) {
    if (!this.options.methods.find((e) => e === method)) {
      console.error(`[${method}] is not support in ${path}`);

      return;
    }

    let routers = this.routers[method];
    if (!routers) {
      routers = this.routers[method] = {};
    }
    this.routers[method][path] = middleware;
  }

  routes() {
    return (ctx: ApplicationContext, next: Next) => {
      let params: Record<string, any> = {};
      const method = ctx.request.method.toUpperCase();

      const methodHandler = this.routers[method];
      if (!methodHandler) {
        ctx.response.status = 404;
        next();
      }

      const keys = Object.keys(methodHandler);

      const search = keys.find((path) => {
        const match = this.match(ctx.originalUrl, path);
        if (match) {
          for (const [key, value] of Object.entries(match.params)) {
            params[key] = value;
          }
        }
        return match;
      });

      const { pathname, searchParams } = ctx.request.URL;
      const handler =
        this.routers[method][search] || this.routers[method][pathname];

      if (pathname === "/favicon.ico") {
        next();
      }

      if (!handler) {
        next();
      }

      const query: Record<string, any> = {};
      for (const [key, value] of searchParams.entries()) {
        query[key] = value;
      }

      ctx.request.params = params;
      ctx.request.query = query;
      return compose([handler])(ctx, next);
    };
  }

  private match<T extends object = object>(incoming: string, original: string) {
    return match<T>(original, {
      encode: encodeURI,
      decode: decodeURIComponent,
    })(incoming);
  }
}
