import React from "react";
import { View, Text, StyleSheet, TextInput, Button, FlatList, Modal, TouchableOpacity, Image } from "react-native";

export default class RechercheScreen extends React.Component {
    state = {
        searchText: '',
        searchResults: [],
        modalVisible: false,
        selectedMeal: null
    }

    componentDidMount() {
        // Vérifiez si le composant a été ouvert à partir d'une notification
        if (this.props.route.params && this.props.route.params.recipe) {
            const { recipe } = this.props.route.params;
            this.showModal(recipe);
        }
    }
    

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
                <Text style={styles.header}>Trouvez votre recette</Text>
                <TextInput
                    style={styles.searchBar}
                    value={this.state.searchText}
                    onChangeText={(text) => this.setState({ searchText: text })}
                    placeholder="Recherchez une recette..."
                />
                <Button title="Rechercher" onPress={this.handleSearch} color="#5c6bc0" />
                
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
                                <Image source={{uri: selectedMeal.strMealThumb}} style={styles.mealImage} />
                                <Text style={styles.mealTitle}>{selectedMeal.strMeal}</Text>
                                <Text>{selectedMeal.strInstructions}</Text>
                                <Button title="Fermer" onPress={this.hideModal} color="#5c6bc0" />
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        );
    }
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f3f3',
        paddingHorizontal: 20,
        paddingTop: 50
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#5c6bc0'
    },
    searchBar: {
        width: '100%',
        padding: 15,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: 'white',
        elevation: 3
    },
    listItem: {
        padding: 15,
        backgroundColor: 'white',
        marginTop: 10,
        borderRadius: 5,
        elevation: 3
    },
    listText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5
    },
    mealTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    mealImage: {
        width: '100%',
        height: 200,
        marginBottom: 20
    }
});