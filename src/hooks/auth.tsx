import asyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Alert } from "react-native";

type User = {
  id: string;
  name: string;
  isAdmin: boolean;
};

type AuthContextDataProps = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  loading: boolean;
  user: User | null;
};

type AuthProviderProps = {
  children: ReactNode;
};

const USER_COLLECTION = "@gopizza:users";

export const AuthContext = createContext({} as AuthContextDataProps);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const forgotPassword = async (email: string) => {
    if (!email) {
      return Alert.alert("Redefinir senha", "Informe o e-mail.");
    }

    await auth()
      .sendPasswordResetEmail(email)
      .then(() =>
        Alert.alert("Redefinir senha", "Enviamos um link no seu e-mail para redefinição sua senha.")
      )
      .catch(() =>
        Alert.alert("Redefinir senha", "Não foi possível e-mail para redefinição sua senha.")
      );
  };

  const signOut = async () => {
    await auth()
      .signOut()
      .then(() => {
        setUser(null);
        asyncStorage.removeItem(USER_COLLECTION);
      })
      .catch((error) => console.log(error));
  };

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      return Alert.alert("Login", "Informe o e-mail e senha.");
    }

    setLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (value) => {
        firestore()
          .collection("users")
          .doc(value.user.uid)
          .get()
          .then(async (profile) => {
            const { name, isAdmin } = profile.data() as User;

            if (profile.exists) {
              const data = {
                id: profile.id,
                name,
                isAdmin,
              };

              await asyncStorage.setItem(USER_COLLECTION, JSON.stringify(data));
              setUser(data);
            }
          })
          .catch(() => {
            Alert.alert("Login", "Não foi possível buscar informções do usuário.");
          });
      })
      .catch((error) => {
        const { code } = error;

        if (code === "auth/user-not-found" || code === "auth/wrong-password") {
          return Alert.alert("Login", "E-mail ou senha inválida.");
        } else {
          return Alert.alert("Login", "Não foi possível realizar o login.");
        }
      })
      .finally(() => setLoading(false));
  };

  const loadUserStorageData = async () => {
    setLoading(true);

    const storedUser = await asyncStorage.getItem(USER_COLLECTION);

    if (storedUser) {
      const data = JSON.parse(storedUser) as User;
      setUser(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut, forgotPassword, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

export { AuthProvider, useAuth };
