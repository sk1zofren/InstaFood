import { app, auth, storage } from "./firebase"; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';

const db = getFirestore(app); // Pour la version v9+, on initialise Firestore de cette manière.

class Fire {
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
