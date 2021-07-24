import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler  = async (event) => {

    const { user_id } = event.pathParameters;

    const todos = (await document
      .query({
        TableName: "users_todos",
        FilterExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
          ":user_id": user_id,
        },
      })
      .promise()).Items;

    if(todos.length > 0){
        return {
            statusCode: 200,
            body: JSON.stringify(todos),
            headers: {
                "Content-Type": "application/json",
            }
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
          message: "User do not have ToDos",
        }),
        headers: {
            "Content-Type": "application/json",
        }
      };
}

