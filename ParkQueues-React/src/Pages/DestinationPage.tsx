import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/styles";
import React, { useState } from "react";
import { Destination } from "../Data/Destination";
import { Park } from "../Data/Park";

const DestinationPage = ({ route, navigation }: any) => {
  const [destination] = useState<Destination>(route.params?.destination);

  return (
    <>
      <View style={styles.subheaderView}>
        <Text
          style={styles.subheaderText}
        >@ {destination.name}</Text>
      </View>
      <View style={styles.main}>
        {Object.values(destination.parks).map((park: Park, index: number) => (
          <Pressable
            key={park.id}
            style={styles.parkCard}
            onPress={() =>
              navigation.navigate('Park', { park: park })
            }
          >
            <View>
              <Text style={styles.destinationTitle}>
                {park.name
                  .replaceAll("Disney's", '')
                  .replaceAll("Theme Park", '')
                  .replaceAll("Water Park", '')}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </>
  );
}

export default DestinationPage;
