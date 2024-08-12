import axios from "axios";

const rootUrl =
  "https://sleazyjointhunt-default-rtdb.europe-west1.firebasedatabase.app/";

const storeUser = async (user) => {
  try {
    await axios.post(`${rootUrl}/user.json`, user);
  } catch (error) {
    console.error("Error storing user:", error);
  }
};

/*
const fetchUser = async (user) => {    

  try {
    const response = await axios.get(`${rootUrl}/user.json`);
    const users = response.data;

    if (!users) {
      console.error("No users found in database.");
      return null;
    }

    for (const key in users) {
      if (users[key].username === username) {
        return { ...users[key], id: key };
      }
    }

    console.error(`User ${username} not found.`);

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

// Hämta alla användare från databasen
const fetchAllUsers = async () => {
  try {
      const response = await axios.get(`${rootUrl}/user.json`);
      return response.data;
  } catch (error) {
      console.error("Error fetching users:", error);
      return null;
  }
};

export { storeUser, getUser, fetchAllUsers };

