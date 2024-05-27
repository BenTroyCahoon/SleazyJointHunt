import axios from "axios";

const rootUrl =
  "https://sleazyjointhunt-default-rtdb.europe-west1.firebasedatabase.app/";

const storeUser = async (user) => {
  try {
    await axios.post(`${rootUrl}/users.json`, user);
  } catch (error) {
    console.error("Error storing user:", error);
  }
};

const getUser = async (username) => {
  try {
    const response = await axios.get(`${rootUrl}/user.json`);
    console.log("1",response)
    const users = response.data;
    console.log("2",users)
    const user = {}
    for (const key in users) {
      console.log("3", users[key])
      if (users[key]["username"] === username) {
        user.username = users[key]["username"]
        user.password = users[key]["password"]
        user.email = users[key]["email"]
        return user
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export { storeUser, getUser };
