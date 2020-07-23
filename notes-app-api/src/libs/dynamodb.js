import AWS from "aws-sdk";

const client = new AWS.DynamoDB.DocumentClient();

export const get = (params) => client.get(params).promise();
export const put = (params) => client.put(params).promise();
export const query = (params) => client.query(params).promise();
export const update = (params) => client.update(params).promise();
export const remove = (params) => client.delete(params).promise();
