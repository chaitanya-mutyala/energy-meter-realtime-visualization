import { auth } from "../store/fire"; // Adjust this path to your firebase config file
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile,
    onAuthStateChanged
} from "firebase/auth";

export class AuthService {
    // Create user account and immediately log them in
    async createAccount({ email, password, name }) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Firebase doesn't take 'name' during creation; it requires a separate profile update
            if (name) {
                await updateProfile(userCredential.user, {
                    displayName: name
                });
            }

            // Automatically login after creating account (Firebase does this natively, 
            // but we return the user to match your old Appwrite flow)
            return userCredential.user;
        } catch (err) {
            throw err;
        }
    }

    // Login
    async login({ email, password }) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user; // Returning user as the "session" equivalent
        } catch (err) {
            throw err;
        }
    }

    // Get current logged-in user
    async getCurrentUser() {
        try {
            // Firebase auth state is asynchronous on page reload. 
            // We wrap it in a Promise so it doesn't accidentally return null before initializing.
            return new Promise((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(
                    auth,
                    (user) => {
                        unsubscribe(); // Stop listening once we get the initial state
                        resolve(user || null);
                    },
                    reject
                );
            });
        } catch (err) {
            console.log("Not logged in:", err);
            return null;
        }
    }

    // Logout (delete all sessions)
    async logout() {
        try {
            await signOut(auth);
            return true;
        } catch (err) {
            console.log("Logout error:", err);
        }
    }
}

const authService = new AuthService();
export default authService;