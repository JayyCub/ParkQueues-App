import AsyncStorage from '@react-native-async-storage/async-storage'
import { Destination } from './Destination'
import { UserData } from './UserData'

export class DataManager {
  static async fetchDestination (slug: string): Promise<Destination | null> {
    const url = `https://wait-times-data.s3.amazonaws.com/${slug}.json?timestamp=${Date.now()}`
    const localData = await AsyncStorage.getItem(slug)

    if ((localData != null) && Date.now() - (1000 * 60 * 5) < JSON.parse(localData).lastUpdated) {
      console.log(slug + ': Found local storage, and it is recent')
      return Destination.fromJson(localData)
    } else {
      console.log(slug + ': Local data is missing or expired.')
      try {
        const response = await fetch(url)
        const data = await response.json()
        const destination = Destination.fromJson(JSON.stringify(data))
        // console.log("Retrieved: " + slug);
        if (destination != null) {
          // console.log("Locally Saving: " + slug);
          await AsyncStorage.setItem(slug, destination.toJson())
          return destination
        } else {
          console.error('Error parsing destination data')
          return null
        }
      } catch (error) {
        console.error('Error fetching data: ', error)
        return null
      }
    }
  }

  static async getUser (uid: string): Promise<UserData | null> {
    // console.log("Getting account info...")
    const url = 'https://7o2vcnfjgc.execute-api.us-east-1.amazonaws.com/ParkQueues-live/user-data'
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          uid
        }
      })

      if (response.status !== 200) {
        console.log('Error fetching account data')
      }

      const data = await response.json()
      // console.log('Got S3 response.')
      // console.log(userData)
      return UserData.fromJson(data.body)
    } catch (error: any) {
      console.error('Error getting user data from S3. ' + JSON.stringify(error))
      return null
    }
  }
}
