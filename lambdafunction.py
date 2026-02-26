import json
import boto3

# Connect to DynamoDB and point to the ZoJacks table
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ZoJacks')

def lambda_handler(event, context):
    # Read query parameters from the request (e.g. ?limit=10)
    params = event.get('queryStringParameters') or {}

    # Parse limit, default to 25 if missing or invalid
    try:
        limit = int(params.get('limit', 25))
    except ValueError:
        limit = 25

    # Clamp limit between 1 and 100
    limit = max(1, min(limit, 100))

    # Response headers: JSON content type + allow requests from any origin (CORS)
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://zo-jacks-coding-assignment.vercel.app'
    }

    try:
        # Scan the DynamoDB table and return up to `limit` items
        response = table.scan(Limit=limit)
        items = response.get('Items', [])
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'count': len(items), 'items': items})
        }
    except Exception as e:
        # Return a clean 500 error if the DynamoDB scan fails
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
