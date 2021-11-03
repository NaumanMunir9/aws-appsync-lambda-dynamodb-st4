import { DynamoDB } from "aws-sdk";

const documentClient = new DynamoDB.DocumentClient();

type AppSyncEvent = {
  info: {
    fieldName: String;
  };
  arguments: {
    product: Product;
    productId: String;
  };
};

type Product = {
  id: String;
  name: String;
  price: Number;
};

export async function handler(event: AppSyncEvent) {
  if (event.info.fieldName == "welcome") {
    return `Hello World!`;
  } else if (event.info.fieldName == "addProduct") {
    event.arguments.product.id = `key-${Math.random()}`;
    const params = {
      TableName: process.env.TABLE_NAME || "",
      Item: event.arguments.product,
    };
    const data = await documentClient.put(params).promise();
    console.log(`After Adding ${data}`);
    return event.arguments.product;
  } else if (event.info.fieldName == "deleteProduct") {
    event.arguments.product.id = `key-${Math.random()}`;
    const params = {
      TableName: process.env.TABLE_NAME || "",
      Key: {
        id: event.arguments.productId,
      },
    };
    const data = await documentClient.delete(params).promise();
    console.log(`After Deleting ${data}`);
    return `Product Deleted`;
  } else {
    return `Not Found!`;
  }
}
