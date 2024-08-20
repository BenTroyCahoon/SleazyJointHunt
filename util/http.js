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

const getUserById = async (id) => {
  try {
    if (!id) {
      throw new Error("ID saknas");
    }

    const response = await axios.get(`${rootUrl}/user/${id}.json`);
    if (response.data) {
      return { ...response.data, id }; // Returnera användardata med ID
    }
    return null;
  } catch (error) {
    console.error(
      `Fel vid hämtning av användare med ID ${id}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const updateUserProfileImage = async (userId, imageUri) => {
  try {
    if (!imageUri) {
      throw new Error("Ingen bild att ladda upp.");
    }

    // Ladda upp bilden till Firebase Storage
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const imageRef = ref(storage, `profileImages/${Date.now()}-profile.jpg`);
    await uploadBytes(imageRef, blob);
    const profileImageUrl = await getDownloadURL(imageRef);

    const currentUserResponse = await axios.get(
      `${rootUrl}/user/${userId}.json`
    );
    const currentUserData = currentUserResponse.data;

    await axios.put(`${rootUrl}/user/${userId}.json`, {
      email: currentUserData.email,
      password: currentUserData.password,
      username: currentUserData.username,
      profileImageUrl: profileImageUrl, // Endast profilbilden uppdateras
    });

    return profileImageUrl;
  } catch (error) {
    console.error("Fel vid uppdatering av profilbild:", error);
    throw error;
  }
};

// Hämta alla användare från databasen
const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${rootUrl}/user.json`);
    const users = response.data;
    return Object.keys(users).map((key) => ({
      ...users[key],
      username: users[key].username,
      id: key,
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
      startPoint: huntData.startPoint,
      endPoint: huntData.endPoint,
      markers: huntData.markers,
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

const fetchAllHunts = async (userId) => {
  try {
    const response = await axios.get(`${rootUrl}/hunts.json`);
    const hunts = response.data;

    const userHunts = Object.keys(hunts).map((key) => ({
      ...hunts[key],
      id: key,
    }));

    return userHunts;
  } catch (error) {
    console.error("Error fetching hunts:", error);
    return [];
  }
};

// HÄR JOBBAR DU CARRO 
const fetchActiveHunts = async (userId) => {
  try {
    const allHunts = await fetchAllHunts(userId);
    // console.log('alla hunts: ', allHunts)
    console.log('user ID från http: ', userId)

    const activeHunts = allHunts.filter(hunt => {
      //console.log("Checking Hunt:", hunt); // För att se vad vi jobbar med
      //console.log('inbjudna spelare: ', hunt.invitedUsers)
      return Array.isArray(hunt.invitedUsers) && hunt.invitedUsers.includes(userId);
    });


    //  const test = allHunts[0].invitedUsers.includes("-O4LX634G8loMBOHGv9M")
    return activeHunts;
  } catch (error) {
    console.error("Error fetching active hunts:", error);
    return [];
  }
};

const fetchPlannedHunts = async (userId) => {
  try {
    const response = await axios.get(`${rootUrl}/hunts.json`);
    const hunts = response.data;
    return Object.keys(hunts)
      .map((key) => ({
        ...hunts[key],
        id: key,
      }))
      .filter((hunt) => hunt.creator === userId); // Filtrerar hunts efter skapare
  } catch (error) {
    console.error("Error fetching planned hunts:", error);
    return [];
  }
};

const getHuntById = async (huntId) => {
  try {
    const response = await axios.get(`${rootUrl}/hunts/${huntId}.json`);
    if (response.data) {
      return { ...response.data, id: huntId };
    }
    return null;
  } catch (error) {
    console.error("Error fetching hunt by ID:", error);
    throw error;
  }
};

export {
  storeUser,
  getUser,
  fetchAllUsers,
  storeHunt,
  updateUserProfileImage,
  fetchAllHunts,
  fetchActiveHunts,
  fetchPlannedHunts,
  getHuntById,
  getUserById,
};
