import { createUserWithEmailAndPassword, GoogleAuthProvider, type User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import type { LoginCredentials, RegisterCredentials, UserProfile } from "../types/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";


export const authService = {
    async register({ email, password, displayName }: RegisterCredentials): Promise<UserProfile> {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        const firebaseUser = credential.user
        // cap nhat displayName len firebase
        await updateProfile(firebaseUser, { displayName });

        const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: 'user',
            createdAt: new Date().toISOString()
        }

        // luu vao firebase store collection users voi ID la uid
        await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...newProfile,
            createdAt: serverTimestamp()
        })

        return newProfile;
    },

    async login({ email, password }: LoginCredentials): Promise<UserProfile> {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const profile = await this.getUserProfile(credential.user.uid);
        if (!profile) {
            throw new Error('Không tìm thấy thông tin tài khoản trên hệ thống.');
        }
        return profile;
    },
    async logout(): Promise<void> {
        await signOut(auth);
    },
    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                uid,
                email: data.email,
                displayName: data.displayName,
                photoURL: data.photoURL,
                role: data.role || 'user',
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
            };
        }
        return null;
    },

    async loginWithGoogle(): Promise<UserProfile> {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);
        const firebaseUser = credential.user;
        let profile = await this.getUserProfile(firebaseUser.uid);
        // Nếu là lần đầu đăng nhập Google -> Khởi tạo profile trên Firestore
        if (!profile) {
            profile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'Google User',
                photoURL: firebaseUser.photoURL || undefined,
                role: 'user',
                createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                ...profile,
                createdAt: serverTimestamp(),
            });
        }
        return profile;
    },

    subscribeToAuth(callback: (user: UserProfile | null) => void): () => void {
        return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                const profile = await this.getUserProfile(firebaseUser.uid);
                callback(profile);
            } else {
                callback(null);
            }
        });
    }
}