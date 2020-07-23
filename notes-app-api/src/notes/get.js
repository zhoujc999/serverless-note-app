import { handler } from "../libs/handler";
import { get as dynamodbGet } from "../libs/dynamodb";
import {
  NOT_FOUND,
  OK
} from "http-status-codes";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  const result = await dynamodbGet(params);

  if (!result.Item) {
    return {
      statusCode: NOT_FOUND,
      body: null
    };
  }

  return {
    statusCode: OK,
    body: result.Item
  };
});
