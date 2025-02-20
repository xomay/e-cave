import React from 'react';
import {ScrollView,View,Text,Image,TouchableOpacity,StyleSheet,Dimensions,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/*interface Wine {
id: string;
image: string;
domain: string;
region: string;
grape: string;
}*/

type Wine = {
    domaine: number,
    appellation: number,
    region: number,
    millesime: number,
    quantite: number,
    couleur: number,
    cepage: number,
}
/*
const wines: Wine[] = [
{
    id: 1,
    domaine: 'Domaine A',
    appellation: '',
    region: 'Région A',
    cepage: 'Cepage A',
    millesime: 2019,
    quantite: 6,
    couleur: 'Rouge',
},
{
    id: 2,
    domaine: 'Domaine B',
    region: 'Région B',
    cepage: 'Cepage B',
    millesime: 2020,
    quantite: 12,
    couleur: 'Blanc',
    appellation: '',
},
// Ajoutez d'autres vins au besoin
];*/

export default function WineSection(props: { data: Wine[] }) {
return (
    <View>
        <Text style={styles.sectionTitle}>Les Vins</Text>

        <View style={styles.container}>
            
            {props.data.map((wine, index) => (
                <TouchableOpacity
                    key={wine.millesime}
                    style={[
                        styles.card,
                        // Ajoute une marge droite pour la première carte d'une ligne
                        { marginRight: index % 2 === 0 ? 10 : 0 },
                    ]}
                    //onPress={() => console.log(`Clicked on ${wine.domain}`)}
                >
                    <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.image} />
                    <Text style={styles.title}>{wine.domaine}</Text>
                    <Text style={styles.text}>{wine.region}</Text>
                    <Text style={styles.text}>{wine.cepage}</Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);
};

const cardWidth = (Dimensions.get('window').width - 30) / 2;

const styles = StyleSheet.create({
container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
},
sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    //marginBottom: 12,
    padding: 10,
},
card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    // Ajout d'une ombre pour iOS et Android
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
},
image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
},
title: {
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
},
text: {
    textAlign: 'center',
    marginBottom: 3,
},
});
