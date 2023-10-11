import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image } from "react-native";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import Fire from "../Fire";
import * as ImagePicker from "expo-image-picker";
import { getFirestore } from "firebase/firestore";



export default class PostScreen extends React.Component {
    state = {
        text: "",
        image: null
    };

    componentDidMount() {
        this.getPhotoPermission();
    }

    getPhotoPermission = async () => {
        if (Constants.platform.ios) {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== "granted") {
                alert("We need permission to use your camera roll if you'd like to include a photo.");
            }
        }
    };

    handlePost = () => {
        
        Fire
            .addPost({ text: this.state.text.trim(), localUri: this.state.image })
            .then(ref => {
                this.setState({ text: "", image: null });
                this.props.navigation.goBack();
            })
            .catch(error => {
                alert(error);
            });
    };

  

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!result.canceled) {
            this.setState({ image: result.uri });
        }
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name="md-arrow-back" size={24} style={styles.backButton}></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handlePost} style={styles.postButton}>
    <Text style={styles.postButtonText}>Post</Text>
</TouchableOpacity>

                </View>
    
                <View style={styles.inputContainer}>
                    
                    <TextInput
                        autoFocus={true}
                        multiline={true}
                        numberOfLines={4}
                        style={styles.textInput}
                        placeholder="Want to share something?"
                        placeholderTextColor="#A89F91" // Marron moyen pour le texte du placeholder
                        onChangeText={text => this.setState({ text })}
                        value={this.state.text}
                    ></TextInput>
                </View>
    
                <TouchableOpacity style={styles.photo} onPress={this.pickImage}>
                <Ionicons name="md-camera" size={32} color="#A89F91"></Ionicons>

                </TouchableOpacity>
    
                <View style={{ marginHorizontal: 32, marginTop: 32, height: 150 }}>
                    <Image source={{ uri: this.state.image }} style={{ width: "100%", height: "100%", borderRadius: 6 }}></Image>
                </View>
            </SafeAreaView>
        );
    }
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DAC3A7', // Marron clair pour l'arrière-plan
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#A89F91" // Marron moyen pour la bordure
    },
    inputContainer: {
        margin: 32,
        flexDirection: "row",
        backgroundColor: '#FFFDFC', // Couleur très claire pour le fond
        padding: 8,
        borderRadius: 6
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24
    },
    photo: {
        alignItems: "flex-end",
        marginHorizontal: 32
    },
    textInput: {
        color: '#5C4033', // Marron foncé pour le texte
        flex: 1
    },
    postButton: {
        fontWeight: "500",
        color: '#5C4033' // Marron foncé pour le texte du bouton
    },
    backButton: {
        color: '#5C4033' // Marron foncé pour l'icône de retour
    },
    postButton: {
        backgroundColor: '#5A2D0C',  // Marron très foncé (chocolat foncé)
        padding: 8,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    
    postButtonText: {
        color: 'white',  // Pour une meilleure lisibilité sur fond marron
        fontWeight: 'bold',
    }
    
});