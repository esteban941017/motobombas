import { Router } from 'express';
import { HttpStatusCodes } from '../util/HttpStatusCodes';
import ProductRepository from '../repository/ProductRepository';
import DynamoHelper from '../../infra/Dynamo/DynamoHelper';

const routes = Router();
let dynamoHelper: DynamoHelper;
let productRepository: ProductRepository;

dynamoHelper = new DynamoHelper();
productRepository = new ProductRepository(dynamoHelper);

routes.get('/', async (req, res) => {
  try {
    await productRepository.addProduct({
      id: `${crypto.randomUUID()}`,
      name: 'Eugenio',
      lastName: 'Rocha',
      phone: '5531990723700',
      email: 'test@teste.com',
      message:
        'Olá, tenho interesse em comprar uma motobomba gostosa e barata, por favor entrar em contato, tenho um orçamento de 3928347 reais.',
    });
    // const product = await productRepository.getProduct(
    //   '737d2051-3245-4b15-8ce1-2f9f6078f0e1',
    // );
    return res.status(HttpStatusCodes.OK).json('ok');
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
});

export default routes;
