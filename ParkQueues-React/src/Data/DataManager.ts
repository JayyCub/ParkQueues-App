import AsyncStorage from '@react-native-async-storage/async-storage'
import { Destination } from './Destination'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
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

  static async updateDestination (slug: string, existingDest: Destination | undefined): Promise<Destination | null> {
    const url = `https://wait-times-data.s3.amazonaws.com/${slug}.json?timestamp=${Date.now()}`
    const localData = await AsyncStorage.getItem(slug)

    if ((localData != null) && Date.now() - (1000 * 60 * 5) < JSON.parse(localData).lastUpdated) {
      // console.log(slug + ": Found local storage, and it is recent");
      return null
    } else {
      // console.log(slug + ": Local data is missing or expired.");
      try {
        const response = await fetch(url)
        const data = await response.json()
        const newDest = Destination.fromJson(JSON.stringify(data))
        // console.log("Retrieved: " + slug);

        if (newDest != null) {
          // console.log("Locally Saving: " + slug);
          await AsyncStorage.setItem(slug, newDest.toJson())
          if (existingDest == null) {
            return newDest
          } else {
            // console.log("UPDATING...");
            for (const [parkKey] of Object.entries(existingDest)) {
              existingDest.parks[parkKey].liveData = newDest.parks[parkKey].liveData
            }
            return existingDest
          }
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
}
