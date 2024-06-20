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
    const data = JSON.parse(await response.Body.transformToString())

    const now = Date.now()
    if (data.maxFavs.expires < now) {
      data.maxFavs.expires = null
      data.maxFavs.num = 5
      data.favs.splice(data.maxFavs)
    }

    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: event.uid + '.json',
      Body: JSON.stringify(data),
      ContentType: 'application/json'
    })
    const putResponse = await client.send(putCommand)
    console.log(putResponse)

    return {
      statusCode: 200,
      body: data
    }
  } catch (e) {
    console.log('ERROR: Could not get user: ' + event.uid)
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
          expires: null
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
  const data = JSON.parse(JSON.stringify(event))

  if (data.uid == null) {
    throw new Error('[Bad Request] Given uid is null')
  }

  try {
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: data.uid + '.json',
      Body: JSON.stringify(data)
    })
    await client.send(putCommand)

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (e) {
    console.log('ERROR: Could not get user: ' + data.uid)
    throw new Error('[Server Error] Could not get user')
  }
}
