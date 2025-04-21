import { db } from "../firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

// Add a country to the favorites
export const addFavorite = async (userId, countryCode) => {
  try {
    const favoriteRef = doc(db, "users", userId, "favorites", countryCode);
    await setDoc(favoriteRef, { countryCode });
    console.log("Country added to favorites!");
  } catch (error) {
    console.error("Error adding to favorites:", error);
  }
};

// Get all favorites for a user
export const getFavorites = async (userId) => {
  const favoritesCollection = collection(db, "users", userId, "favorites");
  const q = query(favoritesCollection);
  const querySnapshot = await getDocs(q);
  const favorites = querySnapshot.docs.map((doc) => doc.data().countryCode);
  return favorites;
};

// Remove a country from favorites
export const removeFavorite = async (userId, countryCode) => {
  try {
    const favoriteRef = doc(db, "users", userId, "favorites", countryCode);
    await deleteDoc(favoriteRef);
    console.log("Country removed from favorites!");
  } catch (error) {
    console.error("Error removing from favorites:", error);
  }
};
