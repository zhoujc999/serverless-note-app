import handler from "../lib/handler";
import dynamoDb from "../lib/dynamodb";
import * as HTTPStatusCodes from "http-status-codes";

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

  await dynamoDb.update(params);

  return {
    statusCode: HTTPStatusCodes.NO_CONTENT,
    body: null
  };
});
