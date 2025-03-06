import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, } from "react-native";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { useState, useEffect} from "react";
import { useSQLiteContext } from "expo-sqlite";

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

  const loadData = async () => {
    const result = await database.getFirstAsync<WineDetails>(`SELECT bouteille.id_bouteille as id, domaine.nom_d as domaine, appellation.nom_a as appellation, region.nom_r as region , bouteille.millesime as millesime, bouteille.quantite as quantite, couleur.nom_co as couleur, cepage.nom_ce as cepage,  bouteille.note as note, type.nom_t as type FROM vin, bouteille, domaine, appellation, region, couleur, cepage, type WHERE bouteille.id_bouteille = ? AND bouteille.id_vin=vin.id_vin AND vin.id_appellation=appellation.id_appellation AND vin.id_cepage=cepage.id_cepage AND vin.id_couleur=couleur.id_couleur AND vin.id_domaine=domaine.id_domaine AND vin.id_region=region.id_region AND vin.id_type=type.id_type;`, [id]);
    setWine(result);
    /*setName(result?.name!);
    setEmail(result?.email!);*/
  };

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

    return (
      <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Item Modal" }} />
      <View
        style={{
          gap: 20,
          marginVertical: 20,
        }}
      >
        <Text>Domaine</Text>
        <TextInput
          placeholder="Domaine"
          value={wine?.domaine}
          onChangeText={(text) => setName(text)}
          style={styles.textInput}
        />
        <Text>Appellation</Text>
        <TextInput
          placeholder="Appellation"
          value={wine?.appellation}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
        <Text>Region</Text>
        <TextInput
          placeholder="Region"
          value={wine?.region}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
        <Text>Millésime</Text>
        <TextInput
          placeholder="Millésime"
          value={wine?.millesime.toString()}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
        <Text>Couleur</Text>
        <TextInput
          placeholder="Couleur"
          value={wine?.couleur}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
        <Text>Cepage</Text>
        <TextInput
          placeholder="Cepage"
          value={wine?.cepage}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
      </View>
      <View style={{ flex: 1, flexDirection: "row", gap: 20 }}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    width: 300,
    borderRadius: 5,
    borderColor: "slategray",
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