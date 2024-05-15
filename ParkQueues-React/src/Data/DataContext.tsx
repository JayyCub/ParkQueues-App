import React, { createContext, useContext, useEffect, useState } from "react";
import { Destination } from "./Destination";
import { DataManager } from "./DataManager";
import {Park} from "./Park";


interface DataContextProps {
  destinations: Map<string, Destination>;
  parks: Map<string, Park>; // Add parks
  refreshData: () => Promise<void>;
  updateData: () => Promise<void>;
}

const DataContext = createContext<DataContextProps>({
  destinations: new Map<string, Destination>(),
  parks: new Map<string, Park>(), // Initialize as an empty Map
  refreshData: async () => {},
  updateData: async () => {},
});

export const useDataContext = () => useContext(DataContext);

const slugs = [
  'waltdisneyworldresort',
  'disneylandresort',
  'universalstudios',
  'universalorlando',
];

export const DataProvider = ({ children }: any) => {
  const [destinations, setDestinations] = useState<Map<string, Destination>>(new Map<string, Destination>()); // Change destinations to Map
  const [parks, setParks] = useState<Map<string, Park>>(new Map<string, Park>()); // Initialize as an empty Map

  useEffect(() => {
    refreshData().then();
  }, []);

  const refreshData = async () => {
    const fetchedDestinations = await Promise.all(slugs.map(slug => DataManager.fetchDestination(slug)));

    const filteredDestinations = fetchedDestinations.filter(dest => dest !== null) as Destination[];

    const destinationMap = new Map<string, Destination>();
    const parkMap = new Map<string, Park>(); // Create a map for parks

    // Convert the filtered destinations array to a map
    filteredDestinations.forEach(dest => {
      destinationMap.set(dest.slug, dest);
      // Add parks to the park map
      Object.values(dest.parks).forEach(park => {
        parkMap.set(park.id, park);
      });
    });

    setDestinations(destinationMap);
    setParks(parkMap);
  };

  const updateData = async () => {
    const fetchedDestinations = await Promise.all(slugs.map(slug => DataManager.updateDestination(slug, destinations.get(slug))));
    const filteredDestinations = fetchedDestinations.filter(dest => dest !== null) as Destination[];
    const destinationMap = new Map<string, Destination>();
    const parkMap = new Map<string, Park>(); // Create a map for parks

    // Convert the filtered destinations array to a map
    filteredDestinations.forEach(dest => {
      destinationMap.set(dest.slug, dest);
      // Add parks to the park map
      Object.values(dest.parks).forEach(park => {
        parkMap.set(park.id, park);
      });
    });

    setDestinations(destinationMap);
    setParks(parkMap);
  };

  return (
    <DataContext.Provider value={{ destinations, parks, refreshData, updateData }}>
      {children}
    </DataContext.Provider>
  );
};
