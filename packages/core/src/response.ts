import { OutgoingHttpHeader, OutgoingHttpHeaders, ServerResponse } from "http";
import { Stream } from "stream";

export class PolarResponse<T = any> {
  private _headers: Record<string, string>;
  private _body: T;

  private _responseType: string;
  private _length: number;
  private _explicitNullBody: boolean = false;

  constructor(private readonly res: ServerResponse) {
    // this._headers = res.getHeaders();
  }

  get socket() {
    return this.res.socket;
  }

  get headers() {
    return this._headers;
  }

  set headers(headers) {
    this._headers = headers;
  }

  get status() {
    return this.res.statusCode;
  }

  set status(code: number) {
    if (this.headersSent) return;
    this.res.statusCode = code;
  }

  get message() {
    return this.res.statusMessage;
  }

  set message(message: string) {
    this.res.statusMessage = message;
  }

  get explicitNullBody() {
    return this._explicitNullBody;
  }

  set explicitNullBody(val: boolean) {
    this._explicitNullBody = val;
  }

  get body() {
    return this._body;
  }

  set body(body: T) {
    const origial = this._body;
    this._body = body;

    if (body == null) {
      this.status = 204;
      this.explicitNullBody = true;
      return;
    }

    const type = !this.has("Content-Type");

    if (typeof body === "string") {
      if (type) this.responseType = /^\s*</.test(body) ? "html" : "text/plain";

      this.length = Buffer.byteLength(body);
      return;
    }

    if (Buffer.isBuffer(body)) {
      if (type) this.responseType = "bin";
      this.length = body.length;
    }

    if (body instanceof Stream) {
      //TODO
      if (origial !== body) {
        body.once("error", (err) => {});
        if (origial !== null) {
          this.remove("Content-Length");
        }
      }
      if (type) this.responseType = "bin";
    }

    this._responseType = "application/json";
    return;
  }

  get length() {
    return this._length;
  }

  set length(length: number) {
    this._length = length;
  }

  get responseType() {
    return this._responseType;
  }

  set responseType(type: string) {
    this._responseType = type;
  }

  get headersSent() {
    return this.res.headersSent;
  }

  get writable() {
    if (this.res.writableEnded || this.res.finished) return false;

    if (!this.res.socket) return true;

    return this.res.socket.writable;
  }

  /**
   * @description Response Header Functions
   */
  has(field: string) {
    return this.res.hasHeader(field);
  }

  remove(field: string) {
    if (this.headersSent) return;
    this.res.removeHeader(field);
  }

  set(field: string, val: string) {
    if (this.headersSent) return;

    this.res.setHeader(field, val);
  }

  /**
   * @description Raw Method
   */
  writeHead(
    statusCode: number,
    headers?: OutgoingHttpHeaders | OutgoingHttpHeader[]
  ) {
    this.res.writeHead(statusCode, headers);
  }

  write(chunk: any, cb?: (error: Error) => void) {
    this.res.write(chunk, cb);
  }

  end() {
    this.res.end();
  }
}
