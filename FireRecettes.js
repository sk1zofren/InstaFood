import { app, auth, storage } from "./firebase"; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';

const db = getFirestore(app);

class FireRecettes {
    
    // Ajout d'une nouvelle recette
    addRecette = async ({ text, localUri, title }) => {
        console.log("Début de addRecette");
    
        const userDocRef = doc(db, 'users', this.uid);
        let userData = {};
        try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                userData = docSnap.data();
            } else {
                console.log("Aucun document utilisateur trouvé!");
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
    
        const recetteData = {
            text,
            title,
            uid: this.uid,
            timestamp: this.timestamp,
            userEmail: auth.currentUser.email,
            fullName: userData.fullName || "Anonyme",
            profilePic: userData.profilePic || 'favicon.png'
        };
    
        if (remoteUri) {
            recetteData.image = remoteUri;
        }
    
        try {
            const recetteRef = await addDoc(collection(db, "recettes"), recetteData);
            console.log("Recette enregistrée avec succès. ID de la recette:", recetteRef.id);
        } catch (e) {
            console.error("Erreur lors de l'enregistrement de la recette :", e);
        }
    };
    
    uploadPhotoAsync = async uri => {
        const path = `recette_photos/${this.uid}/${Date.now()}.jpg`;
        const response = await fetch(uri);
        const file = await response.blob();
        const storageReference = ref(storage, path);
        let downloadURL;

        try {
            const uploadTask = uploadBytesResumable(storageReference, file);
            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', 
                    (snapshot) => {},
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

const fireRecetteInstance = new FireRecettes();
export default fireRecetteInstance;
