// jobViewsDB.js

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { fetchAuthSession } from '@aws-amplify/auth' // ✅ required to get credentials
import awsconfig from '../amplify-config.js'

const JOBS_TABLE = 'wsgiPostingsSlimFiltered' // or nsf_reusites if dynamic

/**
 * Get a DynamoDB document client using current Cognito credentials
 */
async function getDocClient() {
  const session = await fetchAuthSession()
  const credentials = session.credentials

  const client = new DynamoDBClient({
    region: awsconfig.aws_project_region,
    credentials
  })

  return DynamoDBDocumentClient.from(client)
}

/**
 * Increment the view count for a specific job
 * @param {string} jobId - ID of the job to increment views for
 */
export async function incrementJobViews(jobId) {
    const docClient = await getDocClient()
  
    const numericJobId = Number(jobId)
    if (isNaN(numericJobId)) {
      console.error("jobId is not a valid number:", jobId)
      return
    }
    console.log("Updating job_id:", numericJobId, "with type", typeof numericJobId)

    const command = new UpdateCommand({
      TableName: JOBS_TABLE,
      Key: {
        job_id: numericJobId
      },
      UpdateExpression: 'SET #v = if_not_exists(#v, :start) + :inc',
      ExpressionAttributeNames: {
        '#v': 'views'
      },
      ExpressionAttributeValues: {
        ':start': 0,     // remove the .0 to make it a normal integer
        ':inc': 1        // same here
      },      
      ReturnValues: 'UPDATED_NEW'
    })
  
    try {
      const response = await docClient.send(command)
      return { success: true, updatedViews: response.Attributes.views }
    } catch (error) {
      console.error('Error incrementing job views:', error)
      throw error
    }
  }
  
