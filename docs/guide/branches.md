# Větve a ukazatel HEAD

Větvení (Branching) je pravděpodobně tou největší "killer-feature" Gitu. Zatímco ve starších systémech (SVN) znamenalo vytvoření větve zkopírování úplně všech souborů do nové složky na disku (což bylo pomalé a žralo to místo), v Gitu je větev vytvořena za milisekundu. Důvodem je, že větev v Gitu **není nic jiného než pohyblivý ukazatel na jeden konkrétní commit**.

## Jak funguje větev interně?

Když uděláte commit, Git uloží objekt commitu (jak jsme si vysvětlili v kapitole Interní datový model).
Výchozí větev v Gitu se jmenuje `main` (nebo dříve `master`). Tato větev je jen malý soubor (uložený v `.git/refs/heads/main`), který obsahuje přesně 40 znaků – SHA-1 hash commitu, na který aktuálně ukazuje.

Pokaždé, když na větvi `main` vytvoříte nový commit, Git automaticky vezme tento ukazatel `main` a posune ho vpřed, takže nově ukazuje na ten právě vytvořený nejnovější commit.

### Vytvoření nové větve
```bash
git branch nova-funkce
```
Tento příkaz udělá jednu jedinou věc: vytvoří nový soubor `.git/refs/heads/nova-funkce`, do kterého zapíše hash toho stejného commitu, na kterém právě teď stojíte. Nic víc! Proto je to tak neuvěřitelně rychlé. Máte teď dva ukazatele směřující na stejný commit.

> [!CAUTION] Vytvoření větve vás na ni nepřepne!
> Příkaz `git branch` větev pouze vyrobí. Pokud nyní uděláte commit, zapíše se na větev, na které jste byli předtím (např. `main`), a vaše nová větev `nova-funkce` zůstane stát na starém místě. Musíte se na ni přepnout!

## Co je to HEAD?

Git musí vědět, na jaké větvi zrovna pracujete (aby věděl, který ukazatel má po novém commitu posunout). K tomu slouží speciální ukazatel zvaný **HEAD**.

HEAD si můžete představit jako stín. Většinou se neukazuje přímo na commit, ale **ukazuje na název aktuální větve**. 
(HEAD -> main -> commit).

Pokud otevřete soubor `.git/HEAD`, najdete v něm něco jako: `ref: refs/heads/main`.

## Přepínání větví (`switch` a `checkout`)

Abychom přepnuli náš pracovní adresář tak, aby odpovídal jiné větvi, používáme dnes příkaz `git switch`.

```bash
git switch nova-funkce
```
Co se stane pod povrchem?
1. Git změní obsah souboru `HEAD`, takže teď odkazuje na `refs/heads/nova-funkce`.
2. Podívá se, na jaký commit ukazuje větev `nova-funkce`.
3. Vytáhne z databáze (`.git/objects`) strom tohoto commitu a **nahradí soubory ve vašem pracovním adresáři** tak, aby přesně odpovídaly tomuto snímku. 

Tím je zajištěno, že ať jste cokoliv na staré větvi upravili, je nyní "schované" bezpečně v databázi a vy máte před sebou kód z nové větve.

### Vytvoření a přepnutí v jednom kroku
Většinou chcete větev založit a rovnou do ní skočit:
```bash
git switch -c nova-funkce
```
*(Poznámka: Ve starších verzích Gitu se používal příkaz `git checkout -b nova-funkce`. Příkaz `checkout` se ale používal na spoustu dalších nesouvisejících věcí (jako obnova souborů), proto byl v novějších verzích Gitu rozdělen na `switch` (pro větve) a `restore` (pro soubory) pro větší srozumitelnost.)*

## Smazání větve
Když práci na větvi dokončíte (a pravděpodobně ji sloučíte), ukazatel můžete jednoduše smazat. Soubory smazány nebudou (jsou v historii), smaže se jen ten 40místný ukazatel v `.git/refs/`.

```bash
git branch -d nova-funkce
```
Pokud větev nebyla sloučena a vy se ji snažíte smazat, Git vás zastaví, abyste nepřišli o data. Pokud to chcete udělat natvrdo (zahodit práci):
```bash
git branch -D nova-funkce
```

## Odpojená hlava (Detached HEAD)
Pokud zkusíte příkazem `git switch --detach <hash-commitu>` (nebo `git checkout <hash-commitu>`) skočit na konkrétní starý commit v historii (místo na jméno větve), dostanete se do stavu **Detached HEAD**. U příkazu switch je parametr `--detach` nutný, jinak se zobrazí chyba.

Znamená to, že ukazatel HEAD už neukazuje na jméno žádné větve (jako `main`), ale ukazuje přímo na surový SHA-1 hash commitu.
Můžete se tu rozhlížet, zkoušet, jak kód fungoval dřív. Ale **pokud zde vytvoříte nový commit, nepřipojí se na žádnou větev**. Jakmile se přepnete zpět na `main`, tyto nové commity se v podstatě "ztratí v prostoru" (a časem je sebere Garbage Collector), protože na ně nebude ukazovat žádná větev, přes kterou byste je našli (zachránit by vás mohl jen `git reflog`).
Pokud chcete ve stavu Detached HEAD začít novou práci, musíte na tom místě vytvořit novou větev: `git switch -c zachranna-vetev`.
