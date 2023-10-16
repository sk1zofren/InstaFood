import React, { useEffect, useState } from 'react';
import { Text, FlatList, TouchableOpacity, Image } from 'react-native';
import styled from "styled-components";
import { getFirestore, collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { app, auth } from '../firebase';
import moment from 'moment';

// Initialisation de la base de données
const db = getFirestore(app);

export default function MyRecetteScreen() {
    // Obtenir l'ID utilisateur actuel
    const currentUserUID = auth.currentUser?.uid;

    // Etats pour les recettes et l'ID de recette sélectionné
    const [recettes, setRecettes] = useState([]);
    const [selectedRecetteId, setSelectedRecetteId] = useState(null);

    // Charger les recettes lors du montage du composant
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'recettes'), async snapshot => {
            // Récupération des recettes et informations de l'utilisateur
            const fetchedRecettes = await Promise.all(snapshot.docs.map(async docSnapshot => {
                const recetteData = { id: docSnapshot.id, ...docSnapshot.data() };

                if (recetteData.uid) {
                    try {
                        const userDoc = await getDoc(doc(db, 'users', recetteData.uid));
                        if (userDoc.exists()) {
                            recetteData.userDetails = userDoc.data();
                        }
                    } catch (error) {
                        console.error("Erreur lors de la récupération du document utilisateur: ", error);
                    }
                }

                return recetteData;
            }));

            console.log("All Recettes:", fetchedRecettes);

            // Filtrer les recettes pour obtenir uniquement celles de l'utilisateur actuel
            const userRecettes = fetchedRecettes.filter(recette => recette.uid === currentUserUID);

            

            // Tri des recettes par ordre chronologique
            const sortedRecettes = userRecettes.sort((a, b) => b.timestamp - a.timestamp);

            // Mettre à jour l'état des recettes
            setRecettes(userRecettes);
        });

        return () => unsubscribe();
    }, []);

    // Fonction pour afficher/masquer une recette
    const toggleRecette = id => {
        setSelectedRecetteId(prevId => (prevId === id ? null : id));
    };

    // Fonction pour afficher une recette
    const renderRecette = ({ item }) => {
        return (
            <RecetteContainer onPress={() => toggleRecette(item.id)}>
                <RecetteHeaderContainer>
                    <RecetteInfoContainer>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#5C4033' }}>{item.title}</Text>
                        <Text style={{ color: "#A89F91", marginTop: 4 }}>
                            {moment(item.timestamp).fromNow()}
                        </Text>
                    </RecetteInfoContainer>
                </RecetteHeaderContainer>
                {selectedRecetteId === item.id && (
                    <RecetteContent>
                        <Text style={{ color: '#5C4033' }}>{item.text}</Text>
                        {item.image && <RecettePhoto source={{ uri: item.image }} />}
                    </RecetteContent>
                )}
            </RecetteContainer>
        );
    };

    return (
        <Container>
            <RecettesFeed data={recettes} renderItem={renderRecette} keyExtractor={(item) => item.id.toString()} />
        </Container>
    );
}

// Styles des composants
const Container = styled.View`
    flex: 1;
    background-color: #DAC3A7;
    padding-top: 20px;
`;

const RecettesFeed = styled(FlatList)`
    flex: 1;
`;

const RecetteContainer = styled(TouchableOpacity)`
    margin: 20px;
    background-color: #FFFDFC;
    border-radius: 8px;
    padding: 12px;
    shadow-color: #000;
    shadow-offset: { width: 0; height: 2 };
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 5;
`;

const RecetteHeaderContainer = styled.View`
    flex-direction: row;
    margin-bottom: 20px;
    align-items: center;
`;


const RecetteInfoContainer = styled.View`
    flex: 1;
    margin-left: 20px;
`;

const RecetteContent = styled.View`
    margin-left: 5px;
`;

const RecettePhoto = styled.Image`
    width: 100%;
    height: 280px;
    resize-mode: cover;
    border-radius: 10px;
`;
