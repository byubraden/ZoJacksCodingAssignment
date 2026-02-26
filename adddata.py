import boto3
from dotenv import load_dotenv
load_dotenv()

# Connect to DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='us-east-2')

# Point to your specific table
table = dynamodb.Table('ZoJacks')

items = [
    {'id': '1',  'name': 'Alice Johnson',   'status': 'active',   'updatedAt': '2024-01-01T00:00:00Z'},
    {'id': '2',  'name': 'Bob Smith',        'status': 'inactive', 'updatedAt': '2024-01-02T08:00:00Z'},
    {'id': '3',  'name': 'Carol White',      'status': 'active',   'updatedAt': '2024-01-03T09:15:00Z'},
    {'id': '4',  'name': 'Jacob Bengtson',      'status': 'pending',  'updatedAt': '2024-01-04T10:30:00Z'},
    {'id': '5',  'name': 'Eva Martinez',     'status': 'active',   'updatedAt': '2024-01-05T11:45:00Z'},
    {'id': '6',  'name': 'Frank Lee',        'status': 'inactive', 'updatedAt': '2024-01-06T12:00:00Z'},
    {'id': '7',  'name': 'Grace Kim',        'status': 'active',   'updatedAt': '2024-01-07T13:15:00Z'},
    {'id': '8',  'name': 'Henry Wilson',     'status': 'pending',  'updatedAt': '2024-01-08T14:30:00Z'},
    {'id': '9',  'name': 'Isla Thompson',    'status': 'active',   'updatedAt': '2024-01-09T15:45:00Z'},
    {'id': '10', 'name': 'Jack Davis',       'status': 'inactive', 'updatedAt': '2024-01-10T16:00:00Z'},
    {'id': '11', 'name': 'Karen Garcia',     'status': 'active',   'updatedAt': '2024-01-11T17:15:00Z'},
    {'id': '12', 'name': 'Liam Rodriguez',   'status': 'pending',  'updatedAt': '2024-01-12T18:30:00Z'},
    {'id': '13', 'name': 'Mia Hernandez',    'status': 'active',   'updatedAt': '2024-01-13T19:45:00Z'},
    {'id': '14', 'name': 'Noah Lopez',       'status': 'inactive', 'updatedAt': '2024-01-14T20:00:00Z'},
    {'id': '15', 'name': 'Olivia Gonzalez',  'status': 'active',   'updatedAt': '2024-01-15T21:15:00Z'},
    {'id': '16', 'name': 'Peter Walker',     'status': 'pending',  'updatedAt': '2024-01-16T22:30:00Z'},
    {'id': '17', 'name': 'Quinn Hall',       'status': 'active',   'updatedAt': '2024-01-17T23:45:00Z'},
    {'id': '18', 'name': 'Rachel Allen',     'status': 'inactive', 'updatedAt': '2024-01-18T07:00:00Z'},
    {'id': '19', 'name': 'Sam Young',        'status': 'active',   'updatedAt': '2024-01-19T08:15:00Z'},
    {'id': '20', 'name': 'Tina Scott',       'status': 'pending',  'updatedAt': '2024-01-20T09:30:00Z'},
]

for item in items:
    table.put_item(Item=item)
    print(f"Added: {item['name']}")

print("Success!")
