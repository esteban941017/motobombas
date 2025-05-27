import { Router } from 'express';
import { HttpStatusCodes } from '../util/HttpStatusCodes';

const routes = Router();

routes.get('/', async (req, res) => {
  try {
    return res.status(HttpStatusCodes.OK).json('EUGENIO É UMA CACHUERRA');
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
});

export default routes;
