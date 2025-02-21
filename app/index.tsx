import { ScrollView, Text, View, TouchableOpacity } from "react-native";

//const PlaceHolderImage = require('@/assets/images/wine-bottle.png');
import FilterSection from "@/components/FilterSection";
import WineSection from "@/components/WineSection";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons';
import { router } from "expo-router";

import { RegionsContext, CepagesContext, CouleursContext, MetsContext } from "@/components/Contexts";



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

    // État pour les filtres sélectionnés
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedCouleurs, setSelectedCouleurs] = useState<string[]>([]);
    const [selectedCepages, setSelectedCepages] = useState<string[]>([]);
    const [selectedMets, setSelectedMets] = useState<string[]>([]);
    
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
            <TouchableOpacity style={{
                position: "absolute",
                right: 20,
                bottom: 20,
            }}
            onPress={() => router.push('./editPage')}>
                <FontAwesome size={40} name="plus-circle"/>
            </TouchableOpacity>
        </View>
        
        <ScrollView
        contentContainerStyle={{
            flex: 2,
            //justifyContent: "center",
            //alignItems: "center",
        }}
        
        >
            <RegionsContext.Provider 
            value={{selectedFilters: selectedRegions, setSelectedFilters: setSelectedRegions}}>
                <CepagesContext.Provider
                value={{selectedFilters: selectedCepages, setSelectedFilters: setSelectedCepages}}>
                    <CouleursContext.Provider
                    value={{selectedFilters: selectedCouleurs, setSelectedFilters: setSelectedCouleurs}}>
                        <MetsContext.Provider
                        value={{selectedFilters: selectedMets, setSelectedFilters: setSelectedMets}}>

            <FilterSection regions={regions} mets={mets} cepages={cepages} couleurs={couleurs}/>
            <WineSection data={data}/>
            </MetsContext.Provider>
            </CouleursContext.Provider>
            </CepagesContext.Provider>
            </RegionsContext.Provider>
        </ScrollView>

    </SafeAreaView>

  );
}
