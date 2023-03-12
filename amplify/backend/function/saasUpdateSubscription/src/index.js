/* Amplify Params - DO NOT EDIT
	API_SAASSTART_GRAPHQLAPIIDOUTPUT
	API_SAASSTART_MYSUBSCRIPTIONTABLE_ARN
	API_SAASSTART_MYSUBSCRIPTIONTABLE_NAME
	API_SAASSTART_PROFILETABLE_ARN
	API_SAASSTART_PROFILETABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    let data = await getUsers();
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
};


async function getDataAsScanOperation(
    table,
    filter,
    projection=null,
    expressionValue
    ) {
          console.log(`Scanning......`);
           let params = {
    TableName: table,
    FilterExpression: filter,
  };
    if (projection) params.ProjectionExpression = projection;
  if (expressionValue) params.ExpressionAttributeValues = expressionValue;

 let scanResults = [];
  let data;
  try {
    do {
      data = await docClient.scan(params).promise();

      scanResults.push(...data.Items);
      params.ExclusiveStartKey = data.LastEvaluatedKey;
    } while (
      typeof data.LastEvaluatedKey != "undefined" &&
      scanResults.length <= 200000
    );

    return { status: 200, data: scanResults };
  } catch (error) {
    console.log(error);
    return { status: 500, data: null, message: error.message };
  }
        
    }


async function getUsers() {
    let date = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  
    let { status, data } = await getDataAsScanOperation(
      process.env.API_ALPHAMDCITY_LICENSETABLE_NAME,
      "attribute_not_exists(updatedAt) OR updatedAt <= :time OR createdAt <= :time",
      "id",
      {
        ":time": date,
      }
    );
  
    if (status === 200) return data;
  
    return [];
  }