import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";

export class V5AppsyncLambdaDynamodbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Creates the AppSync API
    const appSyncApi = new appsync.GraphqlApi(this, "MyDynamodbApi", {
      name: "cdk-appsync-dynamodb-lambda-api",
      schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
    });

    // lambda function
    const lambdaFunction = new lambda.Function(this, "DynamodbLambda", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "main.handler",
      code: lambda.Code.fromAsset("lambda"),
    });

    // Set the new Lambda function as a data source for the AppSync API
    const appSyncLambdaDS = appSyncApi.addLambdaDataSource(
      "lambdaDataSource",
      lambdaFunction
    );
  }
}
