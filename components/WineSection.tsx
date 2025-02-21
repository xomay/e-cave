import React, { useContext } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, Stack } from 'expo-router';

/*interface Wine {
id: string;
image: string;
domain: string;
region: string;
grape: string;
}*/

import { CepagesContext, CouleursContext, MetsContext, RegionsContext } from './Contexts';

type WineZ = {
    domaine: number,
    appellation: number,
    region: number,
    millesime: number,
    quantite: number,
    couleur: number,
    cepage: number,
}
type Wine = {
    id: number,
    domaine: string,
    appellation: string,
    region: string,
    millesime: number,
    quantite: number,
    couleur: string,
    cepage: string,
}

const wines: Wine[] = [
{
    id: 1,
    domaine: 'Domaine A',
    appellation: '',
    region: 'Bordeaux',
    cepage: 'Mixte',
    millesime: 2019,
    quantite: 6,
    couleur: 'Blanc',
},
{
    id: 2,
    domaine: 'Domaine B',
    region: 'Bourgogne',
    cepage: 'Mixte',
    millesime: 2020,
    quantite: 12,
    couleur: 'Rosé',
    appellation: '',
},
{
    id: 3,
    domaine: 'Domaine Blanchard',
    region: 'Bordeaux',
    cepage: 'Mixte',
    millesime: 2020,
    quantite: 12,
    couleur: 'Rouge',
    appellation: '',
},
{
    id: 4,
    domaine: 'Chateau Segur',
    region: 'Bordeaux',
    cepage: 'Pinot Noir',
    millesime: 2020,
    quantite: 12,
    couleur: 'Rouge',
    appellation: '',
},
// Ajoutez d'autres vins au besoin
];

export default function WineSection(props: { data: WineZ[] }) {
    const {selectedFilters: selectedRegions, setSelectedFilters: setSelectedRegions} = useContext(RegionsContext);
    const {selectedFilters: selectedCouleurs, setSelectedFilters: setSelectedCouleurs} = useContext(CouleursContext);
    const {selectedFilters: selectedCepages, setSelectedFilters: setSelectedCepages} = useContext(CepagesContext);
    const {selectedFilters: selectedMets, setSelectedFilters: setSelectedMets} = useContext(MetsContext);
    /*const selectedCouleurs = useContext(CouleursContext);
    const selectedCepages = useContext(CepagesContext);
    const selectedMets = useContext(MetsContext);*/
    const filteredWines = wines.filter(wine => {
        const regionMatch = selectedRegions.length === 0 || selectedRegions.includes(wine.region);
        const couleurMatch = selectedCouleurs.length === 0 || selectedCouleurs.includes(wine.couleur);
        const cepageMatch = selectedCepages.length === 0 || selectedCepages.includes(wine.cepage);
        return regionMatch && couleurMatch && cepageMatch;
    });

    return (
                        
        <View>
            <Text style={styles.sectionTitle}>Les Vins</Text>

            <View style={styles.container}>
                
                {filteredWines.map((wine, index) => (
                    <TouchableOpacity
                    key={index}
                    style={[
                        styles.card,
                        // Ajoute une marge droite pour la première carte d'une ligne
                        { marginRight: index % 2 === 0 ? 10 : 0 },
                        ]}
                        onPress={() => router.push(`../wineDetails?id=${wine.id}`)}
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
