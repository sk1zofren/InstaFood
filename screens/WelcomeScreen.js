import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import styled from "styled-components";
import { getFirestore, collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { app, auth } from '../firebase';
import moment from 'moment';
import { signOut } from 'firebase/auth';



const db = getFirestore(app);

export default function WelcomeScreen() {
   
  
    const [posts, setPosts] = useState([]);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'posts'), snapshot => {
            const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(fetchedPosts);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
      // Écouter les changements sur la collection "posts"
      const unsubscribe = onSnapshot(collection(db, 'posts'), async snapshot => {
  
          // Transformer chaque document "post" en un objet post avec des détails d'utilisateur (si disponible)
          const fetchedPosts = await Promise.all(snapshot.docs.map(async docSnapshot => {
              const postData = { id: docSnapshot.id, ...docSnapshot.data() };
              
              if (postData.uid) {
                  console.log("Vérification du uid: ", postData.uid); // Etape 1
                  try {
                      // Récupérer les détails de l'utilisateur associé à ce post
                      const userDoc = await getDoc(doc(db, 'users', postData.uid));
                      if (userDoc.exists()) {
                          postData.userDetails = userDoc.data();
                          console.log("Détails de l'utilisateur récupérés avec succès: ", userDoc.data()); // Etape 2
                      } else {
                          console.log("Aucun document utilisateur trouvé pour l'uid: ", postData.uid);
                      }
                  } catch (error) {
                      console.error("Erreur lors de la récupération du document utilisateur: ", error); // Etape 3 et 4
                  }
              }
  
              return postData;
          }));
  
          // Mettre à jour l'état local avec les posts récupérés
          setPosts(fetchedPosts);
      });
  
      // Se désabonner de l'écouteur lorsque le composant est démonté
      return () => unsubscribe();
  }, []);
  
  
  
  
 

    const handleSignOut = () => {
        signOut(auth).then(() => {
            // Redirection ou action après la déconnexion si nécessaire
        }).catch((error) => {
            console.error("Erreur lors de la déconnexion : ", error);
        });
    };

    const renderPost = ({ item }) => {
      if (!item.userEmail || !item.text || !item.timestamp) {
        return null;
      }
    
      return (
        <PostContainer>
            <PostHeaderContainer>
               <PostProfilePhoto source={{ uri: item.userDetails?.profilePic || 'favicon.png' }} />
                <PostInfoContainer>
                    <Text>{item.userDetails?.fullName || "Anonyme"}</Text>
                    <Text style={{ color: "#c1c3cc", marginTop: 4 }}>
                        {moment(item.timestamp).fromNow()}
                    </Text>
                </PostInfoContainer>
            </PostHeaderContainer>
            <Post>
                <Text>{item.text}</Text>
                {item.image && <PostPhoto source={{ uri: item.image }} />}
            </Post>
        </PostContainer>
      );
    };
    
  

    return (
      <Container>
          <TouchableOpacity onPress={handleSignOut} style={{ alignSelf: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#FF0000' }}>Déconnexion</Text>
          </TouchableOpacity>
          <FeedContainer>
              <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: 'center' }}>Feed</Text>
              <Feed data={posts} renderItem={renderPost} keyExtractor={(item) => item.id.toString()} />
          </FeedContainer>
          <StatusBar barStyle="dark-content" />
      </Container>
  );
}

// Styles
const Container = styled(View)`
    flex: 1;
    background-color: #ebecf3;
    padding-top: 64px;
`;

const FeedContainer = styled(View)`
    flex: 1;
`;

const Feed = styled(FlatList)`
    flex: 1;
`;

const PostContainer = styled(View)`
    margin: 16px;
    background-color: #ffffff;
    border-radius: 6px;
    padding: 8px;
`;

const PostHeaderContainer = styled(View)`
    flex-direction: row;
    margin-bottom: 16px;
    align-items: center;
`;

const PostProfilePhoto = styled.Image`
    width: 48px;
    height: 48px;
    border-radius: 24px;
`;

const PostInfoContainer = styled(View)`
    flex: 1;
    margin: 0 16px;
`;

const Options = styled(View)`
    align-items: flex-end;
    justify-content: center;
`;

const Post = styled(View)`
    margin-left: 64px;
`;

const PostPhoto = styled.Image`
    width: 100%;
    height: 150px;
    border-radius: 6px;
    margin-top: 8px;
`;

const PostDetails = styled(View)`
    flex-direction: row;
    margin-top: 8px;
`;

const PostLikes = styled(View)`
    flex-direction: row;
    align-items: center;
`;

const PostComments = styled(View)`
    flex-direction: row;
    align-items: center;
    margin-left: 16px;
`;
