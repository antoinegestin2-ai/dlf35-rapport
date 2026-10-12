# DLF35 — Contrôle de fidélité à la matrice

Cette version corrige l'erreur de principe de la précédente maquette : le rendu de référence est issu **directement** de la matrice Word originale, et non redessiné en HTML.

## Installation GitHub Pages
Copier `index.html`, `matrice_originale.docx` et le dossier `pages/` à la racine du dépôt `dlf35-rapport`, puis activer GitHub Pages depuis la branche `main`, dossier `/ (root)`.

## Limites explicites
Les images de pages sont un aperçu fixe de la matrice vierge, pas un aperçu dynamique des données d'intervention. Le Word fourni est la matrice originale inchangée. Cette livraison ne constitue pas une application complète de rédaction ni un moteur de génération Word. Une solution serveur ou un moteur OOXML avancé sera nécessaire pour répéter les blocs et insérer les photos en conservant le document maître, puis vérifier le rendu page par page.
