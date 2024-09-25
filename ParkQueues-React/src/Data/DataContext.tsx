import React, { createContext, useContext, useEffect, useState } from 'react'
import { type Destination } from './Destination'
import { DataManager } from './DataManager'
import { type Park } from './Park'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { type UserData } from './UserData'

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
}

const DataContext = createContext<DataContextProps>({
  setUser (): void {},
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
  updateUserData: async () => {}
})

export const useDataContext = (): DataContextProps => {
  return useContext(DataContext)
}

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
  const [user, setUser] = useState<FirebaseUser | null>(auth != null ? auth.currentUser : null) // Initialize with current user
  const [userData, setUserData] = useState<UserData | null>(null)

  const toggleShowTrends = (): void => {
    setShowTrends(prevState => !prevState)
  }

  const toggleSortAlpha = (): void => {
    setSortAlpha(prevState => !prevState)
  }

  useEffect(() => {
    void refreshData().then()
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser) // Update user state when auth state changes
    })
    return () => { unsubscribe() } // Cleanup subscription on unmount
  }, [])

  useEffect(() => {
    void updateUserData().then()
  }, [user])

  const processDestinations = (destinations: Destination[]): { destinationMap: Map<string, Destination>, parkMap: Map<string, Park> } => {
    const destinationMap = new Map<string, Destination>()
    const parkMap = new Map<string, Park>()

    destinations.forEach(dest => {
      destinationMap.set(dest.slug, dest)
      Object.values(dest.parks).forEach(park => {
        parkMap.set(park.id, park)
      })
    })

    return { destinationMap, parkMap }
  }

  const refreshData = async (): Promise<void> => {
    const fetchedDestinations = await Promise.all(slugs.map(async slug => await DataManager.fetchDestination(slug)))

    const filteredDestinations = fetchedDestinations.filter(dest => dest !== null) as Destination[]
    const { destinationMap, parkMap } = processDestinations(filteredDestinations)

    setDestinations(destinationMap)
    setParks(parkMap)
    setLastUpdated(Date.now())
  }

  const updateUserData = async (): Promise<void> => {
    if (user?.uid) {
      const data = await DataManager.getUser(user?.uid)
      if (data) {
        setUserData(data)
      }
    }
  }

  return (
    <DataContext.Provider value={{
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
      updateUserData
    }}>
      {children}
    </DataContext.Provider>
  )
}
