import { Events } from "@polar/types";
import { IncomingHttpHeaders, IncomingMessage } from "http";

export class PolarRequest {
  private _headers: IncomingHttpHeaders;
  private _url?: string;
  private _params: Record<string, string>;
  private _query: Record<string, string>;
  private _body: Record<string, string> | string;
  private _method?: string;

  private memoizedURL: URL;

  constructor(private readonly req: IncomingMessage) {
    this._headers = req.headers;
    this._url = req.url;
    this._method = req.method;
  }

  get header() {
    return this._headers;
  }

  set header(val: IncomingHttpHeaders) {
    this._headers = val;
  }

  get url() {
    return this._url;
  }

  set url(val: string) {
    this._url = val;
  }

  get socket() {
    return this.req.socket;
  }

  get secure() {
    return "https" === this.protocol;
  }

  get(field: string) {
    const req = this.req;
    switch ((field = field.toLowerCase())) {
      case "referer":
      case "referrer":
        return req.headers.referrer || req.headers.referer || "";
      default:
        return req.headers[field] || "";
    }
  }

  get host() {
    const proxy = "";
    // const proxy = this.app.options.proxy;
    let host = proxy && (this.get("X-Forwarded-Host") as string);
    if (!host) {
      if (this.req.httpVersionMajor >= 2)
        host = this.get(":authority") as string;
      if (!host) host = this.get("Host") as string;
    }
    if (!host) return "";
    return (host as string).split(/\s*,\s*/, 1)[0];
  }

  get URL() {
    /* istanbul ignore else */
    if (!this.memoizedURL) {
      const originalUrl = this.url || ""; // avoid undefined in template string
      try {
        this.memoizedURL = new URL(`${this.origin}${originalUrl}`);
      } catch (err) {
        this.memoizedURL = Object.create(null);
      }
    }
    return this.memoizedURL;
  }

  get hostname() {
    const host = this.host;
    if (!host) return "";
    if ("[" === host[0]) return this.URL.hostname || ""; // IPv6
    return host.split(":", 1)[0];
  }

  get protocol() {
    if ((this.socket as any).encrypted) return "https";
    const proxy = "";
    if (proxy) return "http";
    // if (!this.app.options.proxy) return "http";
    const proto = this.get("X-Forwarded-Proto") as string;
    return proto ? proto.split(/\s*,\s*/, 1)[0] : "http";
  }

  get origin() {
    return `${this.protocol}://${this.host}`;
  }

  set params(val: Record<string, any>) {
    this._params = val;
  }

  get params() {
    return this._params;
  }

  get method() {
    return this._method.toLowerCase();
  }

  set body(val: Record<string, any> | string) {
    this._body = val;
  }

  get body() {
    return this._body;
  }

  set query(val: Record<string, any>) {
    this._query = val;
  }

  get query() {
    return this._query;
  }

  on(event: Events, listener: (...args: any[]) => void) {
    return this.req.on(event, listener);
  }
}
