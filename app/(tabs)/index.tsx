import { ScrollView, Text, View } from "react-native";

//const PlaceHolderImage = require('@/assets/images/wine-bottle.png');
import FilterSection from "@/components/FilterSection";
import WineSection from "@/components/WineSection";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";



type Wine = {
    domaine: number,
    appellation: number,
    region: number,
    millesime: number,
    quantite: number,
    couleur: number,
    cepage: number,
}
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
export default function Index() {

  const [data, setData] = useState<Wine[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [mets, setMets] = useState<Mets[]>([])
  const [cepages, setCepages] = useState<Cepage[]>([])
  const [couleurs, setCouleurs] = useState<Couleur[]>([])

  // console.log("regions = ",regions);

  const database = useSQLiteContext();

  const loadWines = async () => {
    const res = await database.getAllAsync<Wine>('SELECT * FROM bouteille;');
    // console.log("res = ",res);
    setData(res);
    };

    const loadRegions = async () => {
        const res = await database.getAllAsync<Region>('SELECT nom FROM region;');
        // console.log("res = ",res);
        setRegions(res);
        };

    const loadMets = async () => {
        const res = await database.getAllAsync<Mets>('SELECT nom FROM mets;');
        // console.log("res = ",res);
        setMets(res);
        };
    
    const loadCepages = async () => {
        const res = await database.getAllAsync<Cepage>('SELECT nom FROM cepage;');
        // console.log("res = ",res);
        setCepages(res);
        };
    
    const loadCouleurs = async () => {
        const res = await database.getAllAsync<Couleur>('SELECT nom FROM couleur;');
        // console.log("res = ",res);
        setCouleurs(res);
        };

    useFocusEffect(
        useCallback(() => {
            // console.log('useFocusEffect');
            loadWines();
            loadRegions();
            loadMets();
            loadCepages();
            loadCouleurs();
        }, [])
    );
  return (  
    <SafeAreaView style={{
        flex: 1,
    }}>
        <View style={{
            height: 100,
            flex: 0,
            justifyContent: "flex-end",
        }}>
            <Text>Bonjour Laurent</Text>
            <Text>Bienvenue dans votre cave</Text>
        </View>
        
        <ScrollView
        contentContainerStyle={{
            flex: 2,
            //justifyContent: "center",
            //alignItems: "center",
        }}
        
        >
            <FilterSection regions={regions} mets={mets} cepages={cepages} couleurs={couleurs}/>
            <WineSection data={data}/>
        </ScrollView>

    </SafeAreaView>

  );
}
