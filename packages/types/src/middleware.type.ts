export type Middleware<T = any> = (context: T, next: Next) => any;
export type ComposedMiddleware<T = any> = (context: T, next?: Next) => Promise<void>;

export type Next = () => Promise<any>;