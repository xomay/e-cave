import { ScrollView, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from "react-native";

//const PlaceHolderImage = require('@/assets/images/wine-bottle.png');
import FilterSection from "@/components/FilterSection";
import WineSection from "@/components/WineSection";
import { FontAwesome } from '@expo/vector-icons';
import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { CepagesContext, CouleursContext, MetsContext, RegionsContext } from "@/components/Contexts";

import { fonts } from '@/constants/fonts';
import {colors} from '@/constants/colors';

type Wine = {
    id: number,
    appellation: string,
    region: string,
    couleur: string,
    cepage: string,
    domaine: string,
}

type WineTest = {
    id: number,
    appellation: string,
    region: string,
    millesime: number[],
    quantite: number,
    couleur: string,
    cepage: string,
    note: number,
    domaine: string,
}
//bouteille.id_bouteille,
// appellation.nom, 
// region.nom,
// bouteille.millesime, 
// bouteille.quantite, couleur.nom, cepage.nom
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

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<Wine[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [mets, setMets] = useState<Mets[]>([])
  const [cepages, setCepages] = useState<Cepage[]>([])
  const [couleurs, setCouleurs] = useState<Couleur[]>([])

  // console.log("regions = ",regions);

  const database = useSQLiteContext();
  //console.log("database = ",database);

  const loadWinesOld = async () => {
    const res = await database.getAllAsync<Wine>('SELECT * FROM bouteille;');
    // console.log("res = ",res);
    setData(res);
    };

    const loadWines = async () => {
        //console.log("Fetching bouteilles");
        try{
            const res = await database.getAllAsync<Wine>('SELECT vin.id_vin as id,appellation.nom_a as appellation,domaine.nom_d as domaine,region.nom_r as region,couleur.nom_co as couleur,cepage.nom_ce as cepage FROM vin, appellation, region, couleur, cepage, domaine WHERE vin.id_appellation = appellation.id_appellation AND vin.id_region=region.id_region AND vin.id_couleur=couleur.id_couleur AND vin.id_cepage=cepage.id_cepage AND vin.id_domaine=domaine.id_domaine;');
            setData(res);
            setLoading(false);
        }catch(e){
            console.log("Error fetching bouteilles = ",e);
        }
        //const test = await database.getEachAsync<Wine>('SELECT vin.id_vin as id,appellation.nom_a as appellation,domaine.nom_d as domaine,region.nom_r as region,couleur.nom_co as couleur,cepage.nom_ce as cepage FROM vin, appellation, region, couleur, cepage, domaine WHERE vin.id_appellation = appellation.id_appellation AND vin.id_region=region.id_region AND vin.id_couleur=couleur.id_couleur AND vin.id_cepage=cepage.id_cepage AND vin.id_domaine=domaine.id_domaine;');
        //var i = 0;
        /*for await (const wine of test) {
            i++;
        }*/
        //console.log("test size = ",i);
        // console.log("res wine = ",res);
        //console.log("data size = ",data.length);
        };

    const loadRegions = async () => {
        const res = await database.getAllAsync<Region>('SELECT nom_r as nom FROM region;');
        // console.log("res region = ",res);
        setRegions(res);
        };

    const loadMets = async () => {
        const res = await database.getAllAsync<Mets>('SELECT nom_m as nom FROM mets;');
        // console.log("res = ",res);
        setMets(res);
        };
    
    const loadCepages = async () => {
        const res = await database.getAllAsync<Cepage>('SELECT nom_ce as nom FROM cepage ORDER BY id_cepage ASC;');
        // console.log("res cepage = ",res);
        setCepages(res);
        };
    
    const loadCouleurs = async () => {
        const res = await database.getAllAsync<Couleur>('SELECT nom_co as nom FROM couleur;');
        // console.log("res = ",res);
        setCouleurs(res);
        };

    useFocusEffect(
        useCallback(() => {
            // console.log('useFocusEffect');
            loadRegions();
            loadMets();
            loadCepages();
            loadCouleurs();
            loadWines();
        }, [])
    );

    // État pour les filtres sélectionnés
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedCouleurs, setSelectedCouleurs] = useState<string[]>([]);
    const [selectedCepages, setSelectedCepages] = useState<string[]>([]);
    const [selectedMets, setSelectedMets] = useState<string[]>([]);
    /*<SafeAreaView style={{
        flex: 1,
    }}>*/
   if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#000" />
        </View>
        );
    }else{
        return (  
            
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: colors.theme_background,
            }}>
        <ScrollView
        contentContainerStyle={{
            //flex: 1,
            //justifyContent: "center",
            //alignItems: "center",
        }} indicatorStyle="black"
        >
        <View style={{
            height: 100,
            flex: 0,
            justifyContent: "flex-end",
            
        }}>
            <Text style={styles.welcometitle}>Bonjour Mathys,</Text>
            <TouchableOpacity style={{
                position: "absolute",
                right: 20,
                bottom: 20,
            }}
            onPress={() => router.push('./editPage')}>
                <FontAwesome size={40} name="plus-circle"/>
            </TouchableOpacity>
        </View>
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
}

const styles = StyleSheet.create({
    welcometitle: {
        fontSize: 30,
        fontFamily: fonts.neuebold,
        padding: 10,
    },
});