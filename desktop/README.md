# LibreChat Desktop Application

Application de bureau native macOS pour LibreChat, compatible avec Apple Silicon (M1/M2/M3/M4).

## 📋 Prérequis

- **Node.js** 18.x ou supérieur
- **npm** 9.x ou supérieur
- **macOS** 10.15 (Catalina) ou supérieur
- Au moins **2 GB** d'espace disque libre

## 🚀 Installation rapide

### Option 1 : Build automatique (Recommandé)

```bash
# À la racine du projet LibreChat
npm install
npm run desktop:build
```

Le script va automatiquement :
1. ✅ Construire tous les packages
2. ✅ Construire le frontend React
3. ✅ Installer les dépendances Electron
4. ✅ Créer le fichier DMG

Le fichier DMG sera créé dans `dist-desktop/`.

### Option 2 : Build pour architecture spécifique

```bash
# Pour Apple Silicon (M1/M2/M3/M4) - Recommandé pour M4 Pro
npm run desktop:build:arm64

# Pour Intel (x64)
npm run desktop:build:x64

# Universal (arm64 + x64) - fichier plus lourd
npm run desktop:build:universal
```

## 📦 Installation de l'application

Une fois le DMG créé :

1. Double-cliquez sur le fichier `.dmg` dans `dist-desktop/`
2. Glissez-déposez **LibreChat** dans le dossier **Applications**
3. Lancez LibreChat depuis le Launchpad ou le dossier Applications
4. Au premier lancement, faites clic droit > Ouvrir (à cause de Gatekeeper)

## ⚙️ Configuration

### Première utilisation

Au premier lancement, l'application va :
- Démarrer le serveur backend Node.js localement
- Créer les fichiers de configuration si nécessaire
- Ouvrir l'interface dans une fenêtre native

### Variables d'environnement

Copiez `.env.example` vers `~/.librechat/.env` et configurez :

```bash
# Créer le dossier de configuration
mkdir -p ~/.librechat

# Copier le fichier d'exemple
cp .env.example ~/.librechat/.env

# Éditer avec vos clés API
nano ~/.librechat/.env
```

Variables importantes :
```env
# OpenAI
OPENAI_API_KEY=your_key_here

# Anthropic
ANTHROPIC_API_KEY=your_key_here

# MongoDB (optionnel, utilise une base locale par défaut)
MONGO_URI=mongodb://localhost:27017/librechat

# Autres configurations...
```

### Configuration avancée

Le fichier `librechat.yaml` peut être placé dans `~/.librechat/` pour une configuration personnalisée.

## 🛠️ Développement

### Mode développement

```bash
# Terminal 1 : Démarrer le backend
npm run backend:dev

# Terminal 2 : Démarrer le frontend
npm run frontend:dev

# Terminal 3 : Démarrer Electron
npm run desktop:dev
```

### Structure du projet desktop

```
desktop/
├── main.js              # Processus principal Electron
├── preload.js           # Script de préchargement (sécurité)
├── loading.html         # Écran de chargement
├── package.json         # Dépendances desktop
├── electron-builder.config.js  # Configuration du build
├── build/
│   ├── icon.icns       # Icône macOS
│   ├── icon.png        # Icône générique
│   └── entitlements.mac.plist  # Permissions macOS
└── README.md           # Ce fichier
```

## 🔧 Fonctionnalités

### Fonctionnalités desktop natives

- ✅ **Menu natif macOS** avec raccourcis clavier
- ✅ **Barre de titre native** avec boutons macOS
- ✅ **Support Dark Mode** automatique
- ✅ **Notifications** du système
- ✅ **Raccourcis clavier** standards macOS (⌘C, ⌘V, etc.)
- ✅ **Mode plein écran** natif
- ✅ **Zoom** (⌘+ / ⌘-)
- ✅ **Outils de développement** (⌘⌥I)

### Backend embarqué

- Le serveur Node.js démarre automatiquement avec l'application
- Pas besoin de Docker ou de configuration externe
- Base de données locale (MongoDB embarqué ou SQLite)
- Redémarre automatiquement en cas d'erreur

## 🐛 Dépannage

### L'application ne démarre pas

1. Vérifiez les logs dans Console.app (filtre : "LibreChat")
2. Assurez-vous d'avoir les permissions nécessaires
3. Essayez de réinstaller l'application

### Erreur "App is damaged"

```bash
# Supprimer la quarantaine
xattr -cr /Applications/LibreChat.app
```

### Erreur de port déjà utilisé

Si le port 3080 est déjà utilisé :

```bash
# Trouver le processus
lsof -i :3080

# Tuer le processus
kill -9 <PID>
```

### Base de données

Pour réinitialiser la base de données :

```bash
rm -rf ~/.librechat/data
```

## 📊 Taille et performances

- **Taille du DMG** : ~200-300 MB (selon l'architecture)
- **Taille installée** : ~500-700 MB
- **Mémoire requise** : 512 MB minimum, 2 GB recommandé
- **Démarrage** : 3-5 secondes

## 🔐 Sécurité

L'application utilise :
- **Context Isolation** d'Electron pour la sécurité
- **Preload script** pour une communication sécurisée
- **Pas d'accès Node.js** depuis le renderer
- **Content Security Policy** strict
- **Hardened Runtime** pour macOS

## 📝 Scripts disponibles

Depuis la racine du projet :

```bash
# Build
npm run desktop:build              # Build automatique (détecte l'architecture)
npm run desktop:build:arm64        # Build pour Apple Silicon
npm run desktop:build:x64          # Build pour Intel
npm run desktop:build:universal    # Build universel (les deux)

# Développement
npm run desktop:dev                # Lancer en mode dev
```

## 🆘 Support

- 📚 **Documentation** : https://docs.librechat.ai
- 💬 **Discord** : https://discord.librechat.ai
- 🐛 **Issues** : https://github.com/danny-avila/LibreChat/issues
- 🌐 **Site web** : https://librechat.ai

## 📄 Licence

ISC License - Voir le fichier LICENSE à la racine du projet

---

**Note pour M4 Pro** : Utilisez `npm run desktop:build:arm64` pour des performances optimales sur votre Mac M4 Pro.
