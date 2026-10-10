#  Charge du Projet - Les Nombres Magiques

##  Objectif Principal
Créer une application web éducative complète en français pour apprendre les nombres et les mathématiques de manière ludique et interactive.

##  Résumé Exigences

### Fonctionnalités Core
- [x] Interface principale avec navigation par onglets (Grille, Multiplication, Unités & Dizaines, Quiz)
- [x] Système de score avec points, total gagné et série
- [x] Mini-jeux débloqués (Mémoire, Snake, Labyrinthe)
- [x] Contenu Détente avec vidéos éducatives YouTube
- [x] Synthèse vocale en français pour l'apprentissage
- [x] Design responsive pour tous les appareils
- [x] Animations et micro-interactions fluides

### Technologies Spécifiques
- **Langage**: HTML5, CSS3, JavaScript ES6+
- **Audio**: SpeechSynthesis API pour la lecture vocale française
- **Vidéo**: Intégration YouTube Embed API
- **Design**: CSS Grid, Flexbox, animations CSS
- **State Management**: Variables globales JavaScript
- **Storage**: LocalStorage pour la persistance des points

##  Structure des Fichiers

```
jeu_educatif/
├── index.html                    # Page d'accueil et interface principale
├── style.css                     # Styles CSS complets
├── script.js                     # Logique JavaScript principale
├── app-core.js                   # Fonctions de base et utilitaires
├── detente-data.js              # Configuration des lien pour la detentes éducatives
├── quizz.js                       # Logique du quiz mathématique
├── README.md                     # Documentation du projet
└── CHARGE.md                     # Ce document
```

##  Composants Techniques

### 1. Interface Utilisateur (index.html)
- Structure HTML5 sémantique
- Navigation par onglets pour différentes activités
- Système de badges pour le score
- Panneaux de jeu dynamiques

### 2. Style (style.css)
- Palette de couleurs moderne : `--primary: #ff6b6b`, `--secondary: #ffd93d`, etc.
- Animations CSS pour micro-interactions
- Design responsive avec breakpoints
- Effets de particules en arrière-plan

### 3. Logique (script.js, app-core.js)
- Gestion de l'état du jeu (pts, totalPts, streak)
- Utilitaires : `rand()`, `shuffle()`, `clamp()`
- Fonctions de synthèse vocale
- Système de mise à jour de l'interface utilisateur

### 4. Données (detente-data.js)
- Configuration des mini-jeux avec coûts de déblocage
- Playlist de vidéos éducatives YouTube
- Données de quiz avec différents niveaux de difficulté

##  Système de Progression

### Niveaux de Difficulté
| Niveau | Points OK | Points Mauvais | Streak Bonus | Générateur |
|--------|-----------|---------------|--------------|-----------|
| Facile | 5 | 0 | 10 (toutes les 5) | `genEasyQ` |
| Moyen | 10 | 0 | 20 (toutes les 5) | `genMediumQ` |
| Add N1 | 15 | 2 | 30 (toutes les 4) | `genAddQ1` |
| Sub N1 | 18 | 2 | 35 (toutes les 4) | `genSubQ1` |
| Add N2 | 20 | 3 | 40 (toutes les 4) | `genAddQ2` |
| Sub N2 | 22 | 3 | 45 (toutes les 4) | `genSubQ2` |

### Contenu Détente
- **Jeu de Mémoire** : lien vers un jeux
- **Snake** : lien vers un jeux
- **Labyrinthe** : lien vers un jeux
- **Série 1** : "C'est pas sorcier"
- **Série 2** : "Nature et Découvertes" 
- **Série 3** : "Kim possible"

##  Spécifications Design

### Palette de Couleurs
```css
:root {
  --bg: #fef9f0;
  --primary: #ff6b6b;
  --secondary: #ffd93d;
  --accent: #6bcb77;
  --blue: #4d96ff;
  --purple: #c77dff;
  --orange: #ff9a5c;
  --text: #2d2d2d;
  --card: #fff;
}
```

### Typographie
- **Titres** : Fredoka One (cursive, pour l'attrait)
- **Corps** : Nunito (lisible, poids 400-800)

### Animations
- **Points pop** : Animation de scale sur succès
- **Hover states** : Transform et ombre portée
- **Particles** : Arrière-plan radial subtil

##  Audio et Accessibilité

### Synthèse Vocale
- Langue : français (fr-FR)
- Vitesse : 0.82
- Ton : 1.05 (chaleureux)
- Annulation avant chaque lecture

### Accessibilité
- Contrôles audio et visuels disponibles
- Navigation au clavier supportée
- Contraste élevé pour les textes


##  Documentation Complémentaire

### Fichiers de Configuration
- `package.json` : Si Node.js utilisé pour le build
- `webpack.config.js` : Configuration de bundling (si applicable)
- `.gitignore` : Fichiers ignorés

### Notes de Développement
- **Langue** : Tout le contenu en français
- **Code** : Modulaire avec séparation des préoccupations
- **Styling** : CSS avec variables pour la palette de couleurs
- **Audio** : Utilisation optimale de SpeechSynthesis



##  Prochaines Étapes

### Phase 1 (Immédiate)
- [ ] Finaliser la documentation
- [ ] Tester toutes les fonctionnalités
- [ ] Optimiser les performances

### Phase 2 (À venir)
- [ ] Ajouter plus de contenu éducatif
- [ ] Implémenter des statistiques d'apprentissage




---

*Document de charge créé le 2026-10-10*
*Version 1.0 - Phase de développement initial*