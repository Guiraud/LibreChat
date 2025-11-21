# 🚨 Erreurs de Build Desktop - Solutions Rapides

Guide ultra-rapide pour les erreurs courantes lors du build de LibreChat Desktop sur macOS.

---

## 🟢 Build Frontend - Erreur Résolue

### Erreur: "Rollup failed to resolve import lucide-react"

✅ **Déjà corrigé dans ce commit !**

Cette erreur se produit quand Vite ne peut pas résoudre les imports depuis le package workspace `@librechat/client`.

**Si vous voyez encore cette erreur:**
```bash
git pull origin claude/analyze-this-01Tz4kSz4zLfUznreZ8cyjAU
```

---

## 🔴 Erreur: "spawn app-builder_arm64 ENOENT"

### ⚡ Solution en 1 commande

```bash
npm run desktop:fix && npm run desktop:build:arm64
```

### 📝 Explication

Cette erreur signifie que `app-builder` (outil d'electron-builder) est manquant.

**Causes:**
- Installation incomplète de `app-builder-bin`
- Permissions manquantes sur le binaire
- Corruption du package dans node_modules

**Le script de fix va:**
1. ✅ Supprimer app-builder-bin
2. ✅ Le réinstaller proprement
3. ✅ Vérifier l'installation
4. ✅ Configurer les permissions

---

## 📋 Checklist de Dépannage Rapide

Si l'erreur persiste, essayez dans l'ordre :

### ✅ Étape 1: Fix app-builder
```bash
npm run desktop:fix
```

### ✅ Étape 2: Clean install (si Étape 1 échoue)
```bash
rm -rf node_modules/ package-lock.json
npm install
```

### ✅ Étape 3: Vérifier les prérequis
```bash
node --version    # Devrait être >= 18.x
npm --version     # Devrait être >= 9.x
uname -m          # Devrait afficher "arm64" sur M4 Pro
```

### ✅ Étape 4: Build propre
```bash
npm run desktop:build:arm64
```

---

## 🔍 Autres Erreurs Courantes

### "Cannot compute electron version"

**Solution:**
```bash
# Le script de build gère ça automatiquement
npm run desktop:build:arm64
```

**Détails:** `desktop/TROUBLESHOOTING.md` section "Cannot compute electron version"

---

### Erreur 403 lors du téléchargement

**Solution rapide (Chine/Firewall):**
```bash
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
npm run desktop:build:arm64
```

**Détails:** `desktop/TROUBLESHOOTING.md` section "Erreur 403"

---

### "ENOSPC: no space left on device"

**Solution:**
```bash
# Nettoyer
rm -rf dist-desktop/ client/dist/ desktop/node_modules/
npm cache clean --force

# Rebuild
npm run desktop:build:arm64
```

---

### "App is damaged" au lancement

**Solution:**
```bash
sudo xattr -cr /Applications/LibreChat.app
```

---

### Port 3080 déjà utilisé

**Solution:**
```bash
lsof -i :3080 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## 🛠️ Commandes Utiles

### Diagnostic complet
```bash
# Vérifier l'état de tout
echo "Node: $(node --version)"
echo "NPM: $(npm --version)"
echo "Arch: $(uname -m)"
ls -lh client/dist/index.html 2>/dev/null && echo "✅ Frontend OK" || echo "❌ Frontend manquant"
ls -d desktop/node_modules 2>/dev/null && echo "✅ Desktop deps OK" || echo "❌ Desktop deps manquants"
ls -f node_modules/app-builder-bin/mac/app-builder_arm64 2>/dev/null && echo "✅ app-builder OK" || echo "❌ app-builder manquant"
```

### Nettoyer tout et recommencer
```bash
# ATTENTION: Supprime tout et recommence à zéro
rm -rf node_modules/ package-lock.json
rm -rf client/dist/ client/node_modules/
rm -rf desktop/node_modules/ dist-desktop/
rm -rf api/node_modules/
rm -rf packages/*/node_modules/

# Réinstaller proprement
npm install

# Build complet
npm run desktop:build:arm64
```

### Build rapide (sans frontend rebuild)
```bash
# Si le frontend est déjà build
cd desktop
npx electron-builder --mac --arm64 --config electron-builder.config.js
```

---

## 📚 Documentation Complète

Pour des solutions détaillées :

- **Guide complet:** [`desktop/TROUBLESHOOTING.md`](desktop/TROUBLESHOOTING.md)
- **README desktop:** [`desktop/README.md`](desktop/README.md)
- **Quickstart:** [`DESKTOP_QUICKSTART.md`](DESKTOP_QUICKSTART.md)

---

## 💡 Conseils Pro

### 1. Build incrémental pour dev

Si vous développez et avez besoin de rebuilder souvent :

```bash
# Build sans DMG (beaucoup plus rapide)
cd desktop
npx electron-builder --mac --arm64 --dir
```

Le flag `--dir` crée juste un dossier `.app` dans `dist-desktop/mac-arm64/`.

### 2. Éviter les problèmes de réseau

Si vous êtes souvent bloqué par des 403 ou timeouts :

```bash
# Ajouter à ~/.zshrc ou ~/.bashrc
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
export ELECTRON_SKIP_BINARY_DOWNLOAD=1
```

### 3. Cache npm

Pour accélérer les réinstallations :

```bash
# Ne nettoyer le cache qu'en dernier recours
npm cache verify   # Vérifie au lieu de nettoyer
```

---

## 🆘 Toujours Bloqué ?

1. **Vérifiez les logs détaillés:**
   ```bash
   DEBUG=electron-builder npm run desktop:build:arm64 2>&1 | tee build.log
   ```

2. **Cherchez votre erreur exacte dans:**
   - `desktop/TROUBLESHOOTING.md`
   - [Issues GitHub](https://github.com/danny-avila/LibreChat/issues)
   - [Discord LibreChat](https://discord.librechat.ai)

3. **Créez une issue avec:**
   - Votre erreur complète
   - Sortie de `node --version` et `npm --version`
   - Sortie de `uname -a`
   - Contenu de `build.log`

---

## ✨ Build Réussi !

Quand tout fonctionne, vous devriez voir :

```
✓ Building LibreChat-0.8.1-arm64.dmg
╔════════════════════════════════════════════╗
║   ✅ Build completed successfully!        ║
╚════════════════════════════════════════════╝
```

Votre DMG sera dans `dist-desktop/` ! 🎉

---

**Dernière mise à jour:** 2025-11-16
**Pour votre Mac M4 Pro** 🖥️
