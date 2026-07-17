# Prohlížení historie a porovnávání změn

Jedna z největších výhod použití verzovacího systému je možnost se kdykoli ohlédnout do historie, zjistit, co přesně se změnilo, a kdo a proč tu změnu provedl. K tomu slouží nástroje jako `log`, `diff`, `show` a `blame`.

## 1. Zobrazení historie: `git log`

Nejzákladnější příkaz, který vypíše commity od nejnovějšího po nejstarší směrem dolů.

```bash
git log
```
Ukáže SHA-1 hash, autora, datum a zprávu. Když je historie dlouhá, Git ji stránkuje (pro ukončení stiskněte klávesu `q`).

### Formátování logu (Zlaté příkazy)
Čistý výpis jedním řádkem na commit:
```bash
git log --oneline
```

**Nejpoužívanější příkaz profíků (Zobrazení grafu větví):**
Tento příkaz byste si měli uložit jako alias. Vypíše krásný ASCII graf (strom) znázorňující, jak se větve rozdělovaly a slučovaly, komu patří a kde se aktuálně nacházíte (`HEAD`).
```bash
git log --oneline --graph --all --decorate
```

Pokud chcete vidět, jaké soubory se v jednotlivých commitech měnily a kolik řádků bylo přidáno/odebráno:
```bash
git log --stat
```

Pokud chcete vidět přímo patch (obsah změn - diff) pro každý commit v historii:
```bash
git log -p
```

### Hledání v historii (Filtrování)
Git log umí filtrovat jako stroj. Můžete hledat přesně to, co potřebujete.

*   `git log -n 5` - Ukáže jen posledních 5 commitů.
*   `git log --author="Karel"` - Kdo je autor.
*   `git log --since="2.weeks"` nebo `--until="2023-01-01"` - Zobrazení podle data.
*   `git log --grep="bugfix"` - Hledá text *v commit message*.
*   **Velmi silné (Pickaxe):** `git log -S"function init()"` - Najde přesně ty commity, které tento text (např. jméno funkce) *do kódu přidaly* nebo ho *z kódu smazaly*. Ideální pro detektivní práci "kdy ta funkce zmizela?".
*   `git log -- cesta/k/souboru.js` - Vypíše historii a změny pouze pro jeden specifický soubor nebo složku.

## 2. Porovnání změn: `git diff`

Příkaz `git status` vám řekne *jaké* soubory byly změněny. Příkaz `git diff` vám řekne, **jaké řádky přesně** se v nich změnily.

Proč to slovo neukáže rovnou všechno? Protože `git diff` může porovnávat tři různé věci (tři stavy Gitu):

### Co jsem upravil, ale ještě nepřidal (`Modified` vs `Staged`)?
Porovnává váš pracovní adresář se Staging Area (indexem). Jinými slovy ukazuje změny, na které jste ještě nezavolali `git add`.
```bash
git diff
```

### Co půjde do dalšího commitu (`Staged` vs `Committed`)?
Porovnává to, co jste už přidali do Staging Area, s vaším posledním commitem (HEAD). Změny vypsané zde se natvrdo uloží při `git commit`.
```bash
git diff --staged
# (Případně starší varianta: git diff --cached)
```

### Porovnání dvou bodů v historii
```bash
git diff branchA branchB     # Jaký je rozdíl mezi větvemi
git diff HEAD~1 HEAD         # Rozdíl mezi minulým commitem a současným (co udělal poslední commit)
git diff <hash1> <hash2>     # Jakýkoliv historický bod vs jiný historický bod
```

### Vizuální porovnávání: `git difftool`
Číst velké diffy plné plusek a mínusek přímo v terminálu může být pro oči náročné. Můžete Gitu přikázat, aby pro zobrazení změn místo terminálu otevřel váš oblíbený vizuální editor (např. VS Code, Meld, KDiff3).
Po nakonfigurování stačí místo `git diff` napsat:
```bash
git difftool
```
Git otevře grafické okno s vaším původním a novým souborem hezky vedle sebe (side-by-side).

## 3. Inspekce specifického objektu: `git show`
Pokud znáte hash commitu (nebo jméno tagu) a chcete vědět, co v něm přesně bylo, použijte `show`.

```bash
git show 1a2b3c4
```
Vypíše meta informace (autor, zpráva) a poté připojí diff všech souborů, které tento commit změnil vůči svému rodiči. Lze to použít i pro prozkoumání toho, co leží aktuálně na vrcholu větve: `git show main`.

## 4. Kdo to napsal? `git blame`
Konečný detektivní nástroj. Řekne vám u každého řádku daného souboru, ve kterém commitu byl naposledy změněn a kdo je autorem tohoto commitu.

```bash
git blame index.html
```
Výstup je podobný tomuto:
```text
^1a2b3c4 (John Doe 2023-01-01 10:00:00 +0100 1) <html>
^1a2b3c4 (John Doe 2023-01-01 10:00:00 +0100 2)   <head>
3f4g5h6i (Jane Roe 2023-02-15 14:22:10 +0100 3)     <title>Hello World!</title>
```
To znamená, že řádky 1 a 2 napsal John hned v prvním commitu, ale třetí řádek upravovala Jane někdy v únoru. Pokud je v onom řádku chyba, víte, na koho se obrátit, nebo ještě lépe, můžete si pomocí `git show 3f4g5h6i` nechat vypsat, co všechno Jane v onom commitu udělala, a pochopit její záměr.
