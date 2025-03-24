import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getUsers = async () => {
  try {
    const usersRef = collection(db, "patients");
    const usersSnapshot = await getDocs(usersRef);

    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getDoctors = async () => {
  try {
    const doctorsRef = collection(db, "doctors");
    const doctorsSnapshot = await getDocs(doctorsRef);

    const doctors = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return doctors;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};
