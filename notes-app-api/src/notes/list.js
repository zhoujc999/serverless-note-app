import handler from "../lib/handler";
import dynamoDb from "../lib/dynamodb";
import * as HTTPStatusCodes from "http-status-codes";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId
    }
  };

  const result = await dynamoDb.query(params);

  return {
    statusCode: HTTPStatusCodes.OK,
    body: result.Items
  };
});
