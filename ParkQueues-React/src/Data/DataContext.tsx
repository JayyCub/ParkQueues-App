import React, { createContext, useContext, useEffect, useState } from 'react'
import { type Destination } from './Destination'
import { DataManager } from './DataManager'
import { type Park } from './Park'

interface DataContextProps {
  destinations: Map<string, Destination>
  parks: Map<string, Park>
  refreshData: () => Promise<void>
  updateData: () => Promise<void>
  lastUpdated: number
  showTrends: boolean
  toggleShowTrends: () => void
  sortAlpha: boolean
  toggleSortAlpha: () => void
}

const DataContext = createContext<DataContextProps>({
  destinations: new Map<string, Destination>(),
  parks: new Map<string, Park>(),
  refreshData: async () => {},
  updateData: async () => {},
  lastUpdated: 0,
  showTrends: false,
  toggleShowTrends: () => {},
  sortAlpha: false,
  toggleSortAlpha: () => {}
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

  const toggleShowTrends = (): void => {
    setShowTrends(prevState => !prevState)
  }

  const [sortAlpha, setSortAlpha] = useState<boolean>(true)

  const toggleSortAlpha = (): void => {
    setSortAlpha(prevState => !prevState)
  }

  useEffect(() => {
    void refreshData().then()
  }, [])

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

  const updateData = async (): Promise<void> => {
    const fetchedDestinations = await Promise.all(slugs.map(async slug => await DataManager.updateDestination(slug, destinations.get(slug))))

    const filteredDestinations = fetchedDestinations.filter(dest => dest !== null) as Destination[]
    const { destinationMap, parkMap } = processDestinations(filteredDestinations)

    setDestinations(destinationMap)
    setParks(parkMap)
    setLastUpdated(Date.now())
  }

  return (
    <DataContext.Provider value={{ destinations, parks, refreshData, updateData, lastUpdated, showTrends, toggleShowTrends, sortAlpha, toggleSortAlpha }}>
      {children}
    </DataContext.Provider>
  )
}
