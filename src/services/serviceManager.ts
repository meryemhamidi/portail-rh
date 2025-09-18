// Gestionnaire de services avec fallback intelligent
import { userService } from './userService';
import { mockUserService } from './mockUserService';

class ServiceManager {
  private useFirebase = true;
  private firebaseChecked = false;

  // Vérifier si Firebase est disponible
  private async checkFirebaseAvailability(): Promise<boolean> {
    if (this.firebaseChecked) {
      return this.useFirebase;
    }

    try {
      // Test simple de connexion Firebase
      await userService.getUsers();
      this.useFirebase = true;
      this.firebaseChecked = true;
      console.log('✅ Firebase configuré et disponible');
      return true;
    } catch (error) {
      this.useFirebase = false;
      this.firebaseChecked = true;
      console.log('⚠️ Firebase non disponible, utilisation du mode démonstration');
      return false;
    }
  }

  // Service utilisateur avec fallback automatique
  async getUserService() {
    const isFirebaseAvailable = await this.checkFirebaseAvailability();
    return isFirebaseAvailable ? userService : mockUserService;
  }

  // Réinitialiser le check Firebase (utile pour les tests)
  resetFirebaseCheck() {
    this.firebaseChecked = false;
    this.useFirebase = true;
  }

  // Forcer l'utilisation du service mock
  forceMockMode() {
    this.useFirebase = false;
    this.firebaseChecked = true;
  }

  // Vérifier le statut actuel
  getStatus() {
    return {
      firebaseChecked: this.firebaseChecked,
      useFirebase: this.useFirebase,
      currentService: this.useFirebase ? 'Firebase' : 'Mock'
    };
  }
}

export const serviceManager = new ServiceManager();
