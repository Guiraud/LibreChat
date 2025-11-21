# 🖥️ LibreChat Desktop - Guide de Démarrage Rapide

## Pour votre Mac M4 Pro

Ce guide vous montre comment créer une application desktop macOS pour LibreChat, installable via DMG comme Claude Desktop ou ChatGPT.

---

## ⚡ Installation en 3 étapes

### 1️⃣ Installer les dépendances

```bash
npm install
```

### 2️⃣ Construire l'application

```bash
# Pour Apple Silicon (M1/M2/M3/M4) - Recommandé pour M4 Pro
npm run desktop:build:arm64
```

⏱️ **Durée** : 5-10 minutes (selon votre machine)

Le script va :
- ✅ Compiler tous les packages
- ✅ Construire le frontend React
- ✅ Installer les dépendances Electron
- ✅ Créer le fichier DMG

### 3️⃣ Installer l'application

Le fichier DMG sera créé dans `dist-desktop/` :

```bash
# Ouvrir le dossier
open dist-desktop/
```

Ensuite :
1. **Double-cliquez** sur `LibreChat-*.dmg`
2. **Glissez-déposez** LibreChat dans Applications
3. **Lancez** LibreChat depuis le Launchpad

---

## 🎨 Ajouter une icône (Optionnel)

Par défaut, l'application utilisera l'icône Electron. Pour personnaliser :

### Option rapide : Utiliser l'icône existante

```bash
# Si vous avez une icône PNG (512x512 ou plus)
cd desktop/build

# Convertir en .icns (macOS uniquement)
mkdir LibreChat.iconset

# Créer les différentes tailles (utilisez Preview.app ou ImageMagick)
# Puis :
iconutil -c icns LibreChat.iconset -o icon.icns
```

### Option simple : Service en ligne

1. Allez sur https://cloudconvert.com/png-to-icns
2. Uploadez votre logo PNG (min 1024x1024)
3. Téléchargez le fichier `.icns`
4. Placez-le dans `desktop/build/icon.icns`
5. Re-build l'application

📖 **Documentation complète** : `desktop/build/ICON_README.md`

---

## 🚀 Commandes Disponibles

```bash
# Build pour Apple Silicon (M4 Pro)
npm run desktop:build:arm64

# Build pour Intel
npm run desktop:build:x64

# Build universel (arm64 + x64) - plus lourd
npm run desktop:build:universal

# Build automatique (détecte votre architecture)
npm run desktop:build

# Mode développement
npm run desktop:dev
```

---

## ⚙️ Configuration

### Première utilisation

Au premier lancement, l'application :
- Démarre le serveur backend automatiquement
- Utilise la configuration par défaut
- Créée une base de données locale

### Ajouter vos clés API

1. Créez un fichier de configuration :

```bash
mkdir -p ~/.librechat
cp .env.example ~/.librechat/.env
```

2. Éditez `~/.librechat/.env` :

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-...

# Google (Gemini)
GOOGLE_API_KEY=...
```

3. Redémarrez l'application

---

## 🛠️ Fonctionnalités Desktop

✅ **Menu natif macOS** avec tous les raccourcis standards
✅ **Barre de titre native** avec style macOS
✅ **Support Dark Mode** automatique
✅ **Backend intégré** - pas besoin de Docker
✅ **Base de données locale** - fonctionne offline
✅ **Raccourcis clavier** (⌘C, ⌘V, ⌘W, etc.)
✅ **Mode plein écran** natif
✅ **DevTools** intégrés (⌘⌥I)

---

## 🐛 Problèmes Courants

### "App is damaged" au premier lancement

```bash
xattr -cr /Applications/LibreChat.app
```

### Port 3080 déjà utilisé

```bash
# Trouver le processus
lsof -i :3080

# Arrêter le processus
kill -9 <PID>
```

### Réinitialiser la base de données

```bash
rm -rf ~/.librechat/data
```

---

## 📊 Spécifications

| Caractéristique | Valeur |
|----------------|--------|
| **Taille du DMG** | ~200-300 MB |
| **Taille installée** | ~500-700 MB |
| **Mémoire requise** | 512 MB min, 2 GB recommandé |
| **macOS minimum** | 10.15 (Catalina) |
| **Architecture** | Apple Silicon & Intel |
| **Temps de démarrage** | 3-5 secondes |

---

## 📚 Documentation Complète

- **README Desktop** : `desktop/README.md`
- **Configuration Icônes** : `desktop/build/ICON_README.md`
- **Documentation LibreChat** : https://docs.librechat.ai

---

## 💡 Prochaines Étapes

Après l'installation, vous pouvez :

1. ✅ Configurer vos clés API
2. ✅ Personnaliser l'interface dans `librechat.yaml`
3. ✅ Activer les fonctionnalités avancées (Agents, RAG, etc.)
4. ✅ Configurer l'authentification multi-utilisateurs
5. ✅ Ajouter des endpoints personnalisés

---

**🎉 Profitez de LibreChat sur votre M4 Pro !**

Pour toute question : https://github.com/danny-avila/LibreChat/issues
