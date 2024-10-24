import React, { createContext, useContext, useEffect, useState } from 'react'
import * as Location from 'expo-location'
import { LocationAccuracy, type PermissionResponse } from 'expo-location'
import { type Destination } from './Destination'
import { DataManager } from './DataManager'
import { type Park } from './Park'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { type UserData } from './UserData'
import type { Attraction } from './Attraction'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface AttractionWithDistance {
  attraction: Attraction
  park: Park
  destination: Destination
  distance: number
}

interface DataContextProps {
  destinations: Map<string, Destination>
  parks: Map<string, Park>
  refreshData: () => Promise<void>
  lastUpdated: number
  showTrends: boolean
  toggleShowTrends: () => void
  sortAlpha: boolean
  toggleSortAlpha: () => void
  user: FirebaseUser | null
  setUser: (user: FirebaseUser | null) => void
  userData: UserData | null
  updateUserData: () => Promise<void>
  location: Location.LocationObject | null
  errorMsg: string | null
  getLocationData: () => Promise<void>
  locationProcessingComplete: boolean
  locationPermission: PermissionResponse | null
  closestAttractions: AttractionWithDistance[]
}

const DataContext = createContext<DataContextProps>({
  setUser: () => {},
  user: null,
  destinations: new Map<string, Destination>(),
  parks: new Map<string, Park>(),
  refreshData: async () => {},
  lastUpdated: 0,
  showTrends: false,
  toggleShowTrends: () => {},
  sortAlpha: false,
  toggleSortAlpha: () => {},
  userData: null,
  updateUserData: async () => {},
  location: null,
  errorMsg: null,
  getLocationData: async () => {},
  locationProcessingComplete: false,
  locationPermission: null,
  closestAttractions: []
})

export const useDataContext = (): DataContextProps => useContext(DataContext)

const slugs = [
  'waltdisneyworldresort',
  'disneylandresort',
  'universalstudios',
  'universalorlando',
  'disneylandparis',
  'tokyodisneyresort',
  'shanghaidisneyresort',
  'hongkongdisneylandpark'
]

export const DataProvider = ({ children }: any): React.JSX.Element => {
  const [destinations, setDestinations] = useState<Map<string, Destination>>(new Map<string, Destination>())
  const [parks, setParks] = useState<Map<string, Park>>(new Map<string, Park>())
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now())
  const [showTrends, setShowTrends] = useState<boolean>(false)
  const [sortAlpha, setSortAlpha] = useState<boolean>(true)
  const [user, setUser] = useState<FirebaseUser | null>(auth?.currentUser || null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [locationProcessingComplete, setLocationProcessingComplete] = useState<boolean>(false)
  const [locationPermission, setLocationPermission] = useState<PermissionResponse | null>(null)
  const [closestAttractions, setClosestAttractions] = useState<AttractionWithDistance[]>([])

  // Check permissions when the component mounts
  useEffect(() => {
    const checkPermissions = async (): Promise<void> => {
      const permission = await Location.getForegroundPermissionsAsync()
      setLocationPermission(permission)
    }

    checkPermissions().catch((err) => {
      console.error('Error checking location permissions:', err)
    })
  }, [])

  useEffect(() => {
    const fetchDataAndLocation = async (): Promise<void> => {
      await refreshData()
    }

    fetchDataAndLocation().catch((err) => {
      console.error(err)
    })
  }, [])

  // Monitor destinations, then fetch location data
  useEffect(() => {
    if (destinations.size > 0) {
      getLocationData().catch((err) => {
        console.error('Error in getLocationData:', err)
      })
    }
  }, [destinations])

  // Auth state change handling
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    updateUserData().catch((err) => {
      console.error('Error updating user data:', err)
    })
  }, [user])

  // Monitor destinations and calculate closest attractions when both destinations and location are available
  useEffect(() => {
    if (destinations.size > 0 && locationProcessingComplete) {
      calculateClosestAttractions()
    }
  }, [destinations, locationProcessingComplete])

  const toggleShowTrends = (): void => {
    setShowTrends((prevState) => !prevState)
  }

  const toggleSortAlpha = (): void => {
    setSortAlpha((prevState) => !prevState)
  }

  const updateUserData = async (): Promise<void> => {
    if (user?.uid != null) {
      const data = await DataManager.getUser(user.uid)
      if (data != null) {
        setUserData(data)
      }
    }
  }

  const refreshData = async (): Promise<void> => {
    const fetchedDestinations = await Promise.all(slugs.map(async (slug) => await DataManager.fetchDestination(slug)))
    const filteredDestinations = fetchedDestinations.filter((dest) => dest !== null) as Destination[]
    const { destinationMap, parkMap } = processDestinations(filteredDestinations)

    setDestinations(destinationMap)
    setParks(parkMap)
    setLastUpdated(Date.now())
  }

  const processDestinations = (destinations: Destination[]): { destinationMap: Map<string, Destination>, parkMap: Map<string, Park> } => {
    const destinationMap = new Map<string, Destination>()
    const parkMap = new Map<string, Park>()

    destinations.forEach((dest) => {
      destinationMap.set(dest.slug, dest)
      Object.values(dest.parks).forEach((park) => {
        parkMap.set(park.id, park)
      })
    })

    return { destinationMap, parkMap }
  }

  const calcDistance = (lat: number | undefined, lon: number | undefined): number => {
    if ((lat == null) || (lon == null) || ((location?.coords.latitude) == null) || ((location?.coords.longitude) === 0)) {
      return Infinity // Return a very large number if any coordinate is missing
    }

    const toRadians = (degrees: number): number => degrees * (Math.PI / 180)

    const earthRadiusKm = 6371 // Radius of the Earth in kilometers
    const dLat = toRadians(lat - location.coords.latitude)
    const dLon = toRadians(lon - location.coords.longitude)

    const lat1 = toRadians(location.coords.latitude)
    const lat2 = toRadians(lat)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return earthRadiusKm * c // Distance in kilometers
  }

  const calculateClosestAttractions = (): void => {
    const updatedClosestAttractions: AttractionWithDistance[] = []

    destinations.forEach(dest => {
      Object.values(dest.parks).forEach((park: Park) => {
        Object.values(park.liveData).forEach((attraction: Attraction) => {
          const attrLat = attraction.lat
          const attrLon = attraction.lon

          if ((attrLat != null) && (attrLon != null)) {
            const attrDistance = calcDistance(attrLat, attrLon)
            updatedClosestAttractions.push({ destination: dest, attraction, park, distance: attrDistance })
          }
        })
      })
    })

    setClosestAttractions(updatedClosestAttractions.sort((a, b) => a.distance - b.distance))
    // setClosestAttractions(updatedClosestAttractions.slice(0, 5)) // Only keep the top 5 closest attractions
  }

  const getLocationData = async (): Promise<void> => {
    // console.log('Beginning getLocationData...')
    setLocationProcessingComplete(false)
    const startTime = Date.now()
    try {
      // Check if permission is already granted, if not, request it
      // console.log(locationPermission)
      // console.log(`1: ${Date.now() - startTime} ms`)
      if ((locationPermission == null) || locationPermission.status !== 'granted') {
        const permission = await Location.requestForegroundPermissionsAsync()
        // console.log(`2: ${Date.now() - startTime} ms`)
        setLocationPermission(permission)

        if (permission.status !== 'granted') {
          setErrorMsg('Permission to access location was denied')
          return
        }
      }
      // console.log(`3: ${Date.now() - startTime} ms`)
      const currentLocation = await Location.getCurrentPositionAsync({ accuracy: LocationAccuracy.High })
      // console.log(`4: ${Date.now() - startTime} ms`)
      setLocation(currentLocation)

      const url = 'https://wait-times-data.s3.amazonaws.com/Locations.json'
      const resp = await fetch(url)
      // console.log(`5: ${Date.now() - startTime} ms`)
      const locationData = await resp.json()

      const updatedClosestAttractions: AttractionWithDistance[] = []
      // console.log(`6: ${Date.now() - startTime} ms`)

      destinations.forEach(dest => {
        // Check destination is in locationData
        if (locationData[dest.id] == null) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          dest.addLocationData(locationData[dest.id].lat, locationData[dest.id].lon)
        }

        Object.values(dest.parks).forEach(park => {
          // Check park is in locationData
          if (locationData[dest.id][park.id] != null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            park.addLocationData(locationData[dest.id][park.id].lat, locationData[dest.id][park.id].lon)
          }

          Object.values(park.liveData).forEach(attr => {
            // Check park is in locationData
            if (locationData[dest.id][attr.id] != null) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              attr.addLocationData(locationData[dest.id][attr.id].lat, locationData[dest.id][attr.id].lon)
            }
          })
        })
      })
      // console.log(`7: ${Date.now() - startTime} ms`)

      setClosestAttractions(updatedClosestAttractions.sort((a, b) => a.distance - b.distance))
      // console.log(`8: ${Date.now() - startTime} ms`)

      calculateClosestAttractions() // Call here after location data has been processed
    } catch (e) {
      console.error('Error fetching location data:', e)
    }
    setLocationProcessingComplete(true)
    // console.log(`FINAL time: ${Date.now() - startTime} ms`)
  }

  return (
    <DataContext.Provider
      value={{
        destinations,
        parks,
        refreshData,
        lastUpdated,
        showTrends,
        toggleShowTrends,
        sortAlpha,
        toggleSortAlpha,
        user,
        setUser,
        userData,
        updateUserData,
        location,
        errorMsg,
        getLocationData,
        locationProcessingComplete,
        locationPermission,
        closestAttractions
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
