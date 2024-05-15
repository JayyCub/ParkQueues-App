import React from "react";
import { Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from "../styles/styles";
import { useDataContext } from "../Data/DataContext";
import { Destination } from "../Data/Destination";

const HomePage = ({ navigation }: any) => {
  const { destinations, refreshData } = useDataContext();

  // Separate destinations into two lists: Disney and others
  const disneyDestinations: Destination[] = [];
  const otherDestinations: Destination[] = [];

  Array.from(destinations.values()).forEach((destination: Destination) => {
    if (destination.name.toLowerCase().includes("disney")) {
      disneyDestinations.push(destination);
    } else {
      otherDestinations.push(destination);
    }
  });

  return (
    <>
      <ScrollView>
        <View style={styles.main}>
          {/* Disney Parks */}
          <View style={styles.destinationSectionView}>
            <Text style={styles.attrAvailSectionText}>Disney Parks</Text>
          </View>
          {disneyDestinations.map((destination: Destination) => (
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

          {/* Other Destinations */}
          <View style={styles.destinationSectionView}>
            <Text style={styles.attrAvailSectionText}>Universal Parks</Text>
          </View>
          {otherDestinations.map((destination: Destination) => (
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
      </ScrollView>
    </>
  );
}

export default HomePage;
