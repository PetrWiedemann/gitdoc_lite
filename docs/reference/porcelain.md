# Běžné (Porcelain) příkazy Gitu

V terminologii Gitu se příkazy dělí na vysokoúrovňové (Porcelain = "porcelán", věci, se kterými přijde do styku uživatel) a nízkoúrovňové (Plumbing = "instalatérské trubky", interní nástroje). Tato stránka slouží jako rychlý slovníček nejpoužívanějších Porcelain příkazů.

## Inicializace a Konfigurace

### `git init`
Vytvoří nový prázdný repozitář (skrytou složku `.git`) v aktuálním adresáři.

### `git clone <url>`
Stáhne existující repozitář ze serveru k vám na disk. Obsahuje i kompletní historii.
*   `git clone <url> <slozka>` - Zklonuje do specifické složky.

### `git config`
Získání nebo nastavení konfiguračních proměnných.
*   `git config --global user.name "Jméno"` - Nastaví jméno globálně.

## Práce se soubory (Snapshotting)

### `git add <soubor>`
Přidá soubor nebo jeho změněný obsah do Staging Area (přípravné zóny pro commit).
*   `git add .` - Přidá všechno v adresáři.
*   `git add -p` - Umožní přidávat bloky změn interaktivně.

### `git status`
Zobrazí stav pracovního adresáře a Staging zóny. Zásadní pro orientaci.

### `git commit`
Uloží stav připravených souborů ve Staging Area natrvalo do historie jako snímek (commit).
*   `git commit -m "Zpráva"` - Připojí zprávu rovnou z příkazové řádky.
*   `git commit -a -m "Zpráva"` - Zkratka pro add + commit (nefunguje pro nově vytvořené soubory).
*   `git commit --amend` - Změní úplně poslední commit (např. oprava zprávy nebo přidání opomenutého souboru).

### `git rm <soubor>`
Smaže soubor z disku a vloží záznam o smazání do Staging Area.

### `git mv <stary> <novy>`
Přejmenuje nebo přesune soubor.

## Prohlížení a Porovnávání

### `git log`
Zobrazí chronologickou historii commitů.
*   `git log --oneline --graph --all` - Přehledné grafické zobrazení stromu.

### `git diff`
Zobrazí rozdíly v obsahu souborů. Bez parametrů porovnává Working Directory proti Staging Area.
*   `git diff --staged` - Rozdíly mezi Staging Area a posledním commitem.

### `git show <hash>`
Zobrazí informace o konkrétním commitu a změny (diff), které tento commit přinesl.

### `git blame <soubor>`
Vypíše soubor řádek po řádku s informací, kdo, kdy a ve kterém commitu daný řádek naposledy upravil.

## Větvení a Sloučení

### `git branch`
Vypíše existující lokální větve.
*   `git branch <jméno>` - Vytvoří větev (ale nepřepne na ni).
*   `git branch -d <jméno>` - Smaže větev.

### `git switch <větev>`
Přepne pracovní adresář na danou větev (aktualizuje HEAD a soubory).
*   `git switch -c <větev>` - Vytvoří větev a rovnou na ni přepne.

### `git merge <větev>`
Sloučí obsah zadané větve do vaší aktuální větve.

### `git rebase <větev>`
Přepíše historii. Přesune vaše nové commity z aktuální větve tak, jako by byly naprogramovány až za koncem zadané větve.
*   `git rebase -i HEAD~N` - Interaktivní čištění historie N posledních commitů.

### `git stash`
Uloží nedokončené, nezakomitované změny do dočasného "šuplíku" a vyčistí pracovní adresář.
*   `git stash pop` - Aplikuje změny ze šuplíku zpět a smaže záznam.

## Sdílení a Synchronizace

### `git remote`
Správa aliasů k vzdáleným repozitářům (např. `origin`).
*   `git remote -v` - Zobrazí aktuálně napojené servery.

### `git fetch`
Stáhne nová data ze serveru k vám na disk, ale *nesloučí* je s vaší prací. Aktualizuje remote-tracking větve.

### `git pull`
Zkratka pro `git fetch` následovaná příkazem `git merge` (nebo `rebase`). Stáhne změny a pokusí se je rovnou aplikovat do vaší větve.

### `git push`
Odešle vaše lokální commity z větve na vzdálený server.
*   `git push -u origin <větev>` - Při prvním poslání nové větve propojí lokální větev se serverem.
*   `git push --force-with-lease` - Bezpečný přepis historie na serveru.

## Odstraňování chyb

### `git restore <soubor>`
Zahodí neuložené změny v souboru z pracovního adresáře a nahradí je poslední známou komitovanou verzí.

### `git reset <commit>`
Posune celou větev zpět v čase.
*   `--soft`: Ponechá změny na disku a v indexu.
*   `--mixed`: (Výchozí) Ponechá změny na disku, smaže index.
*   `--hard`: Smaže úplně všechno od daného commitu až po současnost. Změny nenávratně zmizí.

### `git revert <commit>`
Vytvoří nový commit, který dělá přesný opak specifikovaného špatného commitu. Bezpečné pro použití po sdílení kódu.
