import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { User, UserRole } from '../types';

// Interface pour les données de création d'utilisateur
interface CreateUserData extends Omit<User, 'id'> {
  password: string;
}

export class UserService {
  private collectionName = 'users';

  // Créer un nouvel utilisateur
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      // 1. Créer le compte Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const firebaseUserId = userCredential.user.uid;

      // 2. Créer le document utilisateur dans Firestore
      const userDoc = {
        firebaseUid: firebaseUserId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        position: userData.position,
        isActive: true,
        hireDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...((userData as any).phone && { phone: (userData as any).phone }),
        ...((userData as any).address && { address: (userData as any).address }),
        ...((userData as any).birthDate && { birthDate: (userData as any).birthDate })
      };

      const docRef = await addDoc(collection(db, this.collectionName), userDoc);

      // 3. Envoyer un email de réinitialisation pour que l'utilisateur définisse son mot de passe
      await sendPasswordResetEmail(auth, userData.email);

      return {
        id: docRef.id,
        ...userDoc
      } as User;
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      
      // Messages d'erreur personnalisés
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Cette adresse email est déjà utilisée');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Le mot de passe est trop faible');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Adresse email invalide');
      }
      
      throw new Error('Erreur lors de la création de l\'utilisateur');
    }
  }

  // Récupérer tous les utilisateurs
  async getUsers(): Promise<User[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const users: User[] = [];

      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        } as User);
      });

      return users;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }
  }

  // Récupérer un utilisateur par ID
  async getUserById(id: string): Promise<User | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('firebaseUid', '==', id)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as User;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(userData: Partial<User> & { id: string }): Promise<User> {
    try {
      const userRef = doc(db, this.collectionName, userData.id);
      const { id, ...updateData } = userData;
      
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      
      // Return updated user
      const updatedDoc = await getDoc(userRef);
      if (!updatedDoc.exists()) {
        throw new Error('Utilisateur non trouvé après mise à jour');
      }
      
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as User;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw new Error('Impossible de mettre à jour l\'utilisateur');
    }
  }

  // Supprimer un utilisateur
  async deleteUser(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, userId));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw new Error('Impossible de supprimer l\'utilisateur');
    }
  }

  // Récupérer les utilisateurs par rôle
  async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('role', '==', role),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const users: User[] = [];

      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        } as User);
      });

      return users;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs par rôle:', error);
      throw new Error('Erreur lors de la récupération des utilisateurs par rôle');
    }
  }

  // Récupérer les utilisateurs par département
  async getUsersByDepartment(department: string): Promise<User[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('department', '==', department),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const users: User[] = [];

      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        } as User);
      });

      return users;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs par département:', error);
      throw new Error('Erreur lors de la récupération des utilisateurs par département');
    }
  }

  // Activer/désactiver un utilisateur
  async toggleUserStatus(id: string, isActive: boolean): Promise<void> {
    try {
      const userRef = doc(db, this.collectionName, id);
      await updateDoc(userRef, {
        isActive,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut de l\'utilisateur:', error);
      throw new Error('Erreur lors du changement de statut de l\'utilisateur');
    }
  }
}

export const userService = new UserService();
