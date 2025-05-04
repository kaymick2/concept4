// savedJobsDB.js

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { fetchAuthSession } from '@aws-amplify/auth' // ✅ correct modular import
import awsconfig from '../amplify-config.js'

const SAVED_JOBS_TABLE = 'savedjobsUSER'

/**
 * Get a DynamoDB document client using current Amplify-authenticated credentials
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
 * Save a job for a user
 * @param {string} userId - Cognito user ID
 * @param {object} jobData - The job object
 */
export async function saveJob(userId, jobData) {
  const docClient = await getDocClient()

  // Handle both job_id (from API) and id (from component) formats
  const jobId = String(jobData.job_id || jobData.id)

  const command = new PutCommand({
    TableName: SAVED_JOBS_TABLE,
    Item: {
      userID: userId,
      jobID: jobId,
      savedAt: new Date().toISOString(),
      jobData: jobData
    }
  })

  try {
    await docClient.send(command)
    return { success: true }
  } catch (error) {
    console.error('Error saving job:', error)
    throw error
  }
}

/**
 * Get all saved jobs for a user
 * @param {string} userId - Cognito user ID
 */
export async function getSavedJobs(userId) {
  const docClient = await getDocClient()

  const command = new QueryCommand({
    TableName: SAVED_JOBS_TABLE,
    KeyConditionExpression: 'userID = :userID',
    ExpressionAttributeValues: {
      ':userID': userId
    }
  })

  try {
    const response = await docClient.send(command)
    return response.Items || []
  } catch (error) {
    console.error('Error getting saved jobs:', error)
    throw error
  }
}

/**
 * Remove a saved job for a user
 * @param {string} userId - Cognito user ID
 * @param {string} jobId - ID of the job to remove
 */
export async function removeSavedJob(userId, jobId) {
  const docClient = await getDocClient()

  const command = new DeleteCommand({
    TableName: SAVED_JOBS_TABLE,
    Key: {
      userID: userId,
      jobID: String(jobId)
    }
  })

  try {
    await docClient.send(command)
    return { success: true }
  } catch (error) {
    console.error('Error removing saved job:', error)
    throw error
  }
}

/**
 * Check if a job is saved for a user
 * @param {string} userId - Cognito user ID
 * @param {string} jobId - ID of the job to check
 * @returns {Promise<boolean>} - True if the job is saved, false otherwise
 */
export async function isJobSaved(userId, jobId) {
  const docClient = await getDocClient()

  const command = new GetCommand({
    TableName: SAVED_JOBS_TABLE,
    Key: {
      userID: userId,
      jobID: String(jobId)
    }
  })

  try {
    const response = await docClient.send(command)
    return !!response.Item // Return true if the item exists, false otherwise
  } catch (error) {
    console.error('Error checking if job is saved:', error)
    return false // Return false on error
  }
}
