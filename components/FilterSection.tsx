import { act, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';


const filterButtons = ['Mets', 'Région', 'Cépage', 'Couleur'];

const cardData = [
    { id: '1', title: 'Viande', filter: 'Mets' },
    { id: '2', title: 'Poisson', filter: 'Mets' },
    { id: '3', title: 'Bordeaux', filter: 'Région' },
    { id: '4', title: 'Pinot Noir', filter: 'Cépage' },
];

type Region = {
    nom: string,
}
type Mets = {
    nom: string,
}
type Cepage = {
    nom: string,
}
type Couleur = {
    nom: string,
}

export default function FilterSection(props: {regions: Region[], mets: Mets[], cepages: Cepage[], couleurs: Couleur[]}) {
    const [activeBtn, setActiveBtn] = useState<string>('Mets')

    const regions = props.regions;
    const mets = props.mets;
    const cepages = props.cepages;
    const couleurs = props.couleurs;
    const filters= {
        regions: regions, 
        mets: mets, 
        cepages: cepages, 
        couleurs: couleurs};
    /*console.log("filters = ",filters);
    console.log("regions = ",regions);*/
    const filtersss = [
        { value: regions, filter: 'Région' },
        { value: mets, filter: 'Mets' },
        { value: cepages, filter: 'Cépage' },
        { value: couleurs, filter: 'Couleur' },
    ];

    const handleFilterPress = (button:string) => {
        console.log("activeBtn = ",activeBtn);
        setActiveBtn(button);
    }

    console.log("filtersss = ",filtersss.filter((filtre) => filtre.filter === activeBtn).map((el) => el.value.map((el) => el.nom)));  
    
    // État pour les filtres sélectionnés
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedCouleurs, setSelectedCouleurs] = useState<string[]>([]);
    const [selectedCepages, setSelectedCepages] = useState<string[]>([]);
    const [selectedMets, setSelectedMets] = useState<string[]>([]);

    // Fonction pour gérer la sélection des filtres
    const toggleFilter = (filterType: string, value: string) => {
        switch (filterType) {
            case 'Région':
                setSelectedRegions(prev =>
                    prev.includes(value) ? prev.filter(r => r !== value) : [...prev, value]
                );
                break;
            case 'Couleur':
                setSelectedCouleurs(prev =>
                    prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
                );
                break;
            case 'Cépage':
                setSelectedCepages(prev =>
                    prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
                );
                break;
            case 'Mets':
                setSelectedMets(prev =>
                    prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
                );
                break;
            default:
                break;
        }
    };


    return (
        <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>Filtres</Text>

            {/* Filter Buttons */}
            <View style={styles.buttonRow}>
                {filterButtons.map((button, index) => (
                    <TouchableOpacity key={index} style={[styles.filterButton, { backgroundColor: activeBtn === button ? '#6cbfd4' : '#ebebeb'}]}
                    onPress={() => handleFilterPress(button)}>
                        <Text style={styles.buttonText}>{button}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Horizontal Scroll Cards */}
            {/*<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
                {cardData
                //.filter((filtre) => filtre === activeBtn)
                .map((card, index) => (
                    <TouchableOpacity key={index} style={styles.card}>
                        <Text style={styles.cardText}>{card.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>*/}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
                {filtersss.
                filter((filtre) => filtre.filter === activeBtn)
                .map((el) => 
                    el.value.map((el, index) =>
                        <TouchableOpacity key={index} 
                        style={[styles.card, { backgroundColor: (selectedRegions.includes(el.nom) 
                            || selectedCepages.includes(el.nom) 
                            || selectedCouleurs.includes(el.nom)
                            || selectedMets.includes(el.nom)
                        )? '#6cbfd4' : '#ebebeb'}]}
                        onPress={() => toggleFilter(activeBtn, el.nom)}
                        >
                            <Text style={styles.cardText}>{el.nom}</Text>
                        </TouchableOpacity>
                        ))}
            </ScrollView>
            <View>
                {selectedRegions.map((region, index) => (
                    <Text key={index}>{region}</Text>
                ))}
                {selectedCepages.map((region, index) => (
                    <Text key={index}>{region}</Text>
                ))}
                {selectedCouleurs.map((region, index) => (
                    <Text key={index}>{region}</Text>
                ))}
                {selectedMets.map((region, index) => (
                    <Text key={index}>{region}</Text>
                ))}
            </View>
            {/*renderFilterContent()*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    filterButton: {
        //backgroundColor: '#6cbfd4',
        backgroundColor: '#ebebeb',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
    },
    cardScroll: {
        // width determined by content
    },
    card: {
        //backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginRight: 12,
        width: 120,
        alignItems: 'center',
    },
    cardText: {
        fontSize: 16,
    },
});