import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StatusBar, TouchableOpacity, TextInput, Button } from 'react-native';
import styled from "styled-components";
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs } from 'firebase/firestore';
import { app, auth } from '../firebase';
import moment from 'moment';
import { signOut } from 'firebase/auth';
import Fire from '../Fire';
import { Ionicons } from "@expo/vector-icons";

const db = getFirestore(app);

export default function WelcomeScreen() {

    const feedRef = useRef(null);
    const [commentText, setCommentText] = useState('');
    const [posts, setPosts] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [expandedPostId, setExpandedPostId] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'posts'), async snapshot => {
            const fetchedPosts = await Promise.all(snapshot.docs.map(async docSnapshot => {
                const postData = { id: docSnapshot.id, ...docSnapshot.data() };

                const commentsSnapshot = await getDocs(collection(doc(db, 'posts', docSnapshot.id), 'comments'));
                postData.comments = commentsSnapshot.docs.map(commentDoc => ({ id: commentDoc.id, ...commentDoc.data() }));

                if (postData.uid) {
                    const userDoc = await getDoc(doc(db, 'users', postData.uid));
                    if (userDoc.exists()) {
                        postData.userDetails = userDoc.data();
                    }
                }
                return postData;
            }));
            setPosts(fetchedPosts);
        });
        return () => unsubscribe();
    }, []);

    const handleAddComment = async (postId) => {
        if (commentText.trim() !== "") {
            await Fire.addComment(postId, commentText);
            setCommentText('');

            const newComments = await fetchCommentsForPost(postId);
            setPosts(prevPosts => {
                return prevPosts.map(post => 
                    post.id === postId 
                        ? { ...post, comments: newComments }
                        : post
                );
            });
        }
    };

    const fetchCommentsForPost = async (postId) => {
        const commentsSnapshot = await getDocs(collection(doc(db, 'posts', postId), 'comments'));
        
        return commentsSnapshot.docs.map(commentDoc => ({ id: commentDoc.id, ...commentDoc.data() }));
    };

    const handleSignOut = () => {
        signOut(auth).catch((error) => {
            console.error("Erreur lors de la déconnexion : ", error);
        });
    };

    const renderPost = ({ item, index }) => {  // ajout de l'index
        if (!item.userEmail || !item.text || !item.timestamp) {
            return null;
        }

        const handleAddComment = async (postId) => {
            if (commentText.trim() !== "") {
                const newCommentId = await Fire.addComment(postId, commentText);  // Vous récupérez déjà cet ID
                setCommentText(''); // Réinitialisez le champ de saisie après l'ajout du commentaire
                
                // Si newCommentId est valide, rafraîchissez les commentaires pour ce post spécifique
                if (newCommentId) {
                    const commentDocSnapshot = await getDoc(doc(db, 'posts', postId, 'comments', newCommentId));
                    if (commentDocSnapshot.exists()) {
                        const newCommentData = { id: commentDocSnapshot.id, ...commentDocSnapshot.data() };
                        
                        setPosts(prevPosts => {
                            return prevPosts.map(post => 
                                post.id === postId 
                                    ? { ...post, comments: [...post.comments, newCommentData] }
                                    : post
                            );
                        });
                    }
                }
            }
        };
        
        
    
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

            <TouchableOpacity 
            
            onPress={() => {
                console.log('Icone de commentaire cliquée');
                setExpandedPostId(item.id === expandedPostId ? null : item.id);
             }} 
                    
                    style={{ alignSelf: 'center', marginTop: 10 }}
                >
                    <Ionicons name="ios-chatbubbles" size={24} color="black" />
                </TouchableOpacity>
{console.log("Commentaires pour le post", item.id, ":", item.comments)
}
                {item.id === expandedPostId && ( 
                    <>
                        <FlatList 
                            data={item.comments} 
                            
                            renderItem={({ item }) => <Text>{item.text}</Text>} 
                            keyExtractor={(comment) => comment.id.toString()} 
                        />
                    </>
                )}

<View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                    <TextInput 
                        value={commentText}
                        onChangeText={text => setCommentText(text)}
                        placeholder="Ajouter un commentaire..."
                        style={{ flex: 1, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 }}
                    />
                    <Button title="Commenter " onPress={() => handleAddComment(item.id)} />
                </View> 
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