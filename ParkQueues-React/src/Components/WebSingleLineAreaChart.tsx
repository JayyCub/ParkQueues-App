import React, { useState } from "react";
import { VictoryChart, VictoryArea, VictoryTooltip, VictoryVoronoiContainer, VictoryLine } from "victory"; // Import VictoryLine
import { View, Text } from "react-native";
import { styles } from "../styles";
import {Circle} from "@shopify/react-native-skia";

export default function WebSingleLineAreaChart({ data, timezone }: { data: { high: number | undefined; date: number }[], timezone: string }) {
  const maxVal = Math.max(...data.map(o => o.high !== undefined ? o.high : 0));
  const [hoverVal, setHoverVal] = useState({ x: -1, y: -1 });

  return (
    <View style={{ alignItems: "center", justifyContent: "center", /*height: 400*/ }}>
      <View style={{ alignItems: "center" }}>
        <Text style={{
          fontSize: 16,
          color: "#000000",
          fontStyle: "italic",
        }}>
          {new Date(hoverVal.x).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: timezone })}</Text>
        <Text style={styles.liveData2}>{hoverVal.y}</Text>
      </View>
      <View style={{ height: 400 }}>
        <VictoryChart
          domain={{ y: [0, Math.ceil((maxVal + 10) / 5) * 5] }}
          padding={{ top: 40, bottom: 40, left: 40, right: 10 }} // Adjust padding to make room for labels
          containerComponent={
            <VictoryVoronoiContainer
              onActivated={(points) => {
                if (points.length > 0) {
                  const point = points[0];
                  setHoverVal({ x: point.x, y: point.y });
                }
              }}
            />
          }
        >
          <VictoryArea
            data={data.map(d => ({ x: new Date(d.date), y: d.high || 1 }))}
            style={{ data: { fill: "#97c9e5", stroke: "#0a90da", strokeWidth: 2 } }} // Add stroke properties
            interpolation="linear"
            standalone={false}
          />
          <VictoryLine
            data={[{ x: hoverVal.x, y: 0 }, { x: hoverVal.x, y: maxVal + 10 }]} // Vertical line from 0 to maxVal at the hover x value
            style={{ data: { stroke: "red", strokeWidth: 2 } }} // Style the line
          />
        </VictoryChart>
      </View>
    </View>
  );
}
