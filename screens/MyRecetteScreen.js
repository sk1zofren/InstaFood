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
                    <RecetteProfilePhoto source={{ uri: item.userDetails?.profilePic || 'favicon.png' }} />
                    <RecetteInfoContainer>
                        <Text>{item.title}</Text> {/* Le titre toujours visible */}
                    </RecetteInfoContainer>
                </RecetteHeaderContainer>
                {selectedRecetteId === item.id && (
                    <RecetteContent>
                        <Text>{item.text}</Text>
                        <Text style={{ color: "#c1c3cc", marginTop: 4 }}>
                            {moment(item.timestamp).fromNow()}
                        </Text>
                        {item.localUri && <RecettePhoto source={{ uri: item.localUri }} />}
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
    background-color: #ebecf3;
    padding-top: 16px;
`;

const RecettesFeed = styled(FlatList)`
    flex: 1;
`;

const RecetteContainer = styled(TouchableOpacity)`
    margin: 16px;
    background-color: #ffffff;
    border-radius: 6px;
    padding: 8px;
`;

const RecetteHeaderContainer = styled.View`
    flex-direction: row;
    margin-bottom: 16px;
    align-items: center;
`;

const RecetteProfilePhoto = styled.Image`
    width: 48px;
    height: 48px;
    border-radius: 24px;
`;

const RecetteInfoContainer = styled.View`
    flex: 1;
    margin: 0 16px;
`;

const RecetteContent = styled.View`
    margin-left: 64px;
`;

const RecettePhoto = styled.Image`
    width: 100%;
    height: 150px;
    border-radius: 6px;
    margin-top: 8px;
`;
