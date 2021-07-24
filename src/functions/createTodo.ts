import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import { document } from "../utils/dynamodbClient";

interface ICreateTodo {
    id: string, // id gerado para garantir um único todo com o mesmo id
    user_id: string, // id do usuário recebido no pathParameters
    title: string,
    done: boolean, // inicie sempre como false
    deadline: string,
}

export const handle:APIGatewayProxyHandler = async (event) => {

    const {
        title,
        deadline,
    } = JSON.parse(event.body) as ICreateTodo; 

    const {user_id} = event.pathParameters;

    await document
    .put({
        TableName: "users_todos",
        Item: {
            id: uuid(),
            user_id, // id do usuário recebido no pathParameters
            title,
            done: false, // inicie sempre como false
            deadline,
        } as ICreateTodo,
    })
    .promise();
    

    return {
        statusCode: 201,
        body: JSON.stringify({
          message: "Todo created!",
        }),
        headers: {
          "Content-type": "application/json",
        },
      };
}

