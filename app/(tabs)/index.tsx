import { Text, View, Image, ScrollView } from "react-native";

//const PlaceHolderImage = require('@/assets/images/wine-bottle.png');


export default function Index() {
  return (
    <View style={{
        flex: 1,
    }}>
        <View style={{
            height: 150,
            flex: 0,
            justifyContent: "flex-end",
        }}>
            <Text>Bonjour Laurent</Text>
            <Text>Bienvenue dans votre cave</Text>
        </View>
        
        <View
        style={{
            flex: 2,
            justifyContent: "center",
            alignItems: "center",
        }}
        
        >
        <Text>Welcome to the Home page</Text>
        </View>

    </View>

  );
}
