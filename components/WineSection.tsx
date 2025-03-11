import { router } from 'expo-router';
import React, { useContext } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { fonts } from '@/constants/fonts';
import {colors} from '@/constants/colors';

/*interface Wine {
id: string;
image: string;
domain: string;
region: string;
grape: string;
}*/

import { CepagesContext, MillesimeContext, MetsContext, RegionsContext, SearchContext } from './Contexts';

type Wine = {
    id: number,
    appellation: string,
    region: string,
    couleur: string,
    cepage: string,
    domaine: string,
    mets: string[],
}

type WineTemp = {
    id: number,
    appellation: string,
    region: string,
    couleur: string,
    cepage: string,
    domaine: string,
}

type WineZ = {
    id: number,
    domaine: string,
    appellation: string,
    region: string,
    millesime: number,
    quantite: number,
    couleur: string,
    cepage: string,
}

const wines: WineZ[] = [
{
    id: 1,
    domaine: 'Domaine A',
    appellation: '',
    region: 'Bordeaux',
    cepage: 'Assemblage',
    millesime: 2019,
    quantite: 6,
    couleur: 'Blanc',
},
{
    id: 2,
    domaine: 'Domaine B',
    region: 'Bourgogne',
    cepage: 'Assemblage',
    millesime: 2020,
    quantite: 12,
    couleur: 'Rosé',
    appellation: '',
},
{
    id: 3,
    domaine: 'Domaine Blanchard',
    region: 'Bordeaux',
    cepage: 'Assemblage',
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

//props: { data: Wine[] }
export default function WineSection(props: { data: Wine[] }) {
    const {selectedFilters: selectedRegions, setSelectedFilters: setSelectedRegions} = useContext(RegionsContext);
    const {selectedFilters: selectedMillesime, setSelectedFilters: setSelectedMillesime} = useContext(MillesimeContext);
    const {selectedFilters: selectedCepages, setSelectedFilters: setSelectedCepages} = useContext(CepagesContext);
    const {selectedFilters: selectedMets, setSelectedFilters: setSelectedMets} = useContext(MetsContext);
    const {selectedFilters: selectedSearch, setSelectedFilters: setSelectedSearch} = useContext(SearchContext);

    const filteredWines = props.data.filter(wine => {
        const regionMatch = selectedRegions.length === 0 || selectedRegions.includes(wine.region);
        const couleurMatch = selectedMillesime.length === 0 || selectedMillesime.includes(wine.couleur);
        const cepageMatch = selectedCepages.length === 0 || selectedCepages.includes(wine.cepage);
        const metsMatch = selectedMets.length === 0 || selectedMets.some(met => wine.mets.includes(met));
        const searchMatch = selectedSearch.length === 0 || selectedSearch.some(search => wine.appellation.toLowerCase().includes(search.toLowerCase()) || wine.domaine.toLowerCase().includes(search.toLowerCase()) || wine.region.toLowerCase().includes(search.toLowerCase()) || wine.couleur.toLowerCase().includes(search.toLowerCase()) || wine.cepage.toLowerCase().includes(search.toLowerCase()));
        return regionMatch && couleurMatch && cepageMatch && metsMatch && searchMatch;
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
                        <Image source={wine.couleur == 'Rouge' ? require('../assets/images/bouteille-rouge.png') : wine.couleur == 'Rose' ? require('../assets/images/bouteille-rose.png') : require('../assets/images/bouteille-blanc.png')} 
                        style={styles.image} 
                        resizeMode='contain'/>
                        <View style={styles.textContainer}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{height: 50, zIndex: 0}}>
                                <Text style={styles.title} numberOfLines={1}>{wine.appellation}</Text>
                            </ScrollView>
                                <Text style={styles.text} numberOfLines={1}>{wine.domaine}</Text>
                        </View>
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
    fontFamily: fonts.neuebold,
},
card: {
    width: cardWidth,
    height: 180,
    backgroundColor: '#fcfcfc',
    borderRadius: 18,
    //padding: 10,
    marginBottom: 15,
    marginTop: 30,
    // Ajout d'une ombre pour iOS et Android
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 0,
},
image: {
    maxWidth: '80%', // Adjust the width as needed
    height: 140, // Adjust the height as needed
    //borderRadius: 10,
    marginBottom: 10,
    position: 'absolute',
    top: -20, // Adjust the value to control how much the image overlaps
},
textContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    width: '100%',
    height: '35%',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
},
title: {
    //fontWeight: 'bold',
    fontFamily: fonts.sfbold,
    color: colors.primary_blue,
    marginBottom: 5,
    //textAlign: 'left',
    fontSize: 18,
    height: 30,
    //marginTop: 10,
},
text: {
    textAlign: 'left',
    marginBottom: 4,
    fontSize: 16,
    color: colors.primary_blue,
},
});
