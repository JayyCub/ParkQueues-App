import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserData } from './UserData'
import { Destination } from './Destination'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DataManager {
  static async fetchDestination (slug: string): Promise<Destination | null> {
    const url = `https://wait-times-data.s3.amazonaws.com/${slug}.json?timestamp=${Date.now()}`
    const localData = await AsyncStorage.getItem(slug)

    if (localData !== null && Date.now() - (1000 * 60 * 5) < JSON.parse(localData).lastUpdated) {
      // console.log(slug + ': Found local storage, and it is recent')
      return Destination.fromJson(localData) // Convert raw data to Destination object
    } else {
      // console.log(slug + ': Local data is missing or expired.')
      try {
        const response = await fetch(url)
        const data = await response.json()

        // Save the raw data directly to AsyncStorage
        // console.log('Retrieved: ' + slug)
        if (data != null) {
          // console.log('Locally Saving: ' + slug)
          await AsyncStorage.setItem(slug, JSON.stringify(data)) // Store raw data
          return Destination.fromJson(JSON.stringify(data)) // Return transformed data
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
        return null
      }

      const data = await response.json()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return UserData.fromJson(data.body) // Use UserData.fromJson as before
    } catch (error: any) {
      console.error('Error getting user data from S3. ' + JSON.stringify(error))
      return null
    }
  }
}
