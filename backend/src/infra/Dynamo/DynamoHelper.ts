import DynamoDbTableGateway from './DynamoDbTableGateway';

export default class DynamoHelper {
  async put(element: any): Promise<any> {
    console.log(process.env.TABLE_NAME);
    const data = new DynamoDbTableGateway(String(process.env.TABLE_NAME));
    return data.put(element);
  }

  async query(id: string): Promise<any> {
    const data = new DynamoDbTableGateway(String(process.env.TABLE_NAME));
    const expression = {
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': `${id}` },
    };
    const response: any = await data.query(expression);
    const [item] = response.Items;
    return item;
  }
}
