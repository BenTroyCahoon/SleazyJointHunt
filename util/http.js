import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "./fireBaseConfig"; // Importera den initierade Firebase-appen

const storage = getStorage(app);
const rootUrl =
  "https://sleazyjointhunt-default-rtdb.europe-west1.firebasedatabase.app/";

const defaultProfilePic =
  "https://firebasestorage.googleapis.com/v0/b/sleazyjointhunt.appspot.com/o/profileImages%2Fakkakabotto.png?alt=media&token=e1ad9298-51b1-4f2c-8a97-2cd74e168929";

const storeUser = async (user, imageUri = null) => {
  try {
    let profileImageUrl = defaultProfilePic;

    if (imageUri) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageRef = ref(storage, `profileImages/${Date.now()}-profile.jpg`);
      await uploadBytes(imageRef, blob);
      profileImageUrl = await getDownloadURL(imageRef);
    }

    const userData = {
      ...user,
      profileImageUrl,
    };

    // Använd "user" som endpoint
    await axios.post(`${rootUrl}/user.json`, userData);
    console.log("Användardata har sparats framgångsrikt.");
  } catch (error) {
    console.error("Fel vid sparande av användare:", error);
  }
};

const changePic = async (user, imageUri) => {
  try {
    // Logik för att byta profilbild om det behövs

    await axios.put(`${rootUrl}/user/${user.id}.json`);
    console.log(user.id);
  } catch (error) {
    console.error("Fel vid uppdatering av användarbild:", error);
  }
};

const getUser = async (username) => {
  try {
    const response = await axios.get(`${rootUrl}/user.json`);
    const users = response.data;

    for (const key in users) {
      if (users[key].username === username) {
        return { ...users[key], id: key };
      }
    }
    return null;
  } catch (error) {
    console.error("Fel vid hämtning av användare:", error);
    return null;
  }
};

const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${rootUrl}/user.json`);
    const users = response.data;
    return Object.keys(users).map((key) => ({
      ...users[key],
      username: users[key].username,
    }));
  } catch (error) {
    console.error("Fel vid hämtning av användare:", error);
    return null;
  }
};

const storeHunt = async (huntData, imageUri = null) => {
  try {
    let huntImageUrl = null;

    if (imageUri) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageRef = ref(storage, `huntImages/${Date.now()}-hunt.jpg`);
      await uploadBytes(imageRef, blob);
      huntImageUrl = await getDownloadURL(imageRef);
    }

    const completeHuntData = {
      ...huntData,
      huntImageUrl,
    };

    const response = await axios.post(
      `${rootUrl}/hunts.json`,
      completeHuntData
    );
    console.log("Hunt saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error storing hunt:", error);
    throw error;
  }
};

// Exportera alla funktioner som används i ditt projekt
export { storeUser, getUser, fetchAllUsers, storeHunt, changePic };
