import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: "Průvodce Gitem",
  description: "Příručka a reference k verzovacímu systému Git",
  base: '/gitdoc_lite/',
  lang: 'cs-CZ',
  appearance: 'dark',
  mermaid: {
    themeVariables: {
      fontFamily: '"Inter", sans-serif'
    },
    flowchart: {
      rankSpacing: 80, /* Větší vzdálenost mezi uzly (zabrání smrsknutí šipek) */
      nodeSpacing: 50
    }
  },
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Hledat',
                buttonAriaLabel: 'Hledat'
              },
              modal: {
                noResultsText: 'Nenalezeny žádné výsledky pro',
                resetButtonTitle: 'Vymazat hledání',
                footer: {
                  selectText: 'pro výběr',
                  navigateText: 'pro navigaci',
                  closeText: 'zavřít'
                }
              }
            }
          }
        }
      }
    },
    nav: [
      { text: 'Úvod', link: '/' },
      { text: 'Tahák a rutiny', link: '/guide/cheat-sheet' },
      { text: 'Průvodce', link: '/guide/internals' },
      { text: 'Reference příkazů', link: '/reference/porcelain' }
    ],
    sidebar: [
      {
        text: 'Část 1: Jádro a Interní fungování',
        collapsed: false,
        items: [
          { text: 'Co je Git a jak myslí', link: '/guide/internals' },
          { text: 'Tři stavy Gitu', link: '/guide/three-states' },
          { text: 'Interní model dat', link: '/guide/data-model' }
        ]
      },
      {
        text: 'Část 2: Začínáme s vývojem',
        collapsed: false,
        items: [
          { text: 'Autentizace a přístup', link: '/guide/authentication' },
          { text: 'Denní rutiny a Tahák', link: '/guide/cheat-sheet' },
          { text: 'Konfigurace a Inicializace', link: '/guide/getting-started' },
          { text: 'Práce se soubory a historie', link: '/guide/basic-workflow' },
          { text: 'Prohlížení historie (log, diff)', link: '/guide/history' }
        ]
      },
      {
        text: 'Část 3: Větvení (Branching)',
        collapsed: false,
        items: [
          { text: 'Větve a HEAD', link: '/guide/branches' },
          { text: 'Slučování (Merge) vs Rebase', link: '/guide/merging-rebasing' },
          { text: 'Odkládání práce (Stash)', link: '/guide/stash' },
          { text: 'Ukazování na commity (Revize)', link: '/guide/revisions' }
        ]
      },
      {
        text: 'Část 4: Vzdálené repozitáře',
        collapsed: false,
        items: [
          { text: 'Práce s Remotes', link: '/guide/remotes' },
          { text: 'Stahování a odesílání změn', link: '/guide/syncing' }
        ]
      },
      {
        text: 'Část 5: Řešení problémů',
        collapsed: false,
        items: [
          { text: 'Řešení konfliktů', link: '/guide/conflicts' },
          { text: 'Vracení změn a oprava chyb', link: '/guide/undoing' },
          { text: 'Záchrana dat (Reflog)', link: '/guide/reflog' }
        ]
      },
      {
        text: 'Část 6: Pokročilé techniky',
        collapsed: false,
        items: [
          { text: 'Hledání chyb (Bisect)', link: '/guide/bisect' },
          { text: 'Tagy, Submoduly, Worktrees', link: '/guide/advanced-tools' },
          { text: 'Git Hooks', link: '/guide/hooks' }
        ]
      },
      {
        text: 'Část 7: Ekosystém',
        collapsed: false,
        items: [
          { text: 'GitHub a integrace', link: '/ecosystem/github' },
          { text: 'Self-hosted servery (Firemní Git)', link: '/ecosystem/self-hosted' }
        ]
      },
      {
        text: 'Část 8: Referenční příručka',
        collapsed: false,
        items: [
          { text: 'Porcelain příkazy (Běžné)', link: '/reference/porcelain' },
          { text: 'Plumbing příkazy (Nízkoúrovňové)', link: '/reference/plumbing' }
        ]
      }
    ],
    outline: {
      level: [2, 3],
      label: 'Na této stránce'
    },
    docFooter: {
      prev: 'Předchozí',
      next: 'Další'
    }
  }
}))
