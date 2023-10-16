import React from "react";
import { View, Text, StyleSheet, Button, TextInput, Image, TouchableOpacity, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import fireRecetteInstance from "../FireRecettes";

// Composant de création de recette
export default class CrateRecetteScreen extends React.Component {
    
    // Initialisation du state
    state = {
        title: "",       // Titre de la recette
        text: "",        // Texte ou description de la recette
        localUri: null   // URI de l'image locale de la recette
    }

    // Fonction pour choisir une image depuis la bibliothèque de l'appareil
    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            this.setState({ localUri: result.uri });
        }
    }

    // Fonction pour ajouter une recette
    handleAddRecette = async () => {
        // Vérification si le titre et le texte ne sont pas vides
        if (this.state.text.trim() !== "" && this.state.title.trim() !== "") {
            let imageUri = null;
            if (this.state.localUri) {
                // Télécharge l'image sur FireRecettes
                imageUri = await fireRecetteInstance.uploadPhotoAsync(this.state.localUri);
            }
            // Ajoute la recette dans FireRecettes
            await fireRecetteInstance.addRecette({
                title: this.state.title,
                text: this.state.text,
                localUri: imageUri
            }).then(ref => {
                this.props.navigation.navigate('MyRecette');
            });
            
            // Réinitialise le state après l'ajout
            this.setState({ title: "", text: "", localUri: null });
        } else {
            alert("Veuillez saisir un titre et une recette.");
        }
    }

    // Rendu du composant
    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>

                {/* Champ de saisie du titre */}
                <TextInput 
                    placeholder="Titre de la recette"
                    style={styles.textInput}
                    value={this.state.title}
                    onChangeText={(title) => this.setState({ title })}
                />
                
                {/* Champ de saisie de la description de la recette */}
                <TextInput 
                    placeholder="Saisissez votre recette..."
                    style={styles.textArea}
                    value={this.state.text}
                    onChangeText={(text) => this.setState({ text })}
                    multiline={true}
                />
                
                {/* Affichage de l'image si elle est choisie, sinon affiche le bouton pour choisir une image */}
                {this.state.localUri ? (
                    <Image source={{ uri: this.state.localUri }} style={styles.recipeImage} />
                ) : (
                    <TouchableOpacity style={styles.imagePicker} onPress={this.pickImage}>
                        <Text style={styles.imagePickerText}>Choisir une image pour la recette</Text>
                    </TouchableOpacity>
                )}
                
                {/* Bouton pour ajouter la recette */}
                <TouchableOpacity style={styles.button} onPress={this.handleAddRecette}>
                    <Text style={styles.buttonText}>Ajouter la recette</Text>
                </TouchableOpacity>

            </ScrollView>
        );
    }
}

// Styles de composants
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#DAC3A7",
        justifyContent: 'center',
    },
    textInput: {
        width: "100%",
        padding: 15,
        borderColor: "#A89F91",
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: "#FFFDFC",
        fontSize: 16,
        alignSelf: 'center'
    },
    textArea: {
        width: "100%",
        padding: 15,
        borderColor: "#A89F91",
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: "#FFFDFC",
        height: 180,
        textAlignVertical: 'top',
        fontSize: 16,
        alignSelf: 'center'
    },
    recipeImage: {
        width: '90%',
        height: 250,
        borderRadius: 15,
        marginBottom: 20,
        alignSelf: 'center'
    },
    imagePicker: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#A89F91",
        marginBottom: 20,
        alignItems: 'center',
        backgroundColor: "#FFFDFC",
        alignSelf: 'center'
    },
    imagePickerText: {
        color: "#5C4033",
        fontSize: 16,
    },
    button: {
        backgroundColor: '#5C4033',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        width: '60%',
        alignSelf: 'center',
        marginTop: 20
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
    }
});
