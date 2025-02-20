import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Définir le type Wine
type Wine = {
    domaine: string;
    appellation: string;
    region: string;
    millesime: number;
    quantite: number;
    couleur: string;
    cepage: string;
};

const App = () => {
    // Exemple de données
    const wines: Wine[] = [
        { domaine: 'Château A', appellation: 'Appellation A', region: 'Bordeaux', millesime: 2020, quantite: 50, couleur: 'Rouge', cepage: 'Merlot' },
        { domaine: 'Château B', appellation: 'Appellation B', region: 'Bourgogne', millesime: 2019, quantite: 30, couleur: 'Blanc', cepage: 'Chardonnay' },
        { domaine: 'Château C', appellation: 'Appellation C', region: 'Champagne', millesime: 2021, quantite: 20, couleur: 'Rosé', cepage: 'Pinot Noir' },
        { domaine: 'Château D', appellation: 'Appellation D', region: 'Bordeaux', millesime: 2022, quantite: 40, couleur: 'Rouge', cepage: 'Cabernet Sauvignon' },
        // Ajoutez d'autres vins ici
    ];

    // État pour les filtres sélectionnés
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedCouleurs, setSelectedCouleurs] = useState<string[]>([]);
    const [selectedCepages, setSelectedCepages] = useState<string[]>([]);

    // Fonction pour gérer la sélection des filtres
    const toggleFilter = (filterType: 'region' | 'couleur' | 'cepage', value: string) => {
        switch (filterType) {
            case 'region':
                setSelectedRegions(prev =>
                    prev.includes(value) ? prev.filter(r => r !== value) : [...prev, value]
                );
                break;
            case 'couleur':
                setSelectedCouleurs(prev =>
                    prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
                );
                break;
            case 'cepage':
                setSelectedCepages(prev =>
                    prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
                );
                break;
            default:
                break;
        }
    };

    // Fonction pour appliquer les filtres
    const filteredWines = wines.filter(wine => {
        const regionMatch = selectedRegions.length === 0 || selectedRegions.includes(wine.region);
        const couleurMatch = selectedCouleurs.length === 0 || selectedCouleurs.includes(wine.couleur);
        const cepageMatch = selectedCepages.length === 0 || selectedCepages.includes(wine.cepage);
        return regionMatch && couleurMatch && cepageMatch;
    });

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Filtres</Text>
            <View style={styles.filterButtons}>
                <TouchableOpacity
                    style={[styles.filterButton, selectedRegions.includes('Bordeaux') && styles.activeFilterButton]}
                    onPress={() => toggleFilter('region', 'Bordeaux')}
                >
                    <Text style={styles.filterButtonText}>Bordeaux</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, selectedRegions.includes('Bourgogne') && styles.activeFilterButton]}
                    onPress={() => toggleFilter('region', 'Bourgogne')}
                >
                    <Text style={styles.filterButtonText}>Bourgogne</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, selectedRegions.includes('Champagne') && styles.activeFilterButton]}
                    onPress={() => toggleFilter('region', 'Champagne')}
                >
                    <Text style={styles.filterButtonText}>Champagne</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.filterButtons}>
                <TouchableOpacity
                    style={[styles.filterButton, selectedCouleurs.includes('Rouge') && styles.activeFilterButton]}
                    onPress={() => toggleFilter('couleur', 'Rouge')}
                >
                    <Text style={styles.filterButtonText}>Rouge</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, selectedCouleurs.includes('Blanc') && styles.activeFilterButton]}
                    onPress={() => toggleFilter('couleur', 'Blanc')}
                >
                    <Text style={styles.filterButtonText}>Blanc</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, selectedCouleurs.includes('Rosé') && styles.activeFilterButton]}
                    onPress={() => toggleFilter('couleur', 'Rosé')}
                >
                    <Text style={styles.filterButtonText}>Rosé</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.filterButtons}>
                <TouchableOpacity
                    style={[styles.filterButton, selectedCepages.includes('Merlot') && styles.activeFilterButton]}
                    onPress={() => toggleFilter('cepage', 'Merlot')}
                >
                    <Text style={styles.filterButtonText}>Merlot</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, selectedCepages.includes('Chardonnay') && styles.activeFilterButton]}
                    onPress={() => toggleFilter('cepage', 'Chardonnay')}
                >
                    <Text style={styles.filterButtonText}>Chardonnay</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, selectedCepages.includes('Pinot Noir') && styles.activeFilterButton]}
                    onPress={() => toggleFilter('cepage', 'Pinot Noir')}
                >
                    <Text style={styles.filterButtonText}>Pinot Noir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, selectedCepages.includes('Cabernet Sauvignon') && styles.activeFilterButton]}
                    onPress={() => toggleFilter('cepage', 'Cabernet Sauvignon')}
                >
                    <Text style={styles.filterButtonText}>Cabernet Sauvignon</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>Vins Filtrés</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
                {filteredWines.map((wine, index) => (
                    <TouchableOpacity key={index} style={styles.card}>
                        <Text style={styles.cardText}>{wine.domaine}</Text>
                        <Text style={styles.cardText}>{wine.appellation}</Text>
                        <Text style={styles.cardText}>{wine.region}</Text>
                        <Text style={styles.cardText}>{wine.millesime}</Text>
                        <Text style={styles.cardText}>{wine.couleur}</Text>
                        <Text style={styles.cardText}>{wine.cepage}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    filterButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    filterButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    activeFilterButton: {
        backgroundColor: '#007BFF',
        borderColor: '#007BFF',
    },
    filterButtonText: {
        fontSize: 16,
    },
    cardScroll: {
        flexDirection: 'row',
    },
    card: {
        marginRight: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    cardText: {
        fontSize: 16,
    },
});

export default App;
