import React, { useEffect, useState, useRef } from 'react';
import { Image,View, Text, FlatList, StatusBar, TouchableOpacity, TextInput, Button } from 'react-native';
import styled from "styled-components";
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs } from 'firebase/firestore';
import { app, auth } from '../firebase';
import moment from 'moment';
import { signOut } from 'firebase/auth';
import Fire from '../Fire';
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { SignoutIcon } from 'react-native-heroicons/solid';
import * as ImagePicker from 'expo-image-picker';



const db = getFirestore(app);

export default function WelcomeScreen() {




    const feedRef = useRef(null);
    const [commentTexts, setCommentTexts] = useState({});
    const [commentImageUri, setCommentImageUri] = useState(null);
    const [posts, setPosts] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [expandedPostId, setExpandedPostId] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'posts'), async snapshot => {
            const fetchedPosts = await fetchAllDetails(snapshot);
            setPosts(fetchedPosts);
        });
        return () => unsubscribe();
    }, []);

    const handleCommentChange = (postId, text) => {
        setCommentTexts(prev => ({ ...prev, [postId]: text }));
    };

    const fetchUserDetails = async (uid, userCache) => {
        if (userCache[uid]) {
            return userCache[uid];
        } else {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                userCache[uid] = userDoc.data();
                return userDoc.data();
            }
            return null; // ou une structure d'utilisateur par défaut, si vous le souhaitez.
        }
    };
    
    const fetchAllDetails = async (snapshot) => {
        const userCache = {};
        const fetchedPosts = [];
    
        for (let docSnapshot of snapshot.docs) {
            const postData = { id: docSnapshot.id, ...docSnapshot.data() };
    
            // Get comments
            postData.comments = await fetchCommentsForPost(docSnapshot.id, userCache);
    
            // Get user details
            if (postData.uid) {
                if (userCache[postData.uid]) {
                    postData.userDetails = userCache[postData.uid];
                } else {
                    const userDoc = await getDoc(doc(db, 'users', postData.uid));
                    if (userDoc.exists()) {
                        postData.userDetails = userDoc.data();
                        userCache[postData.uid] = userDoc.data();
                    }
                }
            }
            fetchedPosts.push(postData);
        }
        return fetchedPosts;
    };
    
    const fetchCommentsForPost = async (postId, userCache) => {
        const commentsSnapshot = await getDocs(collection(doc(db, 'posts', postId), 'comments'));
        const comments = [];
        for (let commentDoc of commentsSnapshot.docs) {
            const commentData = { id: commentDoc.id, ...commentDoc.data() };
    
            // Récupération des détails de l'utilisateur pour le commentaire
            if (commentData.uid) {
                commentData.userDetails = await fetchUserDetails(commentData.uid, userCache);
            }
            comments.push(commentData);
        }
        return comments;
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
        const handleRating = async (postId, ratingValue) => {
            await Fire.addRating(postId, ratingValue);
        };

        const renderStars = (rating) => {
            const stars = [];
            for (let i = 1; i <= 5; i++) {
                const isSelected = i <= rating;
                stars.push(
                    <TouchableOpacity 
                        key={i} 
                        onPress={() => {
                            handleRating(item.id, i);
                            // Ajoutez ici l'animation de l'étoile si vous le souhaitez
                        }} 
                        style={{ marginHorizontal: 5 }}
                    >
                        {isSelected ? 
                            <ActiveStar name="star" size={26} /> :
                            <InactiveStar name="staro" size={26} />
                        }
                    </TouchableOpacity>
                );
            }
            return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>{stars}</View>;
        };
        
        const pickImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        
            console.log(result);
        
            if (!result.cancelled) {
                setCommentImageUri(result.uri);
            }
        };

        const handleAddComment = async (postId) => {
            const commentText = commentTexts[postId];
            if (commentText && commentText.trim() !== "") {
                const newCommentId = await Fire.addComment(postId, commentText, commentImageUri);
                setCommentTexts(prev => ({ ...prev, [postId]: '' }));
                    
                if (newCommentId) {
                    const commentDocSnapshot = await getDoc(doc(db, 'posts', postId, 'comments', newCommentId));
                    if (commentDocSnapshot.exists()) {
                        const newCommentData = { id: commentDocSnapshot.id, ...commentDocSnapshot.data() };
                        if (newCommentData.uid) {
                            newCommentData.userDetails = await fetchUserDetails(newCommentData.uid, {});
                        }
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
                    <PostProfilePhoto source={{ uri: item.userDetails?.profilePic }} />
                    <PostInfoContainer>
                        <Text style={{ color: "white", fontWeight: 'bold' }}>{item.userDetails?.fullName || "Anonyme"}</Text>
                        <Text style={{ color: "black", marginTop: 4, fontSize: 10 }}>
                            {moment(item.timestamp).fromNow()}
                        </Text>
                    </PostInfoContainer>
                </PostHeaderContainer>
                <Post>
                    <Text>{item.text}</Text>
                    
                    {/* Ajout de l'interaction sur l'image du post */}
                    <TouchableOpacity onPress={() => {
                        console.log('Image du post cliquée');
                        setExpandedPostId(item.id === expandedPostId ? null : item.id);
                    }}>
                        {item.image && <PostPhoto source={{ uri: item.image }} />}
                    </TouchableOpacity>
                    
                </Post>
                
                
    
                
                {item.id === expandedPostId && ( 
                <>
                    <FlatList 
                        data={item.comments} 
                        renderItem={({ item: comment }) => (
                            <CommentContainer>
                                <CommentProfilePhoto source={{ uri: comment.userDetails?.profilePic }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold' }}>{comment.userDetails?.fullName || 'Anonyme'}: </Text>
                                    <Text>{comment.text}</Text>
                                 
                                    {/* Display comment image if exists */}
                                    {comment.imageUrl && (
                                        
                                        <TouchableOpacity onPress={() => {
                                            console.log('Comment image clicked');
                                        }}>
                                            <PostPhoto source={{ uri: comment.imageUrl }} />
                                          
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </CommentContainer>
                        )}
                        keyExtractor={(comment) => comment.id.toString()} 
                    />
                </>
            )}

            
    
    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
    <CommentInput
    value={commentTexts[item.id] || ''}
    onChangeText={text => setCommentTexts(prev => ({ ...prev, [item.id]: text }))}
    placeholder="Ajouter un commentaire..."
/>
<StyledButton onPress={pickImage}>
        <ButtonText>Choisir une image</ButtonText>
    </StyledButton>

                    <StyledButton onPress={() => handleAddComment(item.id)}>
                        <ButtonText>Commenter</ButtonText>
                    </StyledButton>
                </View>
     
                {renderStars(item.averageRating || 0)}
            </PostContainer>
        );
    
    };
    
  

    return (
        <Container>
        <StyledSignoutButton onPress={handleSignOut}>
            <Ionicons name="log-out" size={35} color="#5A3511" />
        </StyledSignoutButton>
        <FeedContainer>
            <Text style={{ fontSize: 15, fontWeight: "bold", textAlign: 'center', marginBottom: 20 }}></Text>
            <Feed data={posts} renderItem={renderPost} keyExtractor={(item) => item.id.toString()} />
        </FeedContainer>
        <StatusBar barStyle="dark-content" />
    </Container>
    );
    
}



const Container = styled(View)`
    flex: 1;
    background-color: #EAD9C0; 
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
    background-color: #D0C2A7; 
    border-radius: 6px;
    padding: 8px;
`;

const PostHeaderContainer = styled(View)`
    flex-direction: row;
    margin-bottom: 16px;
    align-items: center;
`;

const PostProfilePhoto = styled(Image)`
    width: 48px;
    height: 48px;
    border-radius: 24px;
`;

const PostInfoContainer = styled(View)`
    flex: 1;
    margin: 0 16px;
`;

const Post = styled(View)`
    margin-left: 64px;
`;

const CommentContainer = styled(View)`
    flex-direction: row;
    background-color: #E8DED2; 
    border-radius: 12px;
    padding: 8px;
    margin-vertical: 4px;
    align-items: center;
`;

const CommentProfilePhoto = styled(Image)`
    width: 32px;
    height: 32px;
    border-radius: 16px;
    margin-right: 8px;
`;

const PostPhoto = styled(Image)`
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

const LogoutButton = styled(TouchableOpacity)`
    align-self: center;
    margin-bottom: 10px;
    padding: 8px 16px;
    border-radius: 20px;
    background-color: #5A3511;
    shadow-color: #000;
    shadow-offset: 0 2px;

    shadow-opacity: 0.2;
    shadow-radius: 4px;
`;

const CommentInput = styled(TextInput)`
    flex: 1;
    margin-right: 8px;
    padding: 8px 12px;
    
    
    borderRadius: 15px;
    backgroundColor: white;
    shadow-color: #000;
    shadow-offset: 0 2px;
    shadow-opacity: 0.1;
    shadow-radius: 2px;
`;
const CommentButton = styled(Button)`
    background-color: #5A3511;
    border-radius: 15px;
    padding: 8px 12px;
`;

const StyledButton = styled.TouchableOpacity`
    background-color: #5A3511;
    padding: 2px 5px;            
    border-radius: 10px;          
    margin-left: 10px;
    justify-content: center;
    align-items: center;
    shadow-color: #000;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
    elevation: 5;  
`;


const ButtonText = styled.Text`
    color: #fff;
    font-weight: bold;
`;

const StyledSignoutButton = styled.TouchableOpacity`
    position: absolute;
    top: 40px; 
    right: 5px; 
    background-color: transparent;
    padding: 10px;
    border-radius: 25px;
    justify-content: center;
    align-items: center;
    shadow-color: #000;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
    elevation: 5;
`;

const ActiveStar = styled(AntDesign)`
    color: gold;
`;

const InactiveStar = styled(AntDesign)`
    color: lightgray;
`;




// ... The rest of the code ...

