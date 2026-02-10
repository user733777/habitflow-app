# Guide de génération de l'APK Trackflow

## Prérequis
✅ Android Studio est déjà installé
✅ Capacitor est configuré
✅ L'authentification est automatique (pas de login requis)

## Étapes pour générer l'APK

### 1. Ouvrir le projet Android
```bash
npm run android
```

Cette commande va :
- Synchroniser les fichiers web avec Android
- Ouvrir Android Studio avec le projet

### 2. Dans Android Studio

#### Configuration initiale (première fois)
1. **Installer le SDK Android** (si demandé)
   - Aller dans `Tools` → `SDK Manager`
   - Installer `Android 13.0 (Tiramisu)` ou supérieur
   - Installer `Android SDK Build-Tools`

2. **Configurer Gradle** (attendez que Gradle Sync se termine automatiquement)

#### Générer l'APK

**Option A : APK de débogage (plus rapide)**
1. Dans Android Studio, cliquer sur `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. Attendre la fin de la compilation (1-5 minutes)
3. Cliquer sur `locate` dans la notification
4. L'APK sera dans : `android/app/build/outputs/apk/debug/app-debug.apk`

**Option B : APK de production (signé)**
1. Générer une clé de signature :
   ```bash
   keytool -genkey -v -keystore trackflow.keystore -alias trackflow -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Dans Android Studio :
   - `Build` → `Generate Signed Bundle / APK`
   - Sélectionner `APK`
   - Choisir votre keystore
   - Sélectionner `release`
   - L'APK sera dans : `android/app/build/outputs/apk/release/app-release.apk`

### 3. Installer l'APK sur votre téléphone

**Méthode 1 : Câble USB**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Méthode 2 : Transfert de fichier**
1. Copier l'APK sur votre téléphone (via câble, cloud, email, etc.)
2. Sur le téléphone :
   - Ouvrir le fichier APK
   - Autoriser l'installation depuis des sources inconnues si demandé
   - Installer

## Modifications apportées

### ✅ Auto-login
L'application ne demande plus de s'authentifier à chaque ouverture. L'utilisateur est automatiquement connecté.

### ✅ Sauvegarde créée
Une sauvegarde complète a été créée avant les modifications dans :
`../trackflow-backup-2026-02-10_XX-XX/`

### ✅ Configuration
- Capacitor 8.0.2 installé
- Projet Android créé
- Export statique Next.js configuré
- Dossier `out/` généré avec l'application web

## Commandes utiles

```bash
# Reconstruire et synchroniser
npm run build
npx cap sync android

# Ouvrir Android Studio
npm run android

# Voir les logs de l'app sur téléphone
adb logcat

# Lister les devices connectés
adb devices
```

## Notes importantes

1. **Première installation** : Vous devrez autoriser les sources inconnues sur votre téléphone Android
2. **Taille de l'APK** : Environ 5-10 MB (debug), 2-5 MB (release)
3. **Compatibilité** : Android 5.0+ (API 21+)
4. **Données** : Stockées localement dans localStorage du navigateur Android
5. **Mises à jour** : Pour mettre à jour l'app, modifiez le code, rebuild, sync et régénérez l'APK

## Dépannage

**Erreur "SDK not found"**
→ Installer Android SDK depuis Android Studio

**Gradle build failed**
→ Nettoyer : `cd android && ./gradlew clean`

**APK ne s'installe pas**
→ Vérifier que l'installation depuis sources inconnues est autorisée
