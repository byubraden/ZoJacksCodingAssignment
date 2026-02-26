# ZoJacks Interview Assignment

A full-stack serverless data viewer built with React, AWS Lambda, and DynamoDB.

**Live demo:** https://zo-jacks-coding-assignment.vercel.app

---

## Architecture Overview

```
Browser (React + Vite)
        │
        │  HTTP GET  ?limit=N
        ▼
AWS Lambda (Function URL)
        │
        │  DynamoDB Scan
        ▼
AWS DynamoDB  (ZoJacks table)
```

- **Frontend** — React (Vite) app with a sidebar for controls (limit + status filter (client side filtering)) and a table for results
- **Lambda** — Python function exposed via a public Function URL; accepts a `limit` query parameter (1–100, default 25), scans DynamoDB, and returns JSON
- **DynamoDB** — Single table (`ZoJacks`) with items containing `id`, `name`, `status`, and `updatedAt`

---

## Local Setup

**Prerequisites:** Node.js and npm

```bash
cd assignmentwebsite
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

> The frontend reads the Lambda URL from the `VITE_LAMBDA_URL` environment variable. Create `assignmentwebsite/.env` with your own URL to run locally, or set it in your hosting provider's environment variables.

---

## Replicating on AWS

### 1. Create the DynamoDB Table

1. Go to **AWS Console → DynamoDB → Create table**
2. Table name: `ZoJacks`
3. Partition key: `id` (String)
4. Leave all other settings as default and click **Create**

### 2. Seed the Table

Install dependencies:

```bash
pip install boto3 python-dotenv
```

Configure your AWS credentials via `aws configure` or environment variables (What I did), then run:

```bash
python adddata.py
```

This inserts 20 sample records into the `ZoJacks` table.

### 3. Create the Lambda Function

1. Go to **AWS Console → Lambda → Create function**
2. Choose **Author from scratch**
3. Runtime: **Python 3.x**
4. Paste or upload the contents of `lambdafunction.py`
5. Attach an IAM execution role with **AmazonDynamoDBReadOnlyAccess** 

### 4. Add a Function URL

1. In your Lambda, go to **Configuration → Function URL → Create function URL**
2. Auth type: `NONE` (public)
3. Enable **CORS** and allow your frontend's origin (or `*` for development)
4. Copy the generated URL and update `LAMBDA_URL` in `assignmentwebsite/src/App.jsx`

---

## Example curl Command

```bash
curl "https://<your-function-url>/?limit=5"
```

Example response:

```json
{
  "count": 5,
  "items": [
    { "id": "1", "name": "Alice Johnson", "status": "active", "updatedAt": "2024-01-01T00:00:00Z" },
    { "id": "2", "name": "Bob Smith",     "status": "inactive", "updatedAt": "2024-01-02T08:00:00Z" }
  ]
}
```

**Query parameters:**

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `limit` | integer | `25` | 1–100 | Max number of items to return |

---

## Cost Awareness

This project uses AWS services that fall within the **free tier** for low-volume use.

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Lambda** | 1M requests/month, 400K GB-seconds compute | Function runs are fast and small |
| **DynamoDB** | 25 GB storage, 25 RCUs/WCUs (provisioned) | On-demand: ~$0.25/million reads beyond free tier |
| **Data Transfer** | 100 GB/month outbound | Responses are small JSON payloads |

At this scale, **expected cost is $0/month**. Note that DynamoDB `Scan` reads the entire table and is less efficient than `Query` at large scale — fine for a demo table of this size.
