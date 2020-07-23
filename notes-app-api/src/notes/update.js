import { handler } from "../libs/handler";
import { update as dynamoDbUpdate } from "../libs/dynamodb";
import { NO_CONTENT } from "http-status-codes";

export const main = handler(async (event, context) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    },
    UpdateExpression: "SET content = :content, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":content": data.content || null
    },
    ReturnValues: "ALL_NEW"
  };

  await dynamoDbUpdate(params);

  return {
    statusCode: NO_CONTENT,
    body: null
  };
});
