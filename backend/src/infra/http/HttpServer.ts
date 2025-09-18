import express, { Express } from 'express';
import BaseController from './../../application/controller/BaseController';
import ProductController from '../../application/controller/ProductController';

export const BaseRoute = 'arobuxtamotobombas';

export class HttpServer {
  app: Express;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    this.app.use(`/${BaseRoute}/`, BaseController);
    this.app.use(`/${BaseRoute}/product`, ProductController);
  }

  start(port: number) {
    this.app.listen(port, () => console.log(`server started at ${port}`));
  }
}
