import DynamoHelper from '../../infra/Dynamo/DynamoHelper';

export default class ProductRepository {
  constructor(private readonly dynamoHelper: DynamoHelper) {}

  async addProduct(product: any) {
    await this.dynamoHelper.put(product);
  }

  async getProduct(id: any) {
    return this.dynamoHelper.query(id);
  }
}
