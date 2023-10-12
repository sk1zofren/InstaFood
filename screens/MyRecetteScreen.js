import React, { useEffect, useState } from 'react';
import { Text, FlatList, TouchableOpacity, Image } from 'react-native';
import styled from "styled-components";
import { getFirestore, collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebase';
import moment from 'moment';

const db = getFirestore(app);

export default function MyRecetteScreen() {
   
    const [recettes, setRecettes] = useState([]);
    const [selectedRecetteId, setSelectedRecetteId] = useState(null);  // Pour gérer l'ouverture/fermeture

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'recettes'), async snapshot => {
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
            
            setRecettes(fetchedRecettes);
        });

        return () => unsubscribe();
    }, []);

    const toggleRecette = id => {
        setSelectedRecetteId(prevId => (prevId === id ? null : id));
    };

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

// Styles
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

const RecetteProfilePhoto = styled.Image`
    width: 50px; 
    height: 50px;
    border-radius: 25px;
`;

const RecetteInfoContainer = styled.View`
    flex: 1;
    margin-left: 20px; 
`;

const RecetteContent = styled.View`
    margin-left: 70px;  
`;

const RecettePhoto = styled.Image`
    width: 100%;
    height: 160px;  
    border-radius: 8px;
    margin-top: 10px;  
`;