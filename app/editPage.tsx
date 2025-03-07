import { colors } from "@/constants/colors";
import { fonts } from '@/constants/fonts';
import { router, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [domaines, setDomaines] = useState<string[]>([]);
  const [appellations, setAppellations] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [couleurs, setCouleurs] = useState<string[]>([]);
  const [cepages, setCepages] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

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
  const [domaineInput, setDomaineInput] = useState('');
  const [appellationInput, setAppellationInput] = useState('');
  const [regionInput, setRegionInput] = useState('');
  const [couleurInput, setCouleurInput] = useState('');
  const [cepageInput, setCepageInput] = useState('');
  const [typeInput, setTypeInput] = useState('');

  const [domaineLoaded, setDomaineLoaded] = useState(false);
  const [appellationLoaded, setAppellationLoaded] = useState(false);
  const [regionLoaded, setRegionLoaded] = useState(false);
  const [couleurLoaded, setCouleurLoaded] = useState(false);
  const [cepageLoaded, setCepageLoaded] = useState(false);
  const [typeLoaded, setTypeLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

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
    }, [])
  );

  const loadData = async () => {
    const result = await database.getFirstAsync<WineDetails>(`SELECT bouteille.id_bouteille as id, domaine.nom_d as domaine, appellation.nom_a as appellation, region.nom_r as region , bouteille.millesime as millesime, bouteille.quantite as quantite, couleur.nom_co as couleur, cepage.nom_ce as cepage,  bouteille.note as note, type.nom_t as type FROM vin, bouteille, domaine, appellation, region, couleur, cepage, type WHERE bouteille.id_bouteille = ? AND bouteille.id_vin=vin.id_vin AND vin.id_appellation=appellation.id_appellation AND vin.id_cepage=cepage.id_cepage AND vin.id_couleur=couleur.id_couleur AND vin.id_domaine=domaine.id_domaine AND vin.id_region=region.id_region AND vin.id_type=type.id_type;`, [id]);
    setWine(result);
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
      //console.log(d.nom);
    }
    setAppellationLoaded(true);
  }

    //Fonction permettant de récupérer les régions déjà existants
  const loadRegions = async () => {
    const ite = database.getEachAsync<{nom: string}>(`SELECT nom_r as nom FROM region`);
    for await (const v of ite)  {
      setRegions((prev) => [...prev, v.nom]);
      //console.log(d.nom);
    }
    setRegionLoaded(true);
  }
  
  //Fonction permettant de récupérer les couleurs déjà existants
  const loadCouleurs = async () => {
    const ite = database.getEachAsync<{nom: string}>(`SELECT nom_co as nom FROM couleur`);
    for await (const v of ite)  {
      setCouleurs((prev) => [...prev, v.nom]);
      //console.log(d.nom);
    }
    setCouleurLoaded(true);
  }
  
  //Fonction permettant de récupérer les cepages déjà existants
  const loadCepages = async () => {
    const ite = database.getEachAsync<{nom: string}>(`SELECT nom_ce as nom FROM cepage`);
    for await (const v of ite)  {
      setCepages((prev) => [...prev, v.nom]);
      //console.log(d.nom);
    }
    setCepageLoaded(true);
  }
  
  //Fonction permettant de récupérer les types déjà existants
  const loadTypes = async () => {
    const ite = database.getEachAsync<{nom: string}>(`SELECT nom_t as nom FROM type`);
    for await (const v of ite)  {
      setTypes((prev) => [...prev, v.nom]);
      //console.log(d.nom);
    }
    setTypeLoaded(true);
  }
  
  const handleSave = async () => {
    try {
      const response = await database.runAsync(
        `INSERT INTO users (name, email, image) VALUES (?, ?, ?)`,
        [name, email, ""]
      );
      console.log("Item saved successfully:", response?.changes!);
      router.back();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await database.runAsync(
        `UPDATE users SET name = ?, email = ? WHERE id = ?`,
        [name, email, parseInt(id as string)]
      );
      console.log("Item updated successfully:", response?.changes!);
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


  const domainesList = useMemo(() => (
    <ScrollView
      nestedScrollEnabled={true}
      style={{width: '100%', height: domaineInputSelected ? 300 : 0,}}
      contentContainerStyle={{alignItems: 'center', justifyContent: 'center', gap: 5,}}
    >
      {domaines.map((d, index) => (
        <TouchableOpacity 
          style={{ height: 30, width: '100%' , backgroundColor: colors.tertiary_blue}} 
          onPress={() => {
            console.log("Pressed : ", d);
            setDomaineInput(d);
          }}
          key={index}
        >
          <Text>{d}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  ), [domaines]);

  const getDomaineQuery = (text: string) => {
    return domaines.filter((d) => d.includes(text));
  }

  useEffect(() => {
    setDomaineFiltered(getDomaineQuery(domaineInput));
  }, [domaineInput]);

  if (!((editMode ? dataLoaded : true) && domaineLoaded && appellationLoaded && regionLoaded && couleurLoaded && cepageLoaded && typeLoaded)) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
    return (
      <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Item Modal" }} />

      <ScrollView
        style={{
          marginVertical: 20,
          width: "100%",
          padding: 20,
        }}
        contentContainerStyle={{
          gap: 10,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled = {true}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >

        <Text style={styles.title}>Domaine</Text>
        <TextInput
          placeholder="Domaine"
          value={wine?.domaine ?? domaineInput}
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

        <Text style={styles.title}>Appellation</Text>
        <TextInput
          placeholder="Appellation"
          value={wine?.appellation}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
        <Text style={styles.title}>Region</Text>
        <TextInput
          placeholder="Region"
          value={wine?.region}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
        <Text style={styles.title}>Millésime</Text>
        <TextInput
          placeholder="Millésime"
          value={wine?.millesime.toString()}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
        <Text style={styles.title}>Couleur</Text>
        <TextInput
          placeholder="Couleur"
          value={wine?.couleur}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
        <Text style={styles.title}>Cepage</Text>
        <TextInput
          placeholder="Cepage"
          value={wine?.cepage}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
        <Text style={styles.title}>Quantite</Text>
        <TextInput
          placeholder="Cepage"
          value={wine?.quantite.toString()}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
        <Text style={styles.title}>Note</Text>
        <TextInput
          placeholder="Cepage"
          value={wine?.note.toString()}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
        <Text style={styles.title}>Type</Text>
        <TextInput
          placeholder="Cepage"
          value={wine?.type}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
      <View style={{ flexDirection: "row", gap: 20 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.button, { backgroundColor: "red" }]}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            editMode ? handleUpdate() : handleSave();
          }}
          style={[styles.button, { backgroundColor: "blue" }]}
        >
          <Text style={styles.buttonText}>{editMode ? "Update" : "Save"}</Text>
        </TouchableOpacity>
      </View>
          <View style={{width: '100%', height: 200}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    alignItems: "center",
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
    color : colors.primary_blue,
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
  button: {
    height: 40,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
});