import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert} from "react-native";
import { router, useLocalSearchParams, Link, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback, } from "react";
import { useSQLiteContext } from "expo-sqlite";
import {Picker} from '@react-native-picker/picker';
import { colors } from "@/constants/colors";
import {fonts} from '@/constants/fonts';
import WineSection from "@/components/WineSection";
import { AntDesign } from '@expo/vector-icons';



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

type Millesime = {
  millesime: number,
}

//TODO : 

export default function wineDetails() {
  const database = useSQLiteContext();
  
  const {id} = useLocalSearchParams<{id: string}>();
  const id_vin = parseInt(id);
  
  const [data, setData] = useState<WineDetails[]>([])
  const [millesime, setMillesime] = useState<number[]>([])
  const [flacon, setFlacon] = useState<number[]>([])
  
  const [selectedMillesime, setSelectedMillesime] = useState<number>(millesime[0]);
  const [selectedFlacon, setSelectedFlacon] = useState<number>(flacon[0]);
  const [selectedWine, setSelectedWine] = useState<WineDetails | undefined>(data[0]);

  const [qte, setQte] = useState<number>(0);

  const[take, setTake] = useState<boolean>(true);
    
    const loadWine = async () => {
      const res = await database.getAllAsync<WineDetails>('SELECT bouteille.id_bouteille as id, domaine.nom_d as domaine, appellation.nom_a as appellation, region.nom_r as region , bouteille.millesime as millesime, bouteille.quantite as quantite, couleur.nom_co as couleur, cepage.nom_ce as cepage,  bouteille.note as note, type.nom_t as type FROM vin, bouteille, domaine, appellation, region, couleur, cepage, type WHERE bouteille.id_vin = $idValue AND bouteille.id_vin=vin.id_vin AND vin.id_appellation=appellation.id_appellation AND vin.id_cepage=cepage.id_cepage AND vin.id_couleur=couleur.id_couleur AND vin.id_domaine=domaine.id_domaine AND vin.id_region=region.id_region AND vin.id_type=type.id_type;', {$idValue: id});
      setData(res);
      //console.log("data = ",res);
    }

    const loadMillesime = async () => {
      //const res = await database.getAllAsync<Millesime>('SELECT DISTINCT(bouteille.millesime) as millesime FROM bouteille WHERE bouteille.id_vin = $idValue ORDER BY millesime ASC;', {$idValue: id});
      //setMillesime(res);
      try {
        setMillesime([]);
        const results = database.getEachAsync<Millesime>('SELECT DISTINCT(bouteille.millesime) as millesime FROM bouteille WHERE bouteille.id_vin = $idValue ORDER BY millesime ASC;', {$idValue: id});
        for await (const row of results) {
          setMillesime(prev => [...prev, row.millesime]);
          setSelectedMillesime(millesime[0]);
        }
      }catch (error) {
          console.error('Erreur lors du chargement des millésimes :', error);
      }
        //console.log("millesime = ",millesime[0]);
      
    }
    
    const loadFlacon = async () => {
      const res = await database.getAllAsync<number>('SELECT DISTINCT(bouteille.flacon) as flacon FROM bouteille WHERE bouteille.id_vin = $idValue ORDER BY flacon ASC;', {$idValue: id});
      setFlacon(res);
    }

    useEffect(() => {
      if (millesime.length > 0) {
        setSelectedMillesime(millesime[0]);
        setSelectedWine(data.find(wine => wine.millesime === millesime[0]));
      }
    }, [millesime]);
    
    useFocusEffect(
      useCallback(() => {
        loadWine();
        loadMillesime();
        loadFlacon();
      }, [])
    );

    const handleMillesimePress = (millesime: number) => {
      setSelectedMillesime(millesime);
      setSelectedWine(data.find(wine => wine.millesime === millesime));
    }

    const regionImages = 
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
    const image = regionImages.find(region => region.region === selectedWine?.region)?.image;

    const handlePlus = () => {
      const value = selectedWine?.quantite ?? 0;
      qte < value ? setQte(qte + 1) : null;
    }

    const handleMoins = () => {
      qte > 0 ? setQte(qte - 1) : null;
    } 

    const handleUpdate = async () => {
      const value = selectedWine?.quantite ?? 0;
      try {
        const test = await database.runAsync('UPDATE bouteille SET quantite = $quantite WHERE id_bouteille = $idValue;', {$quantite: qte, $idValue: value});
        console.log("test = ",test);
      } catch (error) {
        console.log("Erreur de mise à jour des bouteilles : ", error);
        Alert.alert(
          'Erreur de mise à jour', // Titre de l'alerte
          'Problème de mise à jour des bouteilles', // Message de l'alerte
        );
      }
      router.back();
    }

    const handleTake = async () => {
      const value = selectedWine?.quantite ?? 0;
      const id_b = selectedWine?.id ?? 0;

      try {
        const response = await database.runAsync(
          `UPDATE bouteille SET quantite = ? WHERE id_bouteille = ?;`,
          [(value-qte), id_b]
        );
        console.log("Item updated successfully:", response?.changes!, "id : ", id_b, "qte : ", value);
        router.back();
      } catch (error) {
        console.error("Error updating item:", error);
        Alert.alert(
          'Erreur de mise à jour', // Titre de l'alerte
          'Problème de mise à jour des bouteilles', // Message de l'alerte
        );
      }
    };

    const handleAdd = async () => {
      const value = selectedWine?.quantite ?? 0;
      const id_b = selectedWine?.id ?? 0;

      try {
        const response = await database.runAsync(
          `UPDATE bouteille SET quantite = ? WHERE id_bouteille = ?;`,
          [(value+qte), id_b]
        );
        console.log("Item updated successfully:", response?.changes!, "id : ", id_b, "qte : ", value, "user : ", qte);
        router.back();
      } catch (error) {
        console.error("Error updating item:", error);
        Alert.alert(
          'Erreur de mise à jour', // Titre de l'alerte
          'Problème de mise à jour des bouteilles', // Message de l'alerte
        );
      }
    };


    
    //console.log("selectedMillesime = ",selectedMillesime);
    
    //console.log("selectedMillesime = ",millesime);
    //console.log("selectedMillesime = ",selectedMillesime);

    return (
    <SafeAreaView style={styles.safearea}>

    <ScrollView
      contentContainerStyle={{
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: 10,
        //width: '100%',
      }}
      showsVerticalScrollIndicator={false}
      >
      <View style={{flexDirection: 'row',justifyContent: 'space-between',position: 'relative', maxWidth: '100%', width: '100%', marginBottom: 18}}>

        <View style={{flexDirection: 'column', margin: 10, width: '15%'}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <Image source={require('@/assets/images/star-orange.png')} style={styles.topImage} resizeMode="contain"/>
            <Text style={{fontSize: 23, fontFamily: fonts.sfbold}}>{selectedWine?.note}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={require('@/assets/images/bouteille2.png')} style={styles.topImage} resizeMode="contain"/>
            <Text style={{fontSize: 23, fontFamily: fonts.sfbold}}>{selectedWine?.quantite}</Text>
          </View>
        </View>
          <Image source={selectedWine?.couleur == 'Rouge' ? require('@/assets/images/bouteille-rouge.png') : selectedWine?.couleur == 'Rose' ? require('../assets/images/bouteille-rose.png') : require('../assets/images/bouteille-blanc.png')}
          style={styles.image} resizeMode="contain"/>
        <View style={{margin: 10, width: '15%', alignItems: 'flex-end', flexDirection: 'column',}} >
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="close" size={35}/>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: 20}} onPress={() => router.push(`./editPage?id=${selectedWine?.id}`)}>
            <AntDesign name="edit" size={35}/>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: 20}} onPress={() => setTake(!take)}>
            <AntDesign name={take ? "pluscircleo" : "checkcircle"} size={35}/>
          </TouchableOpacity>
        </View>

      </View>
      <View style={styles.infoView}>
        


        {/*<Picker
                selectedValue={selectedMillesime?.toString()}
                onValueChange={(itemValue) => setSelectedMillesime(Number(itemValue))}
                style={{ height: 50, width: 300 }}
                >
                <Picker.Item label="Sélectionnez une option" value="" />
                {millesime.map((option, index) => (
                    <Picker.Item key={index} label={option.toString()} value={option.toString()} />
                    ))}
                    </Picker>*/}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {image ? <Image source={image} style={styles.imageRegion} resizeMode="contain"/> : null}
            <Text style={styles.cardText}>{selectedWine?.region}</Text>
          </View>
          <View style={styles.card}>
            <Image source={require('@/assets/images/cepages/Assemblage.png')} style={styles.imageRegion} resizeMode="contain"/>
            <Text style={styles.cardText}>{selectedWine?.cepage}</Text>
          </View>
        </View>
        <Text style={styles.title}>Année</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearContainer}>
                {millesime
                .map((el, index) =>
                  <TouchableOpacity key={index} 
                style={[styles.cardYear, { backgroundColor: (selectedMillesime==el ? colors.theme_orange : colors.tertiary_blue)}]}
                onPress={() => handleMillesimePress(el)}
                >
                            <Text style={styles.yearText}>{el}</Text>
                        </TouchableOpacity>
                        )}
          </ScrollView>
              {/*<TouchableOpacity
                onPress={() => router.back()}
                style={[styles.button, { backgroundColor: "red" }]}
                >
                <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={async () => {
                  router.push(`./editPage?id=${selectedWine?.id}`);
                  //router.push(`./editPage`);
                  }}
                  style={[styles.button, { backgroundColor: "blue" }]}
                  >
                  <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>*/}
          <Text style={styles.title}>Domaine</Text>
          <Text style={styles.text}>{selectedWine?.domaine}</Text>
          <Text style={styles.title}>Appellation</Text>
          <Text style={styles.text}>{selectedWine?.appellation}</Text>
          <Text style={styles.title}>Couleur</Text>
          <Text style={styles.text}>{selectedWine?.couleur}</Text>
          <Text style={styles.title}>Type</Text>
          <Text style={styles.text}>{selectedWine?.type}</Text>
          <View style={{height: 150}}></View>
        </View>
    </ScrollView>
    
    <View style={styles.takeView}>
      <View style={styles.chooseView}>
        <TouchableOpacity style={styles.plusmoinsButton} onPress={handleMoins}>
          <AntDesign name="minus" size={25}/>
        </TouchableOpacity>
        <Text style={styles.takeText}>{qte}</Text>
        <TouchableOpacity style={styles.plusmoinsButton} onPress={handlePlus}>
        <AntDesign name="plus" size={25}/>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.takeButton, {backgroundColor: take ? colors.primary_blue : colors.theme_orange}]} onPress={take ? handleTake : handleAdd}>
        <Text style={{color: colors.theme_white, fontSize: 15, fontFamily: fonts.sfmedium}}
        onPress={handleTake}>{take ? "Prendre de la cave" : "Ajouter à la cave"}</Text>
      </TouchableOpacity>
    </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    //flex: 1,
    alignItems: "center",
    backgroundColor: colors.theme_background,
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
  yearContainer: {
    marginBottom: 20,
    marginTop: 7,
    flexDirection: 'row',
    maxHeight: 40,
    // width determined by content
  },
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  card: {
      backgroundColor: colors.tertiary_blue,
      padding: 16,
      borderRadius: 12,
      marginRight: 12,
      width: 100,
      height: 100,
      alignItems: 'center',
  },
  imageRegion: {
    //width: '80%',
    height: '80%',
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
  cardText: {
    //fontSize: 18,
    color: colors.theme_white,
    fontFamily: fonts.sfmedium,
    fontSize: 12,
    //marginBottom: 5,
  },
  yearText: {
    fontSize: 18,
    color: colors.theme_white,
  },
  infoView: {
    //flex: 1, 
    //flexDirection: "column",
    //flexWrap:'wrap', 
    //gap: 20, 
    alignItems: 'flex-start', 
    justifyContent: 'flex-start',
    margin: 0,
    width: '100%',
  },
  title: {
    margin: 0,
    padding: 0,
    fontSize: 16,
    fontFamily: fonts.sfregular,
  },
  text: {
    padding: 0,
    fontSize: 30,
    fontFamily: fonts.sfbold,
    color : colors.primary_blue,
    marginBottom: 15,
    marginTop: 3,
  },
  takeView: {
    borderTopColor: colors.theme_gray,
    borderTopWidth: 2,
    backgroundColor: colors.theme_white,
    position: 'absolute',
    bottom: 0,
    height: '18%',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    //marginBottom: 10,
  },
  chooseView: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginBottom: 10,
    marginLeft: 20,
    justifyContent: 'space-between',
    width: '30%',
  },
  plusmoinsButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.secondary_blue,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  takeText: {
    width: 40,
    height: 40,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 30,
    fontFamily: fonts.sfbold,
    //color: colors.primary_blue,
    marginRight: 15,
    marginLeft: 15,
  },
  takeButton: {
    width: '40%',
    borderRadius: 18,
    //backgroundColor: colors.primary_blue,
    alignItems: 'center',
    justifyContent: 'center',
    height: '55%',
    marginRight: 20,
    marginBottom: 10,
  }
});