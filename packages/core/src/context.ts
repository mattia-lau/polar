import { IncomingMessage, ServerResponse } from "http";
import { PolarApplication } from "./application";
import { PolarRequest } from "./request";
import { PolarResponse } from "./response";

interface ContextProps {
  // Custom Request Response class
  request: PolarRequest;
  response: PolarResponse;

  app: PolarApplication;

  // Raw Request Response from http
  req: IncomingMessage;
  res: ServerResponse;
  originalUrl: string;
}

export class ApplicationContext {
  private _request: PolarRequest;
  private _response: PolarResponse;
  private _req: IncomingMessage;
  private _res: ServerResponse;
  private _originalUrl: string;
  private _app: PolarApplication;

  constructor(options: ContextProps) {
    const { req, request, res, originalUrl, app, response } = options;
    this._req = req;
    this._request = request;
    this._response = response;
    this._originalUrl = originalUrl;
    this._res = res;
    this._app = app;

    // const { cors } = app.options;
    const cors = true;
    if (cors) {
      if (typeof cors === "string") {
        res.setHeader("Access-Control-Allow-Origin", cors);
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
      }
    }
  }

  get request() {
    return this._request;
  }

  get res() {
    return this._res;
  }

  get req() {
    return this._req;
  }

  get originalUrl() {
    return this._originalUrl;
  }

  get app() {
    return this._app;
  }

  get response() {
    return this._response;
  }

  public onError(err: any) {
    this.res.end(JSON.stringify(err));
  }
}
