import { handler } from "../libs/handler";
import { dynamoDBQuery } from "../libs/dynamoDB";
import { OK } from "http-status-codes";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId
    }
  };

  const result = await dynamoDBQuery(params);

  return {
    statusCode: OK,
    body: result.Items
  };
});
