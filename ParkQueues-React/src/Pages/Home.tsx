import React from "react";
import { Pressable, Text, View } from 'react-native';
import { styles } from "../styles/styles";
import { useDataContext } from "../Data/DataContext";
import { Destination } from "../Data/Destination";

const HomePage = ({ navigation }: any) => {
  const { destinations, refreshData } = useDataContext();

  return (
    <>
      <View style={styles.main}>
        {Array.from(destinations.values()).map((destination: Destination) => ( // Use map instead of forEach
          <Pressable
            key={destination.slug}
            style={styles.destinationCard}
            onPress={() =>
              navigation.navigate('Destination', { destination })
            }
          >
            <View>
              <Text style={styles.destinationTitle}>{destination.name}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </>
  );
}

export default HomePage;
