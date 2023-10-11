import React from "react";
import { View, Text, StyleSheet, Button, TextInput, Image, TouchableOpacity, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import fireRecetteInstance from "../FireRecettes";

export default class CrateRecetteScreen extends React.Component {
    state = {
        title: "", // Ajoutez le titre ici
        text: "",
        localUri: null
    }

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

    handleAddRecette = async () => {
        if (this.state.text.trim() !== "" && this.state.title.trim() !== "") { // Vérifiez le titre aussi
            let imageUri = null;
            if (this.state.localUri) {
                imageUri = await fireRecetteInstance.uploadPhotoAsync(this.state.localUri);
            }
            await fireRecetteInstance.addRecette({
                title: this.state.title, // Ajoutez le titre ici
                text: this.state.text,
                localUri: imageUri
            });
            alert("Recette ajoutée !");
            this.setState({ title: "", text: "", localUri: null }); // Réinitialisez le titre aussi
        } else {
            alert("Veuillez saisir un titre et une recette.");
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
              
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#DAC3A7" // Marron clair pour l'arrière-plan
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#5C4033' // Marron foncé pour les textes
    },
    textInput: {
        width: "100%",
        padding: 15,
        borderColor: "#A89F91", // Marron moyen
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: "#FFFDFC" // Couleur très claire pour le fond du TextInput
    },
    textArea: {
        width: "100%",
        padding: 15,
        borderColor: "#A89F91",
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: "#FFFDFC",
        height: 150,
        textAlignVertical: 'top'
    },
    recipeImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10
    },
    imagePicker: {
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#A89F91",
        marginBottom: 10,
        alignItems: 'center',
        backgroundColor: "#FFFDFC"
    },
    imagePickerText: {
        color: "#5C4033"
    },
    button: {
        backgroundColor: '#5C4033',  
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        width: 150,
        alignSelf: 'center'
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    }
});