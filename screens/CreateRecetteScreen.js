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
                <Text style={styles.title}>Créer une nouvelle recette</Text>
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
                <Button title="Ajouter la recette" onPress={this.handleAddRecette} color="#FF6347" />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F5F5F5"
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "#333"
    },
    textInput: {
        width: "100%",
        padding: 15,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: "white"
    },
    textArea: {
        width: "100%",
        padding: 15,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: "white",
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
        borderColor: "#ccc",
        marginBottom: 10,
        alignItems: 'center'
    },
    imagePickerText: {
        color: "#333"
    }
});