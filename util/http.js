// http.js
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "./fireBaseConfig"; // Importera den initierade Firebase-appen

const storage = getStorage(app);

const rootUrl =
  "https://sleazyjointhunt-default-rtdb.europe-west1.firebasedatabase.app/";

const storeUser = async (user, imageUri) => {
  try {
    let profileImageUrl = null;

    if (imageUri) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageRef = ref(storage, `profileImages/${Date.now()}-profile.jpg`);
      await uploadBytes(imageRef, blob);
      profileImageUrl = await getDownloadURL(imageRef);
    }

    const userData = {
      ...user,
      profileImageUrl: profileImageUrl || user.profileImageUrl,
    };

    await axios.post(`${rootUrl}/users.json`, userData);
    console.log("Användardata har sparats framgångsrikt.");
  } catch (error) {
    console.error("Fel vid sparande av användare:", error);
  }
};

const getUser = async (username) => {
  try {
    const response = await axios.get(`${rootUrl}/users.json`);
    const users = response.data;

    for (const key in users) {
      if (users[key].username === username) {
        return {
          username: users[key].username,
          password: users[key].password,
          email: users[key].email,
          profileImageUrl: users[key].profileImageUrl,
        };
      }
    }

    return null;
  } catch (error) {

    console.error("Error fetching user:", error);
    throw error;
  }
};
*/

const getUser = async (username) => {
    try {
        const response = await axios.get(`${rootUrl}/user.json`);
        const users = response.data;
        console.log(response)
        for (const key in users) {
            if (users[key].username === username) {
                return users[key];
            }
        }
        return null;
    } catch (error) {
        console.error("Error getting user:", error);
        return null;
    }
};

export { storeUser, getUser };

