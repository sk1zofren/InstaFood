import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    FlatList,
    Modal,
    TouchableOpacity,
    Image
} from "react-native";

export default class RechercheScreen extends React.Component {
    state = {
        searchText: '',
        searchResults: [],
        modalVisible: false,
        selectedMeal: null
    }

    componentDidMount() {
        // Vérifie si le composant a été ouvert à partir d'une notification
        if (this.props.route.params && this.props.route.params.recipe) {
            const { recipe } = this.props.route.params;
            this.showModal(recipe);
        }
    }

    // connexion a l'API pour les recettes
    handleSearch = async () => {
        
        const query = encodeURIComponent(this.state.searchText);
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            this.setState({ searchResults: data.meals || [] });
        } catch (error) {
            console.error("Erreur lors de la recherche de recettes:", error);
        }
    }

    showModal = (meal) => {
        this.setState({ modalVisible: true, selectedMeal: meal });
    }

    hideModal = () => {
        this.setState({ modalVisible: false, selectedMeal: null });
    }

    render() {
        const { modalVisible, selectedMeal } = this.state;

        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.searchBar}
                    value={this.state.searchText}
                    onChangeText={(text) => this.setState({ searchText: text })}
                    placeholder="Recherchez une recette..."
                />
                <TouchableOpacity style={styles.button} onPress={this.handleSearch}>
                    <Text style={styles.buttonText}>Rechercher</Text>
                </TouchableOpacity>

                <FlatList
                    data={this.state.searchResults}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.listItem} onPress={() => this.showModal(item)}>
                            <Text style={styles.listText}>{item.strMeal}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.idMeal.toString()}
                />

                {modalVisible && (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={this.hideModal}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Image source={{ uri: selectedMeal.strMealThumb }} style={styles.mealImage} />
                                <Text style={styles.mealTitle}>{selectedMeal.strMeal}</Text>
                                <Text>{selectedMeal.strInstructions}</Text>
                                <Button title="Fermer" onPress={this.hideModal} color={styles.primary.color} />
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    // Style pour le bouton de recherche
    button: {
        backgroundColor: '#5C4033',
        width: 150,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignSelf: 'center'
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    // Styles généraux pour le conteneur et les éléments d'interface utilisateur
    container: {
        flex: 1,
        backgroundColor: '#D2B48C',
        paddingHorizontal: 30,
        paddingTop: 50,
    },
    searchBar: {
        width: '100%',
        padding: 12,
        borderColor: '#F5F5DC',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 30,
        backgroundColor: '#FFFFFF',
        elevation: 5,
        fontSize: 16,
    },
    listItem: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        marginVertical: 8,
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    listText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#8B4513'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalContent: {
        width: '85%',
        padding: 25,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    mealTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 20,
        color: '#8B4513',
        textAlign: 'center',
    },
    mealImage: {
        width: '100%',
        height: 220,
        borderRadius: 10,
        marginBottom: 25,
    },
    primary: {
        color: '#5C4033',
        fontSize: 18,
        fontWeight: '500',
    }
});
