import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, FlatList, TextInput } from 'react-native';

import { RegionsContext, MetsContext, CepagesContext, MillesimeContext, SearchContext } from './Contexts';

import {colors} from '@/constants/colors';
import {fonts} from '@/constants/fonts';

const filterButtons = ['Mets', 'Région', 'Cépage', 'Millésime'];

const cardData = [
    { id: '1', title: 'Viande', filter: 'Mets' },
    { id: '2', title: 'Poisson', filter: 'Mets' },
    { id: '3', title: 'Bordeaux', filter: 'Région' },
    { id: '4', title: 'Pinot Noir', filter: 'Cépage' },
];

export const regionImages = 
    [
      {
        region : "Bordeaux",
        image: require('@/assets/images/regions/Bordeaux.png'),
      },
      { region : "Bourgogne",
        image: require('@/assets/images/regions/Bourgogne.png'),
      },
      {
        region: "Allemagne",
        image: require('@/assets/images/regions/Allemagne.png'),
      },
      {
        region: "Espagne",
        image: require('@/assets/images/regions/Espagne.png'),
      },
      {
        region: "Alsace",
        image: require('@/assets/images/regions/Alsace.png'),
      },
      {
        region: "Champagne",
        image: require('@/assets/images/regions/Champagne.png'),
      },
      {
        region: "Languedoc-Roussillon",
        image: require('@/assets/images/regions/Languedoc-Roussillon.png'),
      },
      {
        region: "Loire",
        image: require('@/assets/images/regions/Loire.png'),
      },
      {
        region: "Provence",
        image: require('@/assets/images/regions/Provence.png'),
      },
      {
        region: "Rhone",
        image: require('@/assets/images/regions/Rhone.png'),
      },
      {
        region: "Sud Ouest",
        image: require('@/assets/images/regions/Sud Ouest.png'),
      }
    ];

export const millesimeImage = 
[
    {
    millesime : "-5ans",
    image: require('@/assets/images/millesime/-5ans.png'),
    },
    {
    millesime : "5-10ans",
    image: require('@/assets/images/millesime/5-10ans.png'),
    },
    {
    millesime : "10-20ans",
    image: require('@/assets/images/millesime/10-20ans.png'),
    },
    {
    millesime : "+20ans",
    image: require('@/assets/images/millesime/+20ans.png'),
    },
];

export const metsImage = 
[
    {
    mets : "Cuisine",
    image: require('@/assets/images/mets/Cuisine.png'),
    },
    {
    mets : "Fromage",
    image: require('@/assets/images/mets/Fromage.png'),
    },
    {
    mets : "Viande rouge",
    image: require('@/assets/images/mets/Viande rouge.png'),
    },
    {
    mets : "Apero",
    image: require('@/assets/images/mets/Apero.png'),
    },
    {
    mets : "Poisson",
    image: require('@/assets/images/mets/Poisson.png'),
    },
    {
    mets : "Entree",
    image: require('@/assets/images/mets/Entree.png'),
    },
    {
    mets : "Coquillages",
    image: require('@/assets/images/mets/Coquillages.png'),
    },
    {
    mets : "Crepes",
    image: require('@/assets/images/mets/Crepes.png'),
    },
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
type Millesime = {
    nom: string,
}

/*
export const RegionsContext = createContext<string[]>([]);
export const MetsContext = createContext<string[]>([]);
export const CepagesContext = createContext<string[]>([]);
export const CouleursContext = createContext<string[]>([]);
*/
export default function FilterSection(props: {regions: Region[], mets: Mets[], cepages: Cepage[], millesimes: Millesime[]}) {
    const [activeBtn, setActiveBtn] = useState<string>('Mets')

    const Regions = useContext(RegionsContext);
    const Mets = useContext(MetsContext);
    const Cepages = useContext(CepagesContext);
    const Millesime = useContext(MillesimeContext);
    const Search = useContext(SearchContext);

    const selectedRegions = Regions.selectedFilters;
    const setSelectedRegions = Regions.setSelectedFilters;
    const selectedMets = Mets.selectedFilters;
    const setSelectedMets = Mets.setSelectedFilters;
    const selectedCepages = Cepages.selectedFilters;
    const selectedSearch = Search.selectedFilters;
    const setSelectedCepages = Cepages.setSelectedFilters;
    const selectedMillesime = Millesime.selectedFilters;
    const setSelectedMillesime = Millesime.setSelectedFilters;
    const setSelectedSearch = Search.setSelectedFilters;

    const regions = props.regions;
    const mets = props.mets;
    const cepages = props.cepages;
    const millesimes = props.millesimes;
    //const millesime = [{nom: "-5ans"}, {nom: "5-10ans"}, {nom: "10-20ans"}, {nom: "+20ans"}];
    const filters= {
        regions: regions, 
        mets: mets, 
        cepages: cepages, 
        millesime: millesimes};
    /*console.log("filters = ",filters);
    console.log("regions = ",regions);*/
    const filtersss = [
        { value: regions, filter: 'Région' },
        { value: mets, filter: 'Mets' },
        { value: cepages, filter: 'Cépage' },
        { value: millesimes, filter: 'Millésime' },
    ];

    const handleFilterPress = (button:string) => {
        //console.log("activeBtn = ",activeBtn);
        setActiveBtn(button);
    }

    //console.log("filtersss = ",filtersss.filter((filtre) => filtre.filter === activeBtn).map((el) => el.value.map((el) => el.nom)));  
    
    // État pour les filtres sélectionnés
    /*const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedCouleurs, setSelectedCouleurs] = useState<string[]>([]);
    const [selectedCepages, setSelectedCepages] = useState<string[]>([]);
    const [selectedMets, setSelectedMets] = useState<string[]>([]);*/
    

    // Fonction pour gérer la sélection des filtres
    const toggleFilter = (filterType: string, value: string) => {
        switch (filterType) {
            case 'Région':
                setSelectedRegions(prev =>
                    prev.includes(value) ? prev.filter(r => r !== value) : [...prev, value]
                );
                break;
            case 'Millésime':
                setSelectedMillesime(prev =>
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
        <RegionsContext.Provider value={{selectedFilters: selectedRegions, setSelectedFilters: setSelectedRegions}}>
            
        <View style={styles.container}>
            {/* Title */}
            {/*<Text style={styles.title}>Filtres</Text>*/}

            <View style={{width: '100%', alignItems: 'center', padding: 10,}}>
                <TextInput
                placeholder='Rechercher votre vin'
                value={selectedSearch.join(' ')}
                onChangeText={(text) => setSelectedSearch(text.split(' '))}
                style={styles.textInput}
                autoComplete='off'
                autoCorrect={false}
                />
            </View>

            {/* Filter Buttons */}
            <View style={styles.buttonRow}>
                {filterButtons.map((button, index) => (
                    <TouchableOpacity key={index} style={[styles.filterButton, { backgroundColor: activeBtn === button ? colors.theme_orange : colors.secondary_blue}]}
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
                filter((filtre) => filtre.filter === activeBtn)[0].value
                .map((el, index) =>
                        <TouchableOpacity key={`${el.nom}-${selectedRegions.includes(el.nom) || selectedCepages.includes(el.nom) 
                            || selectedMillesime.includes(el.nom)
                            || selectedMets.includes(el.nom) ? 'selected' : 'not-selected'}`} 
                style={[styles.card,{justifyContent: (activeBtn !== 'Millésime') ? 'space-between' : 'center'}, { backgroundColor: (selectedRegions.includes(el.nom) 
                    || selectedCepages.includes(el.nom) 
                    || selectedMillesime.includes(el.nom)
                    || selectedMets.includes(el.nom)
                )? colors.theme_orange : colors.tertiary_blue}, {marginLeft: index === 0 ? 10 : 0}]}
                onPress={() => toggleFilter(activeBtn, el.nom)}
                >
                    {activeBtn === 'Région' ? <Image source={regionImages.find(region => region.region === el.nom)?.image} style={styles.imageCard} resizeMode="contain"/> : null}
                    {activeBtn === 'Cépage' ? <Image source={require('@/assets/images/cepages/Assemblage.png')} style={styles.imageCard} resizeMode="contain"/> : null}
                    {activeBtn === 'Millésime' ? <Image source={millesimeImage.find(millesime => millesime.millesime === el.nom)?.image} style={styles.imageCard} resizeMode="contain"/> : null}
                    {activeBtn === 'Mets' ? <Image source={metsImage.find(mets => mets.mets === el.nom)?.image} style={styles.imageCard} resizeMode="contain"/> : null}
                            {activeBtn !== 'Millésime' ? <Text style={styles.cardText}>{el.nom}</Text> : null}
                        </TouchableOpacity>
                        )}

                
            </ScrollView>
            {/*<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
                <FlatList style={{flexDirection: 'row', width: '100%'}} horizontal={true} data={filtersss.filter((filtre) => filtre.filter === activeBtn)[0].value} renderItem={({item}) => 
                <TouchableOpacity
                //style={[styles.card, {backgroundColor: }]}
                style={[styles.card, { backgroundColor: (selectedRegions.includes(item.nom) 
                    || selectedCepages.includes(item.nom) 
                    || selectedCouleurs.includes(item.nom)
                    || selectedMets.includes(item.nom)
                )? colors.theme_orange : colors.tertiary_blue}]}
                onPress={() => toggleFilter(activeBtn, item.nom)}
                >
                    {activeBtn === 'Région' ? <Image source={regionImages.find(region => region.region === item.nom)?.image} style={styles.imageCard} resizeMode="contain"/> : null}
                    <Text style={styles.cardText}>{item.nom}</Text>
                </TouchableOpacity> }/>
            </ScrollView>*/}
            {/*<View>
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
            </View>*/}
            {/*renderFilterContent()*/}
        </View>
        </RegionsContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        //padding: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    textInput: {
        borderWidth: 0.5,
        padding: 10,
        width: "100%",
        borderRadius: 10,
        borderColor: "slategray",
        height: 40,
        backgroundColor: colors.theme_white,
      },
    buttonRow: {
        flexDirection: 'row',
        marginBottom: 16,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    filterButton: {
        //backgroundColor: '#6cbfd4',
        backgroundColor: colors.theme_white,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
    },
    buttonText: {
        color: colors.theme_white,
        fontSize: 16,
    },
    cardScroll: {
        // width determined by content
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginBottom: 20,
    },
    card: {
        //backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginRight: 12,
        width: 120,
        height: 120,
        alignItems: 'center',
        //justifyContent: 'space-between',
    },
    imageCard: {
        //width: '80%',
        height: '80%',
        maxWidth: '100%',
      },
    cardText: {
        color: colors.theme_white,
        fontFamily: fonts.sfmedium,
        fontSize: 12,
    },
});

