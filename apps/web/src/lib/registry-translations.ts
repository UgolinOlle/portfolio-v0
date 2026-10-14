// French labels for the fumadocs chrome of the /ui registry (the site's default language).
// Keys follow @fuma-translate's format: the English text followed by each note in parentheses
// (the hook's note, then the call's note), e.g. `On this page(table of contents)`.
export const registryTranslations: Record<string, string> = {
  'On this page(table of contents)': 'Sur cette page',
  'No Headings(table of contents)': 'Aucun titre',
  'Previous Page(pagination)': 'Précédent',
  'Next Page(pagination)': 'Suivant',
  'Copy Markdown(page actions)': 'Copier le Markdown',
  'Open(page actions)': 'Ouvrir',
  'Read {url}, I want to ask questions about it.(page actions)':
    'Lis {url}, je veux te poser des questions dessus.',
  'Open in GitHub(page actions)': 'Ouvrir dans GitHub',
  'View as Markdown(page actions)': 'Voir en Markdown',
  'Open in Scira AI(page actions)': 'Ouvrir dans Scira AI',
  'Open in ChatGPT(page actions)': 'Ouvrir dans ChatGPT',
  'Open in Claude(page actions)': 'Ouvrir dans Claude',
  'Open in Cursor(page actions)': 'Ouvrir dans Cursor',
  'Toggle Theme(theme switcher)(aria-label)': 'Changer de thème',
  'Open Search(search trigger)(aria-label)': 'Ouvrir la recherche',
  'Search(search trigger)': 'Rechercher',
  'Open Sidebar(sidebar)(aria-label)': 'Ouvrir la barre latérale',
  'Close Sidebar(sidebar)(aria-label)': 'Fermer la barre latérale',
  'Collapse Sidebar(sidebar)(aria-label)': 'Replier la barre latérale',
  'Edit on GitHub(edit page)': 'Modifier sur GitHub',
  'Last updated on(page footer)': 'Mis à jour le',
};

// Same labels for fumadocs-ui's own i18n context (search dialog), mounted on RootProvider.
export const fumadocsUiTranslations = {
  search: 'Rechercher',
  searchNoResult: 'Aucun résultat',
  toc: 'Sur cette page',
  tocNoHeadings: 'Aucun titre',
  lastUpdate: 'Mis à jour le',
  chooseLanguage: 'Choisir une langue',
  nextPage: 'Suivant',
  previousPage: 'Précédent',
  chooseTheme: 'Thème',
  editOnGithub: 'Modifier sur GitHub',
};
