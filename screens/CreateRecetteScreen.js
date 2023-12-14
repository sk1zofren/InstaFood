import React from "react";
import { View, Text, StyleSheet, Button, TextInput, Image, TouchableOpacity, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import fireRecetteInstance from "../FireRecettes";


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
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Limite la sélection aux images
            allowsEditing: true, 
            aspect: [4, 3], // dimension de l'image
            quality: 1, // qualité de l'image
        });

        // Vérifie si l'utilisateur a annulé la sélection
        if (!result.cancelled) {
            // Met à jour le state avec l'URI de l'image sélectionnée
            this.setState({ localUri: result.uri });
        }
    }

    // Fonction pour ajouter une recette
    handleAddRecette = async () => {
       
        if (this.state.text.trim() !== "" && this.state.title.trim() !== "") {
            let imageUri = null;

            // Vérifie si une image a été sélectionn
            if (this.state.localUri) {
                // Upload de l'image 
                imageUri = await fireRecetteInstance.uploadPhotoAsync(this.state.localUri);
            } else {
               
                alert("Veuillez sélectionner une image pour la recette.");
                return; 
            }

            // Ajoute la recette dans FireRecettes avec le titre, le texte et l'URI de l'image
            const newRecetteId = await fireRecetteInstance.addRecette({
                title: this.state.title,
                text: this.state.text,
                localUri: imageUri
            });
            
            
           alert("La recette a été ajoutée avec succès")

            
            this.setState({ title: "", text: "", localUri: null });
        } else {
           
            alert("Veuillez saisir un titre et une recette.");
        }
    };
      

    // Rendu du composant
    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>

               
               
                <TextInput 
                    placeholder="Titre de la recette"
                    style={styles.textInput}
                    value={this.state.title}
                    onChangeText={(title) => this.setState({ title })}
                />
                
               
                <TextInput 
                    placeholder="Saisissez votre recette..."
                    style={styles.textArea}
                    value={this.state.text}
                    onChangeText={(text) => this.setState({ text })}
                    multiline={true}
                />
                
               
                {this.state.localUri ? (
                    <Image source={{ uri: this.state.localUri }} style={styles.recipeImage} />
                ) : (
                    <TouchableOpacity style={styles.imagePicker} onPress={this.pickImage}>
                        <Text style={styles.imagePickerText}>Choisir une image pour la recette</Text>
                    </TouchableOpacity>
                )}
                
                
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
