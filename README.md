# Git Dokumentace

Tento repozitář obsahuje komplexní českou dokumentaci a příručku pro verzovací systém Git. Dokumentace je navržena pro vývojáře různých úrovní zkušeností, od začátečníků až po pokročilé uživatele, a zaměřuje se jak na teoretické principy fungování Gitu, tak na praktické řešení běžných i složitých situací v praxi.

## Struktura obsahu

Dokumentace je rozdělena do několika logických celků:

*   **Úvod a Rutiny:** Rychlý start, denní workflow a tahák pro záchranné situace.
*   **Jádro a Interní fungování:** Vysvětlení tří stavů Gitu, objektového modelu a vnitřní architektury repozitáře.
*   **Začínáme s vývojem:** Inicializace projektu, nastavení konfigurace (`.gitattributes`, `core.autocrlf`), autentizace (SSH, HTTPS/GCM) a základy historie.
*   **Větvení (Branching):** Správa větví, přepínání kontextů, rozdíly mezi operacemi Merge a Rebase a odkládání práce (Stash).
*   **Vzdálené repozitáře:** Práce se vzdálenými zdroji (Remotes) a synchronizace dat.
*   **Řešení problémů:** Diagnostika konfliktů, vracení nechtěných změn a záchrana dat pomocí nástroje Reflog.
*   **Pokročilé techniky:** Bisekce pro hledání chyb, tagování, submoduly, izolované pracovní stromy (Worktrees), Git Hooks a LFS.
*   **Ekosystém:** Integrace se službami typu GitHub (Pull Request strategie, Forking) a firemní self-hosted servery.
*   **Referenční příručka:** Seznam příkazů rozdělených na běžné (Porcelain) a nízkoúrovňové (Plumbing).

## Technologický stack

Dokumentace je postavena na frameworku **VitePress** (založeném na Vue.js a Vite), který slouží jako generátor statických stránek optimalizovaný pro tvorbu technických manuálů. Pro vizualizaci procesů a stavů Gitu je využívána knihovna **Mermaid.js**, která generuje diagramy přímo z textového zápisu v Markdownu.

## Požadavky pro sestavení

Pro lokální běh nebo sestavení dokumentace je nutné mít nainstalováno:
*   **Node.js** (verze 18.0.0 nebo novější)
*   **npm** (případně yarn, pnpm nebo bun)

## Instalace a spuštění

1. Klonování repozitáře:
   ```bash
   git clone <url_repozitare>
   cd <slozka_repozitare>
   ```

2. Instalace závislostí:
   ```bash
   npm install
   ```

3. Spuštění lokálního vývojového serveru:
   ```bash
   npm run docs:dev
   ```
   Tento příkaz spustí lokální server, standardně dostupný na adrese `http://localhost:5173`. Vývojový server podporuje Hot Module Replacement (HMR), takže jakékoli úpravy v souborech `.md` se okamžitě projeví v prohlížeči.

## Sestavení pro produkci

Pro vygenerování finálních statických HTML souborů, které lze následně nasadit na libovolný webový hosting nebo platformu (např. GitHub Pages, Vercel, Netlify), spusťte:

```bash
npm run docs:build
```

Výsledné zkompilované soubory budou uloženy v adresáři `docs/.vitepress/dist`. Tyto soubory lze rovnou kopírovat na cílový server.

## Lokální testování produkčního buildu

Pokud chcete ověřit, jak bude vypadat a fungovat finální zkompilovaná verze před nasazením, můžete si vygenerované statické soubory lokálně prohlédnout pomocí příkazu:

```bash
npm run docs:preview
```
