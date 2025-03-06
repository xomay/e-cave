import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

//const PlaceHolderImage = require('@/assets/images/wine-bottle.png');
import FilterSection from "@/components/FilterSection";
import WineSection from "@/components/WineSection";
import { FontAwesome } from '@expo/vector-icons';
import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { CepagesContext, MetsContext, MillesimeContext, RegionsContext } from "@/components/Contexts";

import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';

type WineTemp = {
    id: number,
    appellation: string,
    region: string,
    couleur: string,
    cepage: string,
    domaine: string,
}

type Wine = {
    id: number,
    appellation: string,
    region: string,
    couleur: string,
    cepage: string,
    domaine: string,
    mets: string[],
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
type Millesime = {
    nom: string,
}
export default function Index() {

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<Wine[]>([])
  //const [dataFull, setDataFull] = useState<WineFull[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [mets, setMets] = useState<Mets[]>([])
  const [cepages, setCepages] = useState<Cepage[]>([])
  const [millesime, setMillesime] = useState<Millesime[]>([{nom: "-5ans"},{nom: "5-10ans"},{nom: "10-20ans"},{nom: "+20ans"}])

  // console.log("regions = ",regions);

  const database = useSQLiteContext();
  //console.log("database = ",database);

  const loadWinesOld = async () => {
    const res = await database.getAllAsync<Wine>('SELECT * FROM bouteille;');
    // console.log("res = ",res);
    setData(res);
    };

    /*const loadWines = async () => {
        //console.log("Fetching bouteilles");
        try{
            const res = await database.getAllAsync<Wine>('SELECT vin.id_vin as id,appellation.nom_a as appellation,domaine.nom_d as domaine,region.nom_r as region,couleur.nom_co as couleur,cepage.nom_ce as cepage FROM vin, appellation, region, couleur, cepage, domaine WHERE vin.id_appellation = appellation.id_appellation AND vin.id_region=region.id_region AND vin.id_couleur=couleur.id_couleur AND vin.id_cepage=cepage.id_cepage AND vin.id_domaine=domaine.id_domaine;');
            //const res_mets = await database.getAllAsync<Mets>('SELECT mets.nom_m as nom FROM vin, marie, mets WHERE vin.id_vin = marie.id_vin AND mets.id_mets = marie.id_mets AND vin.id_vin=$id;', {id: });
            setData(res);
            res.map(async (wine) => {
                const res_mets = await database.getAllAsync<Mets>('SELECT mets.nom_m as nom FROM vin, marie, mets WHERE vin.id_vin = marie.id_vin AND mets.id_mets = marie.id_mets AND vin.id_vin=$id;', {id: wine.id});
                setDataFull([...dataFull, {id: wine.id, appellation: wine.appellation, region: wine.region, couleur: wine.couleur, cepage: wine.cepage, domaine: wine.domaine, mets: res_mets.map((mets) => mets.nom)}]);
                //console.log("res_mets = ",wine,res_mets);
            });
            setLoading(false);
        }catch(e){
            console.log("Error fetching bouteilles = ",e);
        }
        //const test = await database.getEachAsync<Wine>('SELECT vin.id_vin as id,appellation.nom_a as appellation,domaine.nom_d as domaine,region.nom_r as region,couleur.nom_co as couleur,cepage.nom_ce as cepage FROM vin, appellation, region, couleur, cepage, domaine WHERE vin.id_appellation = appellation.id_appellation AND vin.id_region=region.id_region AND vin.id_couleur=couleur.id_couleur AND vin.id_cepage=cepage.id_cepage AND vin.id_domaine=domaine.id_domaine;');
        //var i = 0;
        for await (const wine of test) {
            i++;
        }
        //console.log("test size = ",i);
        // console.log("res wine = ",res);
        //console.log("data size = ",data.length);
        };*/

    const loadWines = async () => {
        try{
            const res: Wine[] = [];
            //const res_mets = await database.getAllAsync(`SELECT mets.nom_m as nom FROM vin, marie, mets WHERE vin.id_vin = marie.id_vin AND mets.id_mets = marie.id_mets AND vin.id_vin=?;`, [1]);
            
            //const res_tab = await database.getAllAsync<WineTemp>('SELECT vin.id_vin as id,appellation.nom_a as appellation,domaine.nom_d as domaine,region.nom_r as region,couleur.nom_co as couleur,cepage.nom_ce as cepage FROM vin, appellation, region, couleur, cepage, domaine WHERE vin.id_appellation = appellation.id_appellation AND vin.id_region=region.id_region AND vin.id_couleur=couleur.id_couleur AND vin.id_cepage=cepage.id_cepage AND vin.id_domaine=domaine.id_domaine;');
            //console.log("res_tab = ",res_tab.length);
            const wineIterator = await database.getEachAsync<WineTemp>('SELECT vin.id_vin as id,appellation.nom_a as appellation,domaine.nom_d as domaine,region.nom_r as region,couleur.nom_co as couleur,cepage.nom_ce as cepage FROM vin, appellation, region, couleur, cepage, domaine WHERE vin.id_appellation = appellation.id_appellation AND vin.id_region=region.id_region AND vin.id_couleur=couleur.id_couleur AND vin.id_cepage=cepage.id_cepage AND vin.id_domaine=domaine.id_domaine;');
            for await (const wine of wineIterator) {
                //console.log("wine id = ",wine.id);
                try{
                    const res_mets = await database.getAllAsync<Mets>('SELECT mets.nom_m as nom FROM vin, marie, mets WHERE vin.id_vin = marie.id_vin AND mets.id_mets = marie.id_mets AND vin.id_vin=$id;', {$id: wine.id});
                    //console.log("res_mets = ",res_mets);
                    res.push({id: wine.id, appellation: wine.appellation, region: wine.region, couleur: wine.couleur, cepage: wine.cepage, domaine: wine.domaine, mets: res_mets.map((mets) => mets.nom)});
                    //setData([...data, {id: wine.id, appellation: wine.appellation, region: wine.region, couleur: wine.couleur, cepage: wine.cepage, domaine: wine.domaine, mets: res_mets.map((mets) => mets.nom)}]);
                    //console.log("data = ",dataFull);
                }catch(e){
                    console.log("Error fetching mets = ",e);
                }
                /*const res_mets = await database.getAllAsync<Mets>('SELECT mets.nom_m as nom FROM vin, marie, mets WHERE vin.id_vin = marie.id_vin AND mets.id_mets = marie.id_mets AND vin.id_vin=$id;', {id: wine.id});
                console.log("res_mets = ",res_mets);
                setDataFull([...dataFull, {id: wine.id, appellation: wine.appellation, region: wine.region, couleur: wine.couleur, cepage: wine.cepage, domaine: wine.domaine, mets: res_mets.map((mets) => mets.nom)}]);
                //console.log("wine = ",wine,res_mets);*/
            }
            setData(res);
            //console.log("data = ",res.length);
            setLoading(false);
        }catch(e){
            console.log("Error fetching bouteilles = ",e);
        }
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
    
    /*const loadCouleurs = async () => {
        const res = await database.getAllAsync<Couleur>('SELECT nom_co as nom FROM couleur;');
        // console.log("res = ",res);
        setCouleurs(res);
        };*/

    useFocusEffect(
        useCallback(() => {
            // console.log('useFocusEffect');
            loadRegions();
            loadMets();
            loadCepages();
            //loadCouleurs();
            loadWines();
        }, [])
    );

    // État pour les filtres sélectionnés
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedMillesime, setSelectedMillesime] = useState<string[]>([]);
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
                    <MillesimeContext.Provider
                    value={{selectedFilters: selectedMillesime, setSelectedFilters: setSelectedMillesime}}>
                        <MetsContext.Provider
                        value={{selectedFilters: selectedMets, setSelectedFilters: setSelectedMets}}>

            <FilterSection regions={regions} mets={mets} cepages={cepages} millesimes={millesime}/>
            <WineSection data={data}/>
            </MetsContext.Provider>
            </MillesimeContext.Provider>
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