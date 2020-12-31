import { createServer, IncomingMessage, ServerResponse } from "http";
import { Stream } from "stream";
import { compose } from "@polar/compose";
import { ApplicationContext } from "./context";
import { PolarRequest } from "./request";
import { PolarResponse } from "./response";
import { Middleware } from "@polar/types";

export class PolarApplication {
  private middlewares: Middleware[] = [];

  use(fn: Middleware) {
    this.middlewares.push(fn);
  }

  listen(...args) {
    const server = createServer(this.callback());
    return server.listen(...args);
  }

  callback() {
    const fn = compose(this.middlewares);
    const handleRequest = (req: IncomingMessage, res: ServerResponse) => {
      const ctx = this.createContext(req, res);
      const response = this.handleRequest(ctx, fn);
      return response;
    };

    return handleRequest;
  }

  createContext(req: IncomingMessage, res: ServerResponse) {
    const context = new ApplicationContext({
      req,
      res,
      originalUrl: req.url,
      request: new PolarRequest(req),
      response: new PolarResponse(res),
      app: this,
    });
    return context;
  }

  private handleRequest(ctx: ApplicationContext, fnMiddleware: Function) {
    const onerror = (err) => ctx.onError(err);
    const handleResponse = () => this.respond(ctx);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

  private respond(ctx: ApplicationContext) {
    const { res, response, request } = ctx;
    const { status, message, responseType = "text" } = response;

    let body = response.body;

    if (!response.writable) return;

    if (request.method === "head") {
      if (!response.headersSent && !response.has("Content-Length")) {
        const { length } = response;
        if (Number.isInteger(length)) {
          response.length = length;
        }
      }

      return res.end();
    }

    response.set("Content-Type", responseType);

    if (body == null) {
      //TODO:
      if (response.explicitNullBody) {
        response.remove("Content-Type");
        response.remove("Transfer-Encoding");
        return res.end();
      }

      if (ctx.req.httpVersionMajor >= 2) {
        body = String(status);
      } else {
        body = message || String(status);
      }

      if (!response.headersSent) {
        response.responseType = "text/plain";
        response.length = Buffer.byteLength(body);
      }
    }

    if (body) {
      response.status = status;
    }

    if (Buffer.isBuffer(body)) return res.end(body);
    if (typeof body === "string") return res.end(body);
    if (body instanceof Stream) return body.pipe(res);

    // Is Json
    let stringify = JSON.stringify(body);
    if (!response.headersSent) {
      response.length = Buffer.byteLength(stringify);
    }
    res.write(stringify);
    res.end();
  }
}
