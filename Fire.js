import { app, auth, storage } from "./firebase"; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc,getDocs,updateDoc } from 'firebase/firestore';

const db = getFirestore(app); // Pour la version v9+, on initialise Firestore de cette manière.

class Fire {

    addRating = async (postId, value) => {
        if (value < 1 || value > 5) {
            console.error("Invalid star rating value");
            return;
        }
    
        const ratingRef = doc(db, 'posts', postId, 'ratings', this.uid);
        await setDoc(ratingRef, { uid: this.uid, value: value }, { merge: true }); // Changed starValue to value here
    
        // Mise à jour de la note moyenne du post et du nombre total de notes.
        const ratingsSnapshot = await getDocs(collection(db, 'posts', postId, 'ratings'));
        let totalRating = 0;
        ratingsSnapshot.forEach(doc => {
            totalRating += doc.data().value;
        });
        const averageRating = totalRating / ratingsSnapshot.size;
    
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, { averageRating: averageRating, ratingsCount: ratingsSnapshot.size });
    };
    
    

    addComment = async (postId, commentText, commentImageUri = null) => {
        const userDocRef = doc(db, 'users', this.uid);
        let userData = {};
    
        try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                userData = docSnap.data();
            } else {
                console.log("No user document found!");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        }
    
        let commentImageUrl = null;
        if (commentImageUri) {
            console.log("Tentative d'upload de l'image du commentaire...");
            commentImageUrl = await this.uploadPhotoAsync(commentImageUri);
            console.log("Image du commentaire uploadée avec succès, URL:", commentImageUrl);
        }
    
        const commentData = {
            text: commentText,
            uid: this.uid,
            timestamp: this.timestamp,
            userEmail: auth.currentUser.email,
            fullName: userData.fullName || "Anonyme",
            profilePic: userData.profilePic || 'favicon.png'
        };
    
        if (commentImageUrl) {
            commentData.imageUrl = commentImageUrl;
        }
    
        try {
            const docRef = await addDoc(collection(db, "posts", postId, "comments"), commentData);
            console.log("Commentaire ajouté avec succès avec l'ID :", docRef.id);
            return docRef.id;
        } catch (e) {
            console.error("Erreur lors de l'ajout du commentaire :", e);
        }
    };
    
    

    addPost = async ({ text, localUri }) => {
        console.log("Début de addPost");
    
        const userDocRef = doc(db, 'users', this.uid);
        let userData = {};
        try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                userData = docSnap.data();
            } else {
                console.log("No user document found!");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        }
        
        let remoteUri = null;
        if (localUri) {
            console.log("Tentative d'upload de l'image...");
            remoteUri = await this.uploadPhotoAsync(localUri);
            console.log("Image uploadée avec succès, remoteUri:", remoteUri);
        } else {
            console.log("Aucune image à uploader.");
        }
    
        const postData = {
            text,
            uid: this.uid,
            timestamp: this.timestamp,
            userEmail: auth.currentUser.email,
            fullName: userData.fullName || "Anonyme", // Récupérez le nom complet de userData
            profilePic: userData.profilePic || 'favicon.png' // Récupérez la photo de profil de userData
        };
    
        if (remoteUri) {
            postData.image = remoteUri;
        }
    
        try {
            const postRef = await addDoc(collection(db, "posts"), postData);
            console.log("Post enregistré avec succès. ID du post:", postRef.id);
        } catch (e) {
            console.error("Erreur lors de l'enregistrement du post :", e);
        }
    };
    

    uploadPhotoAsync = async uri => {
        const path = `photos/${this.uid}/${Date.now()}.jpg`;
        const response = await fetch(uri);
        const file = await response.blob();
        const storageReference = ref(storage, path);
        let downloadURL;

        try {
            const uploadTask = uploadBytesResumable(storageReference, file);

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', 
                    (snapshot) => { 
                        // Vous pouvez ajouter une progression ici.
                    },
                    (error) => {
                        console.error("Erreur lors de l'upload:", error);
                        reject(error);
                    },
                    async () => {
                        downloadURL = await getDownloadURL(storageReference);
                        resolve();
                    }
                );
            });
            
            return downloadURL;

        } catch (error) {
            console.error("Erreur lors de l'upload:", error);
            throw error;
        }
    };

    get uid() {
        return (auth.currentUser || {}).uid;
    }

    get timestamp() {
        return Date.now();
    }
}

const fireInstance = new Fire();
export default fireInstance;
