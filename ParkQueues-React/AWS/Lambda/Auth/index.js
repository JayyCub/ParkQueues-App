import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

const bucketName = 'parkqueues-accounts'
const client = new S3Client()

export async function getUser (event) {
  if (event.uid == null) {
    throw new Error('[Bad Request] Given uid is null')
  }

  const input = {
    Bucket: bucketName,
    Key: event.uid + '.json'
  }

  try {
    const command = new GetObjectCommand(input)
    const response = await client.send(command)
    const str = await response.Body.transformToString()

    const now = Date.now()
    const parsedData = JSON.parse(str)

    parsedData.maxFavs.expirationStack = parsedData.maxFavs.expirationStack.filter(item => item.expiration >= now)
    parsedData.maxFavs.num = 5 + (3 * parsedData.maxFavs.expirationStack.length)
    parsedData.favs.length = parsedData.maxFavs.num

    const updatedStr = JSON.stringify(parsedData)

    if (str !== updatedStr) {
      try {
        const putCommand = new PutObjectCommand({
          Bucket: bucketName,
          Key: event.uid + '.json',
          Body: updatedStr,
          ContentType: 'application/json'
        })
        await client.send(putCommand)
      } catch (e) {
        console.log('ERROR: Could not update user: ' + event.uid)
        throw new Error('[Server Error] Could not update user')
      }
    }

    return {
      statusCode: 200,
      body: updatedStr
    }
  } catch (e) {
    console.log('ERROR: Could not get user: ' + event.uid)
    console.error(e)
    throw new Error('[Server Error] Could not get user')
  }
}

export async function addUser (event) {
  if (event.uid == null) {
    throw new Error('[Bad Request] Given uid is null')
  }

  try {
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: event.uid + '.json',
      Body: JSON.stringify({
        uid: event.uid,
        maxFavs: {
          num: 5,
          expirationStack: []
        },
        favs: [],
        maxNotifs: {
          num: 3,
          expires: null
        },
        notifs: []
      }),
      ContentType: 'application/json'
    })
    const putResponse = await client.send(putCommand)
    console.log(putResponse)

    return {
      statusCode: 200,
      body: 'Bucket response: ' + JSON.stringify(putResponse)
    }
  } catch (e) {
    console.log('ERROR: Could not get user: ' + event.uid)
    throw new Error('[Server Error] Could not get user. ' + JSON.stringify(e))
  }
}

export async function updateUser (event) {
  const data = event.body

  if (data.uid == null) {
    throw new Error('[Bad Request] Given uid is null')
  }

  try {
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: data.uid + '.json',
      Body: JSON.stringify(data),
      ContentType: 'application/json'
    })
    await client.send(putCommand)

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (e) {
    console.log('ERROR: Could not update user: ' + data.uid)
    throw new Error('[Server Error] Could not update user')
  }
}
