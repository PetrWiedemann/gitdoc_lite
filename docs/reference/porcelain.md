# Běžné (Porcelain) příkazy Gitu

V terminologii Gitu se příkazy dělí na vysokoúrovňové (Porcelain = "porcelán", věci, se kterými přijde do styku uživatel) a nízkoúrovňové (Plumbing = "instalatérské trubky", interní nástroje). Tato stránka slouží jako rychlý slovníček nejpoužívanějších Porcelain příkazů.

## Inicializace a Konfigurace

### `git init`
Vytvoří nový prázdný repozitář (skrytou složku `.git`) v aktuálním adresáři.

### `git clone <url>`
Stáhne existující repozitář ze serveru k vám na disk. Obsahuje i kompletní historii.
*   `git clone <url> <slozka>` - Zklonuje do specifické složky.
*   `git clone --depth 1 <url>` - tzv. **Shallow clone**. Stáhne pouze úplně poslední snapshot souborů bez dlouhé historie. Užívá se na CI/CD serverech pro masivní urychlení stahování.

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
*   `git log --follow <soubor>` - Extrémně užitečné. Zobrazí historii úprav konkrétního souboru, i když byl v minulosti přejmenován (standardní log u přejmenování ztratí stopu).

### `git diff`
Zobrazí rozdíly v obsahu souborů. Bez parametrů porovnává Working Directory proti Staging Area.
*   `git diff --staged` - Rozdíly mezi Staging Area a posledním commitem.

### `git show <hash>`
Zobrazí informace o konkrétním commitu a změny (diff), které tento commit přinesl.

### `git blame <soubor>`
Vypíše soubor řádek po řádku s informací, kdo, kdy a ve kterém commitu daný řádek naposledy upravil.

### `git describe`
Vezme váš aktuální commit a najde k němu nejbližší předchozí Tag (např. v1.0). Výstupem je čitelný string typu `v1.0-4-g923abc` (znamená: stojíš 4 commity za verzí 1.0 a hash je 923abc). Ideální pro generování verze do buildů aplikací.

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

### `git bundle`
Vezme komprimované Git objekty a větve a sbalí je do jednoho fyzického `.bundle` souboru, který pak můžete nahrát na flashku a donést do jiné sítě. Tento soubor se chová jako "offline server" a lze z něj klasicky klonovat nebo pullit.

### `git sparse-checkout`
Pokud pracujete s gigantickým monorepem (miliony souborů), můžete Gitu přes sparse-checkout říct, ať vám na disk fyzicky stáhne jen složku `/frontend` a zbytek nechá ležet pouze v databázi, čímž ušetříte čas i místo na disku.

## Odstraňování chyb

### `git restore <soubor>`
Zahodí neuložené změny v souboru z pracovního adresáře a nahradí je poslední známou komitovanou verzí.
*   `git restore --source <hash> <soubor>` - Nevytáhne aktuální verzi z `HEAD`, ale vyloví soubor tak, jak vypadal v naprosto jakémkoliv historickém commitu. Skvělé k záchraně dávno přepsaného kódu v jednom souboru.

### `git reset <commit>`
Posune celou větev zpět v čase.
*   `--soft`: Ponechá změny na disku a v indexu.
*   `--mixed`: (Výchozí) Ponechá změny na disku, smaže index.
*   `--hard`: Smaže úplně všechno od daného commitu až po současnost. Komitované změny lze zachránit jedině přes Reflog, nekomitované zmizí nenávratně.

### `git revert <commit>`
Vytvoří nový commit, který dělá přesný opak specifikovaného špatného commitu. Bezpečné pro použití po sdílení kódu.
