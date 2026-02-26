import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ZoJacks')

def lambda_handler(event, context):
    params = event.get('queryStringParameters') or {}

    try:
        limit = int(params.get('limit', 25))
    except ValueError:
        limit = 25

    limit = max(1, min(limit, 100))

    response = table.scan(Limit=limit)
    items = response.get('Items', [])

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({
            'count': len(items),
            'items': items
        })
    }
