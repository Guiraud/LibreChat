# 🔧 Guide de Dépannage - LibreChat Desktop

Ce guide résout les problèmes courants lors du build de l'application desktop.

---

## ⚡ Fix Rapide pour les Erreurs Courantes

```bash
# À la racine du projet
./desktop/fix-app-builder.sh
```

Ce script répare automatiquement les problèmes d'app-builder.

---

## ❌ Erreur: "spawn app-builder_arm64 ENOENT"

### Symptôme
```
⨯ spawn /path/to/node_modules/app-builder-bin/mac/app-builder_arm64 ENOENT
failedTask=build
```

### Cause
Le binaire `app-builder` (utilisé par electron-builder) est manquant ou n'a pas les bonnes permissions.

### Solutions

#### Solution 1: Script de Fix Automatique (Recommandé)
```bash
# À la racine du projet
./desktop/fix-app-builder.sh

# Puis retry le build
npm run desktop:build:arm64
```

#### Solution 2: Fix Manuel
```bash
# À la racine du projet
rm -rf node_modules/app-builder-bin
npm install app-builder-bin@4.0.0 --save-dev --legacy-peer-deps

# Vérifier l'installation
ls -la node_modules/app-builder-bin/mac/

# Donner les permissions
chmod +x node_modules/app-builder-bin/mac/app-builder_arm64

# Retry le build
npm run desktop:build:arm64
```

#### Solution 3: Clean Install
```bash
# Nettoyer complètement
rm -rf node_modules/ package-lock.json
rm -rf desktop/node_modules/

# Réinstaller
npm install

# Rebuild
npm run desktop:build:arm64
```

---

## ❌ Erreur: "Cannot compute electron version"

### Symptôme
```
⨯ Cannot compute electron version from installed node modules
```

### Cause
Les dépendances Electron ne sont pas installées ou ne peuvent pas être téléchargées.

### Solutions

#### Solution 1: Utiliser le script de build (Recommandé)
Le script de build gère automatiquement ce problème :

```bash
npm run desktop:build:arm64
```

Le script va :
- ✅ Installer les dépendances avec `ELECTRON_SKIP_BINARY_DOWNLOAD=1`
- ✅ Laisser electron-builder télécharger Electron pendant le build

#### Solution 2: Installation manuelle avec skip
```bash
cd desktop
ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm install
cd ..
npm run desktop:build:arm64
```

#### Solution 3: Utiliser npx directement
Si vous avez déjà build le frontend :

```bash
# Depuis la racine du projet
cd desktop
npx electron-builder --mac --arm64 --config electron-builder.config.js
```

---

## 🌐 Erreur 403 lors du téléchargement d'Electron

### Symptôme
```
HTTPError: Response code 403 (Forbidden)
at Request._onResponseBase
```

### Causes possibles
- Restrictions réseau/firewall
- VPN ou proxy
- Problème avec le miroir Electron

### Solutions

#### Solution 1: Configurer un miroir Electron (Chine, entreprise)
```bash
# Ajouter à votre .npmrc ou .zshrc / .bashrc
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
export ELECTRON_CUSTOM_DIR="32.2.8"

npm run desktop:build:arm64
```

#### Solution 2: Utiliser un VPN différent
Si vous utilisez un VPN, essayez de :
- Le désactiver temporairement
- Changer de serveur VPN
- Utiliser un VPN différent

#### Solution 3: Build sans installation préalable
```bash
# Le script gère ça automatiquement
npm run desktop:build:arm64
```

---

## 📦 Erreur: "Cannot find module 'electron'"

### Symptôme
```
Error: Cannot find module 'electron'
```

### Solution
```bash
# Installer les dépendances desktop manuellement
cd desktop
npm install --legacy-peer-deps
cd ..

# Ou utiliser le script
npm run desktop:build:arm64
```

---

## 🖼️ Warning: Icon files not found

### Symptôme
```
WARNING: Icon file not found: desktop/build/icon.icns
```

### Solution
L'application va quand même se construire avec l'icône par défaut d'Electron.

Pour ajouter une icône personnalisée :

1. **Créer l'icône** :
   ```bash
   # Avec un PNG source (1024x1024)
   # Suivez le guide dans desktop/build/ICON_README.md
   ```

2. **Option rapide - Service en ligne** :
   - Allez sur https://cloudconvert.com/png-to-icns
   - Uploadez votre logo PNG
   - Téléchargez le .icns
   - Placez-le dans `desktop/build/icon.icns`

3. **Rebuild** :
   ```bash
   npm run desktop:build:arm64
   ```

---

## 💾 Erreur: "ENOSPC: no space left on device"

### Symptôme
```
Error: ENOSPC: no space left on device
```

### Solution
```bash
# Nettoyer les builds précédents
rm -rf dist-desktop/
rm -rf desktop/node_modules/
rm -rf client/dist/

# Nettoyer le cache npm
npm cache clean --force

# Rebuild
npm run desktop:build:arm64
```

Espace requis : **~3-5 GB** pendant le build

---

## 🔐 Erreur: "App is damaged" au lancement

### Symptôme
macOS dit "LibreChat.app is damaged and can't be opened"

### Solution
```bash
# Supprimer l'attribut de quarantaine
xattr -cr /Applications/LibreChat.app

# Ou via Terminal
sudo xattr -rd com.apple.quarantine /Applications/LibreChat.app
```

### Pourquoi ?
L'application n'est pas signée. Pour une vraie distribution, il faudrait :
- Un certificat Apple Developer
- Signer l'app avec `codesign`
- Notariser l'app avec Apple

---

## 🚫 Erreur: Port 3080 already in use

### Symptôme
L'application ne démarre pas, dit que le port est déjà utilisé.

### Solution
```bash
# Trouver le processus qui utilise le port
lsof -i :3080

# Tuer le processus (remplacer <PID> par le numéro)
kill -9 <PID>

# Ou tuer tous les processus Node
pkill -9 node

# Relancer l'application
```

---

## 🗄️ Problèmes de base de données

### Symptôme
Erreurs au démarrage concernant MongoDB, ou conversations vides

### Solution
```bash
# Réinitialiser la base de données locale
rm -rf ~/.librechat/data

# Relancer l'application - elle recréera la DB
```

### Configuration MongoDB externe
Si vous voulez utiliser MongoDB externe :

```bash
# Créer ~/.librechat/.env
mkdir -p ~/.librechat
nano ~/.librechat/.env
```

Ajouter :
```env
MONGO_URI=mongodb://localhost:27017/librechat
# Ou MongoDB Atlas
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/librechat
```

---

## 🔨 Build très lent

### Symptôme
Le build prend plus de 20-30 minutes

### Solutions

#### 1. Désactiver les optimisations temporairement
Éditez `desktop/electron-builder.config.js` :

```js
compression: 'normal', // au lieu de 'maximum'
```

#### 2. Build sans packages si vous avez déjà build
```bash
# Si vous avez déjà fait un build complet une fois
cd desktop
npx electron-builder --mac --arm64 --config electron-builder.config.js
```

#### 3. Utiliser un build incrémental
```bash
# Ne rebuilder que le client
npm run build:client

# Puis electron directement
cd desktop
npx electron-builder --mac --arm64 --config electron-builder.config.js
```

---

## 🧪 Mode développement ne fonctionne pas

### Symptôme
```bash
npm run desktop:dev
# Ne lance pas l'application
```

### Solution
```bash
# Lancer le backend et frontend d'abord
npm run backend:dev &  # Terminal 1
npm run frontend:dev & # Terminal 2

# Attendre que le backend démarre (port 3080)
# Puis dans un 3e terminal :
cd desktop
npm install  # Si pas déjà fait
npm run start
```

---

## 📋 Vérifier la configuration

### Script de diagnostic
Créez un fichier `check-desktop.sh` :

```bash
#!/bin/bash

echo "🔍 LibreChat Desktop - Diagnostic"
echo ""

echo "📦 Checking Node.js..."
node --version

echo "📦 Checking npm..."
npm --version

echo "📦 Checking architecture..."
uname -m

echo "📁 Checking frontend build..."
ls -lh client/dist/index.html 2>/dev/null && echo "✅ Frontend built" || echo "❌ Frontend not built"

echo "📁 Checking desktop dependencies..."
ls -d desktop/node_modules 2>/dev/null && echo "✅ Desktop deps installed" || echo "❌ Desktop deps not installed"

echo "📁 Checking electron-builder..."
which electron-builder 2>/dev/null && echo "✅ electron-builder found" || echo "❌ electron-builder not found"

echo ""
echo "🎯 Recommended next step:"
echo "   npm run desktop:build:arm64"
```

```bash
chmod +x check-desktop.sh
./check-desktop.sh
```

---

## 🆘 Toujours des problèmes ?

### 1. Build propre complet
```bash
# Nettoyer tout
rm -rf node_modules/
rm -rf client/dist/
rm -rf desktop/node_modules/
rm -rf dist-desktop/
npm cache clean --force

# Réinstaller et rebuild
npm install
npm run desktop:build:arm64
```

### 2. Vérifier les prérequis
- **macOS**: 10.15 (Catalina) ou supérieur
- **Node.js**: 18.x ou supérieur
- **npm**: 9.x ou supérieur
- **Espace disque**: 5 GB libre minimum
- **RAM**: 4 GB minimum (8 GB recommandé)

### 3. Logs détaillés
```bash
# Build avec logs verbeux
DEBUG=electron-builder npm run desktop:build:arm64
```

### 4. Obtenir de l'aide
- **Issues GitHub**: https://github.com/danny-avila/LibreChat/issues
- **Discord**: https://discord.librechat.ai
- **Documentation**: https://docs.librechat.ai

---

## 📚 Ressources additionnelles

- [electron-builder documentation](https://www.electron.build/)
- [Electron documentation](https://www.electronjs.org/docs/latest/)
- [LibreChat documentation](https://docs.librechat.ai/)
- [Apple Developer - App Distribution](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases)

---

## 💡 Astuces Pro

### Build plus rapide pour le développement
```bash
# Créer un alias dans ~/.zshrc ou ~/.bashrc
alias lc-desktop-quick='cd desktop && npx electron-builder --mac --arm64 --config electron-builder.config.js --dir'
```

Le flag `--dir` crée un dossier au lieu d'un DMG (beaucoup plus rapide).

### Auto-rebuild frontend
```bash
# Dans un terminal, watch le frontend
npm run frontend:dev

# Dans un autre, rebuild electron quand le frontend change
fswatch -o client/dist/ | xargs -n1 -I{} npm run desktop:build:arm64
```

---

**Dernière mise à jour** : 2025-11-16
