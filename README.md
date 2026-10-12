# DLF35 — Première version GitHub Pages

Cette version est un **prototype** de saisie, pas encore un générateur de rapports conformes au cahier des charges.

## Publication sur GitHub Pages

1. Ouvrir le dépôt `antoinegestin2-ai/dlf35-rapport` sur GitHub.
2. Faire une copie de sauvegarde des fichiers existants.
3. Ajouter à la racine du dépôt les fichiers `index.html` et `matrice_originale.docx` de cette archive (menu **Add file > Upload files**), puis **Commit changes**.
4. Dans **Settings > Pages**, choisir **Deploy from a branch**, branche **main**, dossier **/(root)**, puis enregistrer.
5. Ouvrir `https://antoinegestin2-ai.github.io/dlf35-rapport/` après publication.

## Ce qui fonctionne

- Interface responsive iPhone/Windows.
- Plusieurs dossiers, dommages, sous-dommages et investigations.
- Rubriques facultatives et aperçu de contenu.
- Sauvegarde dans le navigateur (localStorage), export/import JSON.
- Téléchargement de la matrice d'origine intacte.
- Export Word expérimental : modification de certains champs administratifs dans le DOCX original, sans recréer la mise en page.

## Limites importantes

- L'export Word **n'intègre pas encore** les dommages, sous-dommages, investigations, photos, synthèse et rubriques finales.
- Les photos restent seulement en mémoire pendant la session et ne sont pas enregistrées dans les dossiers JSON.
- Les menus de formulations techniques de la matrice ne sont pas encore intégrés.
- Pas de comptes techniciens, de serveur, ni de synchronisation OneDrive.
- Le téléchargement Word dépend de JSZip chargé depuis un CDN et nécessite Internet.
- Le champ date de la matrice utilise un contrôle de contenu Word et peut nécessiter un traitement spécifique.
- L'aperçu HTML n'est pas un rendu fidèle de la pagination Word.
- GitHub Pages est public : **ne pas y placer de dossiers clients ni de rapports confidentiels**. Les données saisies restent dans le navigateur, sauf export manuel.

## Prochaine étape

Créer un générateur DOCX côté serveur qui clone réellement les blocs Word existants et vérifie chaque scénario par rendu page par page, avant de déclarer la conformité.
