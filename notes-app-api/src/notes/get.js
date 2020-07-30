import { handler } from "../libs/handler";
import { dynamoDBGet } from "../libs/dynamoDB";
import {
  NOT_FOUND,
  OK
} from "http-status-codes";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  const result = await dynamoDBGet(params);

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
