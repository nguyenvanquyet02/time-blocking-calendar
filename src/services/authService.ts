import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    type User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import type {
    LoginCredentials,
    RegisterCredentials,
    UserProfile,
} from "../types/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export const authService = {
    async register({
        email,
        password,
        displayName,
    }: RegisterCredentials): Promise<UserProfile> {
        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );
        const firebaseUser = credential.user;
        // Cập nhật displayName lên firebase auth
        await updateProfile(firebaseUser, { displayName });

        const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || email,
            displayName: displayName || firebaseUser.displayName || "",
            role: "user",
            createdAt: new Date().toISOString(),
        };

        // Lưu vào Firestore collection 'users' với ID là uid
        await setDoc(doc(db, "users", firebaseUser.uid), {
            ...newProfile,
            createdAt: serverTimestamp(),
        });

        return newProfile;
    },

    async login({ email, password }: LoginCredentials): Promise<UserProfile> {
        const credential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
        );
        let profile = await this.getUserProfile(credential.user.uid);

        // Cơ chế Fallback/Self-healing: Nếu tài khoản đã có trên Firebase Auth
        // nhưng document Firestore bị thiếu (ví dụ do lỗi Rules trước đó khi đăng ký)
        if (!profile) {
            profile = {
                uid: credential.user.uid,
                email: credential.user.email || email,
                displayName: credential.user.displayName || email.split("@")[0],
                role: "user",
                createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, "users", credential.user.uid), {
                ...profile,
                createdAt: serverTimestamp(),
            });
        }
        return profile;
    },

    async logout(): Promise<void> {
        await signOut(auth);
    },

    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                uid,
                email: data.email,
                displayName: data.displayName,
                photoURL: data.photoURL,
                role: data.role || "user",
                createdAt: data.createdAt?.toDate
                    ? data.createdAt.toDate().toISOString()
                    : data.createdAt,
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
                email: firebaseUser.email || "",
                displayName: firebaseUser.displayName || "Google User",
                photoURL: firebaseUser.photoURL || undefined,
                role: "user",
                createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, "users", firebaseUser.uid), {
                ...profile,
                createdAt: serverTimestamp(),
            });
        }
        return profile;
    },

    subscribeToAuth(callback: (user: UserProfile | null) => void): () => void {
        return onAuthStateChanged(
            auth,
            async (firebaseUser: FirebaseUser | null) => {
                if (firebaseUser) {
                    try {
                        let profile = await this.getUserProfile(
                            firebaseUser.uid,
                        );
                        if (!profile) {
                            profile = {
                                uid: firebaseUser.uid,
                                email: firebaseUser.email || "",
                                displayName:
                                    firebaseUser.displayName ||
                                    firebaseUser.email?.split("@")[0] ||
                                    "User",
                                role: "user",
                                createdAt: new Date().toISOString(),
                            };
                            await setDoc(doc(db, "users", firebaseUser.uid), {
                                ...profile,
                                createdAt: serverTimestamp(),
                            });
                        }
                        callback(profile);
                    } catch (error) {
                        console.error(
                            "Lỗi khi tải hoặc tạo profile Firestore:",
                            error,
                        );
                        callback(null);
                    }
                } else {
                    callback(null);
                }
            },
        );
    },
};
