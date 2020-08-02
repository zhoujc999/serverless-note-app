import { handler } from "../libs/handler";
import { dynamoDBUpdate } from "../libs/dynamoDB";
import { NO_CONTENT } from "http-status-codes";

export const main = handler(async (event, context) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.STAGE + "-" + process.env.TABLE_NAME,
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

  await dynamoDBUpdate(params);

  return {
    statusCode: NO_CONTENT,
    body: null
  };
});
