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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#DAC3A7",
        justifyContent: 'center', // Pour centrer les éléments
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#5C4033',
        alignSelf: 'center'
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
