import { firebase_app } from "../config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

const login = async (email, password) => {
    let result = null,
    error = null;

    try {
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (err){
        error = err;
    }
    return {result, error};
}

export default login;