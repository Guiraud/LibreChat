# Icônes pour LibreChat Desktop

## Fichiers requis

Pour construire l'application macOS, vous avez besoin de :

### macOS
- `icon.icns` - Fichier icône macOS (contient toutes les résolutions)

### Windows (optionnel)
- `icon.ico` - Fichier icône Windows

### Linux (optionnel)
- `icon.png` - Fichier PNG 512x512 ou 1024x1024

## Création des icônes

### Option 1 : Utiliser l'icône existante de LibreChat

Si vous avez une icône PNG du projet :

```bash
# Installer iconutil (déjà installé sur macOS)
# Créer un iconset
mkdir LibreChat.iconset

# Copier et redimensionner les images (utilisez un outil comme ImageMagick ou Preview)
# Créer les fichiers suivants dans LibreChat.iconset/ :
# - icon_16x16.png
# - icon_16x16@2x.png (32x32)
# - icon_32x32.png
# - icon_32x32@2x.png (64x64)
# - icon_128x128.png
# - icon_128x128@2x.png (256x256)
# - icon_256x256.png
# - icon_256x256@2x.png (512x512)
# - icon_512x512.png
# - icon_512x512@2x.png (1024x1024)

# Générer le .icns
iconutil -c icns LibreChat.iconset -o icon.icns
```

### Option 2 : Avec ImageMagick

```bash
# Installer ImageMagick
brew install imagemagick

# À partir d'une image PNG source (source.png)
convert source.png -resize 1024x1024 icon.png

# Pour créer le .icns
mkdir LibreChat.iconset
for size in 16 32 128 256 512; do
  convert source.png -resize ${size}x${size} LibreChat.iconset/icon_${size}x${size}.png
  convert source.png -resize $((size*2))x$((size*2)) LibreChat.iconset/icon_${size}x${size}@2x.png
done

iconutil -c icns LibreChat.iconset -o icon.icns
```

### Option 3 : Utiliser un service en ligne

1. Allez sur https://cloudconvert.com/png-to-icns
2. Téléchargez votre PNG (au moins 1024x1024)
3. Convertissez en .icns
4. Téléchargez et placez dans ce dossier

## Icône temporaire

Si vous n'avez pas encore d'icône, vous pouvez utiliser un placeholder :

1. Créez une icône simple avec Preview.app
2. Ou utilisez une icône générique temporairement
3. Le build fonctionnera sans icône mais l'app aura l'icône par défaut d'Electron

## Emplacement final

Les icônes doivent être placées dans :
```
desktop/build/
├── icon.icns    # macOS (REQUIS pour build macOS)
├── icon.ico     # Windows
└── icon.png     # Linux et générique
```

## Références

- Guide Apple : https://developer.apple.com/design/human-interface-guidelines/app-icons
- Electron Builder : https://www.electron.build/icons
