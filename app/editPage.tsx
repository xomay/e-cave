import { metsImage } from "@/components/FilterSection";
import { colors } from "@/constants/colors";
import { fonts } from '@/constants/fonts';
import { AntDesign } from '@expo/vector-icons';
import { router, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type WineDetails = {
  id: number,
  domaine: string,
  appellation: string,
  region: string,
  millesime: number,
  quantite: number,
  couleur: string,
  cepage: string,
  type: string,
  note: number,
  flacon: number,
}

//TODO : autoincrement les id
// TODO : champs : domaine, appellation, region, millesime, quantite, couleur, cepage, note, type
// TODO : aucomplétion par les valeurs connues
// TODO : vérification si valeurs inconnues -> ajout
// TODO : vérification si pas déjà existante -> ajout
// TODO : si déjà connue : UPDATE

export default function editPage() {
    // gat the id from the url
  const { id } = useLocalSearchParams<{id:string}>();

  // local state
  const [wine, setWine] = useState<WineDetails | null>();
  const [domaines, setDomaines] = useState<string[]>([]);
  const [appellations, setAppellations] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [couleurs, setCouleurs] = useState<string[]>([]);
  const [cepages, setCepages] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [flacons, setFlacons] = useState<number[]>([])
  const [mets, setMets] = useState<string[]>([])

  const [domaineFiltered, setDomaineFiltered] = useState<string[]>([]);
  const [appellationFiltered, setAppellationFiltered] = useState<string[]>([]);
  const [regionFiltered, setRegionFiltered] = useState<string[]>([]);
  const [couleurFiltered, setCouleurFiltered] = useState<string[]>([]);
  const [cepageFiltered, setCepageFiltered] = useState<string[]>([]);
  const [typeFiltered, setTypeFiltered] = useState<string[]>([]);

  //constante booléenne pour gérer l'affichage des recommendations
  const [domaineInputSelected, setDomaineInputSelected] = useState(false);
  const [appellationInputSelected, setAppellationInputSelected] = useState(false);
  const [regionInputSelected, setRegionInputSelected] = useState(false);
  const [couleurInputSelected, setCouleurInputSelected] = useState(false);
  const [cepageInputSelected, setCepageInputSelected] = useState(false);
  const [typeInputSelected, setTypeInputSelected] = useState(false);

  //variable pour gérer la valeur des inputs
  const [domaineInput, setDomaineInput] = useState(wine?.domaine ?? '');
  const [appellationInput, setAppellationInput] = useState(wine?.appellation ?? '');
  const [regionInput, setRegionInput] = useState(wine?.region ?? '');
  const [couleurInput, setCouleurInput] = useState(wine?.couleur ?? '');
  const [cepageInput, setCepageInput] = useState(wine?.cepage ?? '');
  const [typeInput, setTypeInput] = useState(wine?.type ?? '');
  const [noteInput, setNoteInput] = useState(wine?.note.toString() ?? '');
  const [quantiteInput, setQuantiteInput] = useState(wine?.quantite.toString() ?? '');
  const [millesimeInput, setMillesimeInput] = useState(wine?.millesime.toString() ?? '');
  const [flaconInput, setFlaconInput] = useState<number>(0);
  const [metsInput, setMetsInput] = useState<string[]>([]);

  const [domaineLoaded, setDomaineLoaded] = useState(false);
  const [appellationLoaded, setAppellationLoaded] = useState(false);
  const [regionLoaded, setRegionLoaded] = useState(false);
  const [couleurLoaded, setCouleurLoaded] = useState(false);
  const [cepageLoaded, setCepageLoaded] = useState(false);
  const [typeLoaded, setTypeLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [flaconLoaded, setFlaconLoaded] = useState(false);
  const [metsLoaded, setMetsLoaded] = useState(false);

  // local state for edit mode
  const [editMode, setEditMode] = useState(false);

  // get the database context
  const database = useSQLiteContext();

  useEffect(() => {
    if (id) {
      // if id is present, then we are in edit mode
      setEditMode(true);
      loadData();
    }
  }, [id]);

  // Fonction qui charge toutes les données lors de l'arrivée sur la page
  useFocusEffect(
    useCallback(() => {
      loadDomaines();
      loadAppellations();
      loadRegions();
      loadCouleurs();
      loadCepages();
      loadTypes();
      loadFlacons();
      loadMets();
    }, [])
  );

  const loadData = async () => {
    const result = await database.getFirstAsync<WineDetails>(`SELECT bouteille.id_bouteille as id, domaine.nom_d as domaine, appellation.nom_a as appellation, region.nom_r as region , bouteille.millesime as millesime, bouteille.quantite as quantite, couleur.nom_co as couleur, cepage.nom_ce as cepage,  bouteille.note as note, type.nom_t as type, bouteille.flacon as flacon FROM vin, bouteille, domaine, appellation, region, couleur, cepage, type WHERE bouteille.id_bouteille = ? AND bouteille.id_vin=vin.id_vin AND vin.id_appellation=appellation.id_appellation AND vin.id_cepage=cepage.id_cepage AND vin.id_couleur=couleur.id_couleur AND vin.id_domaine=domaine.id_domaine AND vin.id_region=region.id_region AND vin.id_type=type.id_type;`, [id]);
    setWine(result);
    setDomaineInput(result?.domaine ?? '');
    setAppellationInput(result?.appellation ?? '');
    setRegionInput(result?.region ?? '');
    setCouleurInput(result?.couleur ?? '');
    setCepageInput(result?.cepage ?? '');
    setTypeInput(result?.type ?? '');
    setNoteInput(result?.note.toString() ?? '');
    setQuantiteInput(result?.quantite.toString() ?? '');
    setMillesimeInput(result?.millesime.toString() ?? '');
    setFlaconInput(result?.flacon ?? 0)
    try{
      const res = await database.getAllAsync<{mets:string}>('SELECT mets.nom_m as mets FROM bouteille, vin, marie, mets WHERE bouteille.id_vin = vin.id_vin AND vin.id_vin = marie.id_vin AND mets.id_mets = marie.id_mets AND bouteille.id_bouteille=$id;', {$id: id});
      setMetsInput(res.map((m) => m.mets));
    }catch (error) {
      console.error('Erreur lors du chargement des mets :', error);
    }
    setDataLoaded(true);
    /*setName(result?.name!);
    setEmail(result?.email!);*/
  };
  
  //Fonction permettant de récupérer les domaines déjà existants
  const loadDomaines= async () => {
    const ite = database.getEachAsync<{nom: string}>(`SELECT DISTINCT(nom_d) as nom FROM domaine`);
    for await (const d of ite)  {
      setDomaines((prev) => [...prev, d.nom]);
      setDomaineFiltered((prev) => [...prev, d.nom]);
      //console.log(d.nom);
    }
    setDomaineLoaded(true);
  }
    
  //Fonction permettant de récupérer les appellations déjà existants
  const loadAppellations = async () => {
    const ite = database.getEachAsync<{nom: string}>(`SELECT nom_a as nom FROM appellation`);
    for await (const v of ite)  {
      setAppellations((prev) => [...prev, v.nom]);
      setAppellationFiltered((prev) => [...prev, v.nom]);
      //console.log(d.nom);
    }
    setAppellationLoaded(true);
  }

    //Fonction permettant de récupérer les régions déjà existants
  const loadRegions = async () => {
    const ite = database.getEachAsync<{nom: string}>(`SELECT nom_r as nom FROM region`);
    for await (const v of ite)  {
      setRegions((prev) => [...prev, v.nom]);
      setRegionFiltered((prev) => [...prev, v.nom]);
      //console.log(d.nom);
    }
    setRegionLoaded(true);
  }
  
  //Fonction permettant de récupérer les couleurs déjà existants
  const loadCouleurs = async () => {
    const ite = database.getEachAsync<{nom: string}>(`SELECT nom_co as nom FROM couleur`);
    for await (const v of ite)  {
      setCouleurs((prev) => [...prev, v.nom]);
      setCouleurFiltered((prev) => [...prev, v.nom]);
      //console.log(d.nom);
    }
    setCouleurLoaded(true);
  }
  
  //Fonction permettant de récupérer les cepages déjà existants
  const loadCepages = async () => {
    const ite = database.getEachAsync<{nom: string}>(`SELECT nom_ce as nom FROM cepage`);
    for await (const v of ite)  {
      setCepages((prev) => [...prev, v.nom]);
      setCepageFiltered((prev) => [...prev, v.nom]);
      //console.log(d.nom);
    }
    setCepageLoaded(true);
  }
  
  //Fonction permettant de récupérer les types déjà existants
  const loadTypes = async () => {
    const ite = database.getEachAsync<{nom: string}>(`SELECT nom_t as nom FROM type`);
    for await (const v of ite)  {
      setTypes((prev) => [...prev, v.nom]);
      setTypeFiltered((prev) => [...prev, v.nom]);
      //console.log(d.nom);
    }
    setTypeLoaded(true);
  }

  const loadFlacons = async () => {
    const ite = database.getEachAsync<{flacon: number}>(`SELECT DISTINCT(flacon) as flacon FROM bouteille`);
    var data: number[] = []
    for await (const v of ite)  {
      //setFlacons((prev) => [...prev, v.flacon]);
      data.push(v.flacon)
      //console.log(d.nom);
    }
    setFlacons(data)
    setFlaconLoaded(true);
  }  

  const loadMets = async () => {
    const ite = database.getEachAsync<{mets: string}>(`SELECT nom_m as mets FROM mets`);
    var data: string[] = []
    for await (const v of ite)  {
      //setFlacons((prev) => [...prev, v.flacon]);
      data.push(v.mets)
      //console.log(d.nom);
    }
    setMets(data)
    setMetsLoaded(true);
  }  

  //TODO : si tous les ids sont différents de 0 : update sinon erreur
  const handleSave = async () => {
    /*if (domaineInput === '' || appellationInput === '' || regionInput === '' || millesimeInput === '' || quantiteInput === '' || couleurInput === '' || cepageInput === '' || typeInput === '' || noteInput === '' || flaconInput === 0) {
      console.log("Missing fields");
      return (Alert.alert('Champs manquant', 'Des informations nécessaires sont manquantes', [
        {
          text: 'Cancel',
          //onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ]));
    }*/

   
   // RECUPERATION DE L'ID DU DOMAINE
   if (!domaines.includes(domaineInput)){
      try{
        database.runSync('INSERT INTO domaine (nom_d) VALUES ($nom_d);', {$nom_d: domaineInput});
      }catch (error) {
        console.error('Erreur lors de l\'ajout du domaine :', error);
      }
    }
    const id_d = database.getFirstSync<{id: number}>('SELECT id_domaine as id FROM domaine WHERE nom_d=$nom_d;', {$nom_d: domaineInput}) ?? {id: -1};
    console.log("Id domaine recupéré : ", id_d.id);
    //FIN DU DOMAINE

    // RECUPERATION DE L'ID DE L'APPELLATION
    if (!appellations.includes(appellationInput)){
      try{
        database.runSync('INSERT INTO appellation (nom_a) VALUES ($nom_a);', {$nom_a: appellationInput});
      }catch (error) {
        console.error('Erreur lors de l\'ajout de l\'appellation :', error);
      }
    }
      const id_a = database.getFirstSync<{id: number}>('SELECT id_appellation as id FROM appellation WHERE nom_a=$nom_a;', {$nom_a: appellationInput}) ?? {id: -1};
      console.log("Id appellation recupéré : ", id_a.id);
    //FIN DE L'APPELLATION
    
    // RECUPERATION DE L'ID DE LA REGION
    if (!regions.includes(regionInput)){
      try{
        database.runSync('INSERT INTO region (nom_r) VALUES ($nom_r);', {$nom_r: regionInput});
      }catch (error) {
        console.error('Erreur lors de l\'ajout de la région :', error);
      }
    }
      const id_r = database.getFirstSync<{id: number}>('SELECT id_region as id FROM region WHERE nom_r=$nom_r;', {$nom_r: regionInput}) ?? {id: -1};
      console.log("Id région recupéré : ", id_r.id);
    //FIN DE LA REGION

    // RECUPERATION DE L'ID DE LA COULEUR
    if (!couleurs.includes(couleurInput)){
      try{
        database.runSync('INSERT INTO couleur (nom_co) VALUES ($nom_co);', {$nom_co: couleurInput});
      }catch (error) {
        console.error('Erreur lors de l\'ajout de la couleur :', error);
      }
    }
      const id_co = database.getFirstSync<{id: number}>('SELECT id_couleur as id FROM couleur WHERE nom_co=$nom_co;', {$nom_co: couleurInput}) ?? {id: -1};
      console.log("Id couleur recupéré : ", id_co?.id);
    //FIN DE LA COULEUR

    // RECUPERATION DE L'ID DU CEPAGE
    if (!cepages.includes(cepageInput)){
      try{
        database.runSync('INSERT INTO cepage (nom_ce) VALUES ($nom_ce);', {$nom_ce: cepageInput});
      }catch (error) {
        console.error('Erreur lors de l\'ajout du cepage :', error);
      }
    }
    const id_ce = database.getFirstSync<{id: number}>('SELECT id_cepage as id FROM cepage WHERE nom_ce=$nom_ce;', {$nom_ce: cepageInput}) ?? {id: -1};
    console.log("Id cepage recupéré : ", id_ce.id);
    //FIN DU CEPAGE

    // RECUPERATION DE L'ID DU TYPE
    if (!types.includes(typeInput)){
      try{
        database.runSync('INSERT INTO type (nom_t) VALUES ($nom_t);', {$nom_t: typeInput});
      }catch (error) {
        console.error('Erreur lors de l\'ajout du type :', error);
      }
    }
    const id_t = database.getFirstSync<{id: number}>('SELECT id_type as id FROM type WHERE nom_t=$nom_t;', {$nom_t: typeInput}) ?? {id: -1};
    console.log("Id type recupéré : ", id_t.id);
    //FIN DU TYPE
    
    const id_f = 0;
    if (id){
      try{
        const id_vin = database.getFirstSync<{id: number}>('SELECT id_vin as id FROM bouteille WHERE id_bouteille=$id;', {$id: id}) ?? {id: -1};
        console.log("Id vin recupéré : ", id_vin.id, id_vin);
        if (id_vin.id != -1 && id_d.id != -1 && id_a.id != -1 && id_r.id != -1 && id_co.id != -1 && id_ce.id != -1 && id_t.id != -1){
          console.log("UPDATE : ", id_vin.id, id_d.id, id_a.id, id_r.id, id_co.id, id_ce.id, id_t.id, id);
          database.runSync('UPDATE vin SET id_domaine=$id_d, id_appellation=$id_a, id_region=$id_r, id_couleur=$id_co, id_cepage=$id_ce, id_type=$id_t WHERE id_vin=$id_vin;', {$id_d: id_d.id, $id_a: id_a.id, $id_r: id_r.id, $id_co: id_co.id, $id_ce: id_ce.id, $id_t: id_t.id, $id_vin: id_vin.id});
          database.runSync('UPDATE bouteille SET millesime=$millesime, quantite=$quantite, note=$note, flacon=$flacon WHERE id_bouteille=$id;', {$millesime: millesimeInput, $quantite: quantiteInput, $note: noteInput, $flacon: flaconInput, $id: id});
          database.runSync('DELETE FROM marie WHERE id_vin=$id_vin;', {$id_vin: id_vin.id});
          for (const m of metsInput){
            const id_m = database.getFirstSync<{id: number}>('SELECT id_mets as id FROM mets WHERE nom_m=$nom_m;', {$nom_m: m}) ?? {id: -1};
            if (id_m.id != -1){
              database.runSync('INSERT INTO marie (id_vin, id_mets) VALUES ($id_vin, $id_mets);', {$id_vin: id_vin.id, $id_mets: id_m.id});
            }else {
              console.log("Erreur lors de l'ajout du mets : id_mets non trouvé");
            }
          }
        }
      }catch (error) {
        console.error('Erreur lors de la mise à jour de la bouteille :', error);
      }
    }else {
      try {
        const id_vin = database.getFirstSync<{id: number}>('SELECT id_vin as id FROM vin WHERE id_domaine=$id_d AND id_appellation=$id_a AND id_region=$id_r AND id_couleur=$id_co AND id_cepage=$id_ce AND id_type=$id_t;', {$id_d: id_d.id, $id_a: id_a.id, $id_r: id_r.id, $id_co: id_co.id, $id_ce: id_ce.id, $id_t: id_t.id}) ?? {id: -1};
        if (id_vin.id === -1){
          console.log("INSERT VIN : ", id_d.id, id_a.id, id_r.id, id_co.id, id_ce.id, id_t.id);
          database.runSync('INSERT INTO vin (id_domaine, id_appellation, id_region, id_couleur, id_cepage, id_type) VALUES ($id_d, $id_a, $id_r, $id_co, $id_ce, $id_t);', {$id_d: id_d.id, $id_a: id_a.id, $id_r: id_r.id, $id_co: id_co.id, $id_ce: id_ce.id, $id_t: id_t.id});
          const id_vin = database.getFirstSync<{id: number}>('SELECT id_vin as id FROM vin WHERE id_domaine=$id_d AND id_appellation=$id_a AND id_region=$id_r AND id_couleur=$id_co AND id_cepage=$id_ce AND id_type=$id_t;', {$id_d: id_d.id, $id_a: id_a.id, $id_r: id_r.id, $id_co: id_co.id, $id_ce: id_ce.id, $id_t: id_t.id}) ?? {id: -1};
          if (id_vin.id != -1){
            console.log("INSERT BOUTEILLE : ", id_vin.id);
            database.runSync('INSERT INTO bouteille (id_vin, millesime, quantite, note, flacon, id_fournisseur) VALUES ($id_vin, $millesime, $quantite, $note, $flacon, $id_fournisseur);', {$id_vin: id_vin.id, $millesime: millesimeInput, $quantite: quantiteInput, $note: noteInput, $flacon: flaconInput, $id_fournisseur: id_f});
            //INSERTION DES RELATIONS AVEC LES METS
            database.runSync('DELETE FROM marie WHERE id_vin=$id_vin;', {$id_vin: id_vin.id});
            for (const m of metsInput){
              const id_m = database.getFirstSync<{id: number}>('SELECT id_mets as id FROM mets WHERE nom_m=$nom_m;', {$nom_m: m}) ?? {id: -1};
              if (id_m.id != -1){
                database.runSync('INSERT INTO marie (id_vin, id_mets) VALUES ($id_vin, $id_mets);', {$id_vin: id_vin.id, $id_mets: id_m.id});
              }else {
                console.log("Erreur lors de l'ajout du mets : id_mets non trouvé");
              }
            }
          }else {
            console.log("Erreur lors de l'ajout de la bouteille : id_vin non trouvé");
          }
        }else {
          console.log("INSERT BOUTEILLE : ", id_vin.id);
          database.runSync('INSERT INTO bouteille (id_vin, millesime, quantite, note, flacon, id_fournisseur) VALUES ($id_vin, $millesime, $quantite, $note, $flacon, $id_fournisseur);', {$id_vin: id_vin.id, $millesime: millesimeInput, $quantite: quantiteInput, $note: noteInput, $flacon: flaconInput, $id_fournisseur: id_f});
          database.runSync('DELETE FROM marie WHERE id_vin=$id_vin;', {$id_vin: id_vin.id});
          for (const m of metsInput){
            const id_m = database.getFirstSync<{id: number}>('SELECT id_mets as id FROM mets WHERE nom_m=$nom_m;', {$nom_m: m}) ?? {id: -1};
            if (id_m.id != -1){
              database.runSync('INSERT INTO marie (id_vin, id_mets) VALUES ($id_vin, $id_mets);', {$id_vin: id_vin.id, $id_mets: id_m.id});
            }else {
              console.log("Erreur lors de l'ajout du mets : id_mets non trouvé");
            }
          }
        }
      }catch (error) {
        console.error('Erreur lors de l\'ajout de la bouteille :', error);
      }
    }
    
    try {
      console.log("Wine :", domaineInput, appellationInput, regionInput, millesimeInput, quantiteInput, couleurInput, cepageInput, typeInput, noteInput, flaconInput);
      console.log("Mets :", metsInput);
      if(id){
        router.back();
        router.back();
      }else{
        router.back();
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
    
  };
  
  const handleUpdate = async () => {
    try {
      router.back();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  type WineZ = {
    domaine: number,
    appellation: number,
    region: number,
    millesime: number,
    quantite: number,
    couleur: number,
    cepage: number,
  }

  const handleFlaconPress = (flacon: number) => {
    setFlaconInput(flacon)
  }

  const getDomaineQuery = (text: string) => {
    return domaines.filter((d) => d.includes(text));
  }

  const getAppellationQuery = (text: string) => {
    return appellations.filter((d) => d.includes(text));
  }

  const getRegionQuery = (text: string) => {
    return regions.filter((d) => d.includes(text));
  }

  const getCouleurQuery = (text: string) => {
    return couleurs.filter((d) => d.includes(text));
  }

  const getCepageQuery = (text: string) => {
    return cepages.filter((d) => d.includes(text));
  }

  const getTypeQuery = (text: string) => {
    return types.filter((d) => d.includes(text));
  }

  useEffect(() => {
    setDomaineFiltered(getDomaineQuery(domaineInput));
  }, [domaineInput]);

  useEffect(() => {
    setAppellationFiltered(getAppellationQuery(appellationInput));
  }, [appellationInput]);

  useEffect(() => {
    setRegionFiltered(getRegionQuery(regionInput));
  }, [regionInput]);

  useEffect(() => {
    setCouleurFiltered(getCouleurQuery(couleurInput));
  }, [couleurInput]);

  useEffect(() => {
    setCepageFiltered(getCepageQuery(cepageInput));
  }, [cepageInput]);

  useEffect(() => {
    setTypeFiltered(getTypeQuery(typeInput));
  }, [typeInput]);

  if (!((editMode ? dataLoaded : true) && domaineLoaded && appellationLoaded && regionLoaded && couleurLoaded && cepageLoaded && typeLoaded && flaconLoaded && metsLoaded)) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }
    return (
        <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Item Modal" }} />

        <KeyboardAwareScrollView
          style={{
            marginVertical: 20,
            width: "100%",
            padding: 20,
          }}
          contentContainerStyle={{
            gap: 10,
            alignItems: 'center',
          }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled = {true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          extraScrollHeight={100}
          enableResetScrollToCoords	={false}
        >

          <View style={{flexDirection: 'row',justifyContent: 'space-between',position: 'relative', maxWidth: '100%', width: '100%',}}>
          
            <View style={{flexDirection: 'column', margin: 10, width: '15%'}}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Image source={require('@/assets/images/star-orange.png')} style={styles.topImage} resizeMode="contain"/>
                <Text style={{fontSize: 23, fontFamily: fonts.sfbold}}>{noteInput}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={require('@/assets/images/bouteille2.png')} style={styles.topImage} resizeMode="contain"/>
                <Text style={{fontSize: 23, fontFamily: fonts.sfbold}}>{quantiteInput}</Text>
              </View>
            </View>
              <Image source={couleurInput == 'Blanc' ? require('@/assets/images/bouteille-blanc.png') : couleurInput == 'Rose' ? require('../assets/images/bouteille-rose.png') : require('../assets/images/bouteille-rouge.png')}
              style={styles.image} resizeMode="contain"/>
            <View style={{margin: 10, width: '15%', alignItems: 'flex-end', flexDirection: 'column',}} >
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="close" size={35}/>
              </TouchableOpacity>
            </View>
    
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearContainer}>
            {flacons
            .map((el, index) =>
              <TouchableOpacity key={index} 
            style={[styles.cardYear, { backgroundColor: (flaconInput===el ? colors.theme_orange : colors.tertiary_blue)}]}
            onPress={() => handleFlaconPress(el)}
            >
                        <Text style={styles.yearText}>{el}cl</Text>
                    </TouchableOpacity>
                    )}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScrollMets}>
            {mets
            .map((el, index) =>
              <TouchableOpacity key={index}
            style={[styles.cardMets, { backgroundColor: (metsInput.includes(el) ? colors.theme_orange : colors.tertiary_blue)}]}
            onPress={() => {
              if (metsInput.includes(el)) {
                setMetsInput(metsInput.filter((e) => e !== el))
              } else {
                setMetsInput([...metsInput, el])
              }
            }
            }
            >
                <Image source={metsImage.find(mets => mets.mets === el)?.image} style={styles.imageCard} resizeMode="contain"/>
                <Text style={styles.cardMetsText}>{el}</Text>
            </TouchableOpacity>
            )}  

          </ScrollView>

          {/*------------DOMAINE--------------------------*/}
          <Text style={styles.title}>Domaine</Text>
          <TextInput
            placeholder="Domaine"
            value={domaineInput}
            onChangeText={(text) => {setDomaineInput(text)}}
            style={styles.textInput}
            autoComplete="off"
            autoCorrect={false}
            onFocus={() => {
              setDomaineInputSelected(true)
            }}
            onBlur={() => {
              setDomaineInputSelected(false)
            }}
            />

          <View style={{width: '100%', 
            height: domaineInputSelected ? 150 : 0,
            //height: 100,
            }}>

            {
          <ScrollView
            key={domaineFiltered.join(',')}
            nestedScrollEnabled={true}
            style={{width: '100%', height: 150,}}
            contentContainerStyle={{alignItems: 'center', justifyContent: 'center', gap: 5,}}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={true}
            indicatorStyle="black"
            keyboardShouldPersistTaps="handled"
            >
            {domaineFiltered.map((d, index) => (
              <TouchableOpacity 
              style={{
                height: 30, 
                width: '100%' , 
                //backgroundColor: colors.tertiary_blue, 
                justifyContent: 'center',
              }} 
              onPress={() => {
                console.log("Pressed : ", d);
                setDomaineInput(d);
              }}
              key={index}
              >
                <Text style={{fontFamily: fonts.sfmedium, paddingLeft: 5}}>{d}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          }
          </View>

          {/*------------APPELLATION--------------------------*/}
          <Text style={styles.title}>Appellation</Text>
          <TextInput
            placeholder="Appellation"
            value={appellationInput}
            onChangeText={(text) => {setAppellationInput(text)}}
            style={styles.textInput}
            autoComplete="off"
            autoCorrect={false}
            onFocus={() => {
              setAppellationInputSelected(true)
            }}
            onBlur={() => {
              setAppellationInputSelected(false)
            }}
            />

          <View style={{width: '100%', 
            height: appellationInputSelected ? 150 : 0,
            //height: 100,
            }}>

            {
          <ScrollView
            key={appellationFiltered.join(',')}
            nestedScrollEnabled={true}
            style={{width: '100%', height: 150,}}
            contentContainerStyle={{alignItems: 'center', justifyContent: 'center', gap: 5,}}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={true}
            indicatorStyle="black"
            keyboardShouldPersistTaps="handled"
            >
            {appellationFiltered.map((v, index) => (
              <TouchableOpacity 
              style={{
                height: 30, 
                width: '100%' , 
                //backgroundColor: colors.tertiary_blue, 
                justifyContent: 'center',
              }} 
              onPress={() => {
                console.log("Pressed : ", v);
                setAppellationInput(v);
              }}
              key={index}
              >
                <Text style={{fontFamily: fonts.sfmedium, paddingLeft: 5}}>{v}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          }
          </View>

          {/*------------REGION--------------------------*/}
          <Text style={styles.title}>Région</Text>
          <TextInput
            placeholder="Region"
            value={regionInput}
            onChangeText={(text) => {setRegionInput(text)}}
            style={styles.textInput}
            autoComplete="off"
            autoCorrect={false}
            onFocus={() => {
              setRegionInputSelected(true)
            }}
            onBlur={() => {
              setRegionInputSelected(false)
            }}
            />

          <View style={{width: '100%', 
            height: regionInputSelected ? 150 : 0,
            //height: 100,
            }}>

            {
          <ScrollView
            key={regionFiltered.join(',')}
            nestedScrollEnabled={true}
            style={{width: '100%', height: 150,}}
            contentContainerStyle={{alignItems: 'center', justifyContent: 'center', gap: 5,}}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={true}
            indicatorStyle="black"
            keyboardShouldPersistTaps="handled"
            >
            {regionFiltered.map((v, index) => (
              <TouchableOpacity 
              style={{
                height: 30, 
                width: '100%' , 
                //backgroundColor: colors.tertiary_blue, 
                justifyContent: 'center',
              }} 
              onPress={() => {
                console.log("Pressed : ", v);
                setRegionInput(v);
              }}
              key={index}
              >
                <Text style={{fontFamily: fonts.sfmedium, paddingLeft: 5}}>{v}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          }
          </View>

          {/*------------MILLESIME--------------------------*/}

          <Text style={styles.title}>Millésime</Text>
          <TextInput
            placeholder="Millésime"
            value={millesimeInput}
            keyboardType="number-pad"
            onChangeText={(text) => setMillesimeInput(text)}
            style={styles.textInput}
          />

          {/*------------COULEUR--------------------------*/}
          <Text style={styles.title}>Couleur</Text>
          <TextInput
            placeholder="Couleur"
            value={couleurInput}
            onChangeText={(text) => {setCouleurInput(text)}}
            style={styles.textInput}
            autoComplete="off"
            autoCorrect={false}
            onFocus={() => {
              setCouleurInputSelected(true)
            }}
            onBlur={() => {
              setCouleurInputSelected(false)
            }}
            />

          <View style={{width: '100%', 
            height: couleurInputSelected ? 150 : 0,
            //height: 100,
            }}>

            {
          <ScrollView
            key={couleurFiltered.join(',')}
            nestedScrollEnabled={true}
            style={{width: '100%', height: 150,}}
            contentContainerStyle={{alignItems: 'center', justifyContent: 'center', gap: 5,}}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={true}
            indicatorStyle="black"
            keyboardShouldPersistTaps="handled"
            >
            {couleurFiltered.map((v, index) => (
              <TouchableOpacity 
              style={{
                height: 30, 
                width: '100%' , 
                //backgroundColor: colors.tertiary_blue, 
                justifyContent: 'center',
              }} 
              onPress={() => {
                console.log("Pressed : ", v);
                setCouleurInput(v);
              }}
              key={index}
              >
                <Text style={{fontFamily: fonts.sfmedium, paddingLeft: 5}}>{v}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          }
          </View>

          {/*------------CEPAGE--------------------------*/}
          <Text style={styles.title}>Cépage</Text>
          <TextInput
            placeholder="Cepage"
            value={cepageInput}
            onChangeText={(text) => {setCepageInput(text)}}
            style={styles.textInput}
            autoComplete="off"
            autoCorrect={false}
            onFocus={() => {
              setCepageInputSelected(true)
            }}
            onBlur={() => {
              setCepageInputSelected(false)
            }}
            />

          <View style={{width: '100%', 
            height: cepageInputSelected ? 150 : 0,
            //height: 100,
            }}>

            {
          <ScrollView
            key={cepageFiltered.join(',')}
            nestedScrollEnabled={true}
            style={{width: '100%', height: 150,}}
            contentContainerStyle={{alignItems: 'center', justifyContent: 'center', gap: 5,}}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={true}
            indicatorStyle="black"
            keyboardShouldPersistTaps="handled"
            >
            {cepageFiltered.map((v, index) => (
              <TouchableOpacity 
              style={{
                height: 30, 
                width: '100%' , 
                //backgroundColor: colors.tertiary_blue, 
                justifyContent: 'center',
              }} 
              onPress={() => {
                console.log("Pressed : ", v);
                setCepageInput(v);
              }}
              key={index}
              >
                <Text style={{fontFamily: fonts.sfmedium, paddingLeft: 5}}>{v}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          }
          </View>

          {/*------------QUANTITE--------------------------*/}

          <Text style={styles.title}>Quantite</Text>
          <TextInput
            placeholder="Quantite"
            value={quantiteInput}
            keyboardType="number-pad"
            onChangeText={(text) => setQuantiteInput(text)}
            style={styles.textInput}
          />

          {/*------------NOTE--------------------------*/}

          <Text style={styles.title}>Note</Text>
          <TextInput
            placeholder="Note"
            value={noteInput}
            keyboardType="number-pad"
            onChangeText={(text) => setNoteInput(text)}
            style={styles.textInput}
          />

          {/*------------TYPE--------------------------*/}

          <Text style={styles.title}>Type</Text>
          <TextInput
            placeholder="Type"
            value={typeInput}
            onChangeText={(text) => {setTypeInput(text)}}
            style={styles.textInput}
            autoComplete="off"
            autoCorrect={false}
            onFocus={() => {
              setTypeInputSelected(true)
            }}
            onBlur={() => {
              setTypeInputSelected(false)
            }}
            />

          <View style={{width: '100%', 
            height: typeInputSelected ? 150 : 0,
            //height: 100,
          }}>

            {
              <ScrollView
              key={typeFiltered.join(',')}
              nestedScrollEnabled={true}
              style={{width: '100%', height: 150,}}
              contentContainerStyle={{alignItems: 'center', justifyContent: 'center', gap: 5,}}
              removeClippedSubviews={false}
              showsVerticalScrollIndicator={true}
              indicatorStyle="black"
              keyboardShouldPersistTaps="handled"
              >
            {typeFiltered.map((v, index) => (
              <TouchableOpacity 
              style={{
                height: 30, 
                width: '100%' , 
                //backgroundColor: colors.tertiary_blue, 
                justifyContent: 'center',
              }} 
              onPress={() => {
                console.log("Pressed : ", v);
                setTypeInput(v);
              }}
              key={index}
              >
                <Text style={{fontFamily: fonts.sfmedium, paddingLeft: 5}}>{v}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          }
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
            
          </ScrollView>

        <View style={{ flexDirection: "row", gap: 20, alignContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => {
              const res = database.getFirstSync('SELECT * FROM bouteille WHERE id_vin=138;')
              console.log(res)
              /*router.back()*/}}
            style={[styles.buttonCancel, { backgroundColor: colors.theme_orange }]}
            >
            <AntDesign name="close" size={30} color={"white"}/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              handleSave();
            }}
            style={[styles.button, { backgroundColor: colors.secondary_blue }]}
          >
            <Text style={styles.buttonText}>{editMode ? "Mettre à jour la bouteille" : "Mettre à jour la cave"}</Text>
          </TouchableOpacity>
        </View>
            <View style={{width: '100%', height: 150}}/>
        </KeyboardAwareScrollView>

      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    alignItems: "center",
  },
  topImage: {
    height: 35,
    width: 35,
    marginRight: 10,
  },
  image: {
    height: 270,
    maxWidth: '58%',
    //position: 'absolute',
  },
  yearContainer: {
    marginBottom: 20,
    marginTop: 7,
    flexDirection: 'row',
    maxHeight: 40,
    // width determined by content
  },
  cardYear: {
    backgroundColor: colors.tertiary_blue,
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
    marginTop: 0,
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearText: {
    fontSize: 18,
    color: colors.theme_white,
  },
  cardScrollMets: {
    // width determined by content
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 20,
},
cardMets: {
  //backgroundColor: '#fff',
  padding: 16,
  borderRadius: 12,
  marginRight: 12,
  width: 120,
  height: 120,
  alignItems: 'center',
  justifyContent: 'space-between',
},
imageCard: {
  //width: '80%',
  height: '80%',
  maxWidth: '100%',
},
cardMetsText: {
  color: colors.theme_white,
  fontFamily: fonts.sfmedium,
  fontSize: 12,
},
  title: {
      margin: 0,
      padding: 0,
      fontSize: 16,
      fontFamily: fonts.sfbold,
      color : colors.primary_blue,
      width: '100%',
      maxHeight: 20,
  },
  text: {
    padding: 0,
    fontSize: 30,
    fontFamily: fonts.sfbold,
    marginBottom: 15,
    marginTop: 3,
  },
  textInput: {
    borderWidth: 0.5,
    padding: 10,
    width: "100%",
    borderRadius: 5,
    borderColor: "slategray",
    maxHeight: 40,
    
  },
  cardScroll: {
    // width determined by content
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 20,
  },
  button: {
    height: 60,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonCancel: {
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
});