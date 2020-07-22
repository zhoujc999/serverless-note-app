import handler from "../lib/handler";
import dynamoDb from "../lib/dynamodb";
import * as HTTPStatusCodes from "http-status-codes";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  const result = await dynamoDb.get(params);

  if (!result.Item) {
    return {
      statusCode: HTTPStatusCodes.NOT_FOUND,
      body: null
    };
  }

  return {
    statusCode: HTTPStatusCodes.OK,
    body: result.Item
  };
});
