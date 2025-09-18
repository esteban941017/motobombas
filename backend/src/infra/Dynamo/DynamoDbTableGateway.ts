import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, DynamoDBDocumentClient, PutCommand, QueryCommand, QueryCommandInput, QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
export const TYPE_INDEX = 'type_index';

export default class DynamoDbTableGateway {
  private readonly dynamoDBClient: DynamoDBDocumentClient = DynamoDBDocument.from(
    new DynamoDB({
      region: process.env.AWS_REGION,
    }),
    {
      marshallOptions: {
        convertEmptyValues: false,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
      unmarshallOptions: {
        wrapNumbers: false,
      },
    }
  );

  constructor(private readonly tableName: string) {}

  async put(item: any) {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
    });
    return this.dynamoDBClient.send(command);
  }

  async query(params: Partial<QueryCommandInput>): Promise<QueryCommandOutput> {
    const command = new QueryCommand({
      ...params,
      TableName: this.tableName,
    });
    const result = await this.dynamoDBClient.send(command);
    return result;
  }
}
