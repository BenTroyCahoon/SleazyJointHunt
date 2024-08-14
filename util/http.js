// import axios from "axios";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import app from "./fireBaseConfig"; // Importera den initierade Firebase-appen

// const storage = getStorage(app);

// const rootUrl =
//   "https://sleazyjointhunt-default-rtdb.europe-west1.firebasedatabase.app/";

// const storeUser = async (user, imageUri) => {
//   try {
//     let profileImageUrl = null;

//     if (imageUri) {
//       const response = await fetch(imageUri);
//       const blob = await response.blob();
//       const imageRef = ref(storage, `profileImages/${Date.now()}-profile.jpg`);
//       await uploadBytes(imageRef, blob);
//       profileImageUrl = await getDownloadURL(imageRef);
//     }

//     const userData = {
//       ...user,
//       profileImageUrl: profileImageUrl || user.profileImageUrl,
//     };

//     await axios.post(`${rootUrl}/users.json`, userData);
//     console.log("Användardata har sparats framgångsrikt.");
//   } catch (error) {
//     console.error("Fel vid sparande av användare:", error);
//   }
// };

// const getUser = async (username) => {
//   try {
//     const response = await axios.get(`${rootUrl}/user.json`);
//     const user = response.data;

//     for (const key in user) {
//       if (user[key].username === username) {
//         return {
//           username: user[key].username,
//           password: user[key].password,
//           email: user[key].email,
//           profileImageUrl: user[key].profileImageUrl,
//         };
//       }
//     }

//     return null;
//   } catch (error) {
//     console.error("Fel vid hämtning av användare:", error);
//     return null;
//   }
// };

// // Hämta alla användare från databasen
// const fetchAllUsers = async () => {
//   try {
//     const response = await axios.get(`${rootUrl}/user.json`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return null;
//   }
// };

// export { storeUser, getUser, fetchAllUsers };

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

    // Använd "user" som endpoint
    await axios.post(`${rootUrl}/user.json`, userData);
    console.log("Användardata har sparats framgångsrikt.");
  } catch (error) {
    console.error("Fel vid sparande av användare:", error);
  }
};

const getUser = async (username) => {
  try {
    // Använd "user" som endpoint
    const response = await axios.get(`${rootUrl}/user.json`);
    const users = response.data;

    // console.log("Hämtad data från Firebase:", users); // Logga all data som hämtas

    for (const key in users) {
      if (users[key].username === username) {
        console.log("Hittad användare:", users[key]); // Logga användardata
        return { ...users[key], id: key }
        /*return {
          username: users[key].username,
          password: users[key].password,
          email: users[key].email,
          profileImageUrl: users[key].profileImageUrl,
        };*/
      }
    }
    return null;
  } catch (error) {
    console.error("Fel vid hämtning av användare:", error);
    return null;
  }
};


// Hämta alla användare från databasen
const fetchAllUsers = async () => {
  try {
    // Använd "user" som endpoint
    const response = await axios.get(`${rootUrl}/user.json`);
    const users = response.data;
    return Object.keys(users).map(key => ({ ...users[key], username: users[key].username }));
  } catch (error) {
    console.error("Fel vid hämtning av användare:", error);
    return null;
  }
};

const storeHunt = async (huntData) => {
  try {
    const response = await axios.post(`${rootUrl}/hunts.json`, huntData);
    console.log("Hunt saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error storing hunt:", error);
    throw error;
  }
};

export { storeUser, getUser, fetchAllUsers, storeHunt };
