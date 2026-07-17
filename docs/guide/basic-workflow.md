# Práce se soubory a historie

Jakmile máte repozitář připraven, začíná váš denní cyklus vývojáře: upravíte kód, podíváte se co je změněné, připravíte to do košíku (staged) a pak to jako celek uložíte do databáze (commit).

## 1. Zjištění stavu: `git status`
Nejčastěji používaný příkaz v celém Gitu. Říká vám, v jakém ze tří stavů se vaše soubory aktuálně nacházejí.
```bash
git status
```
Git status je velmi povídavý a snaží se vám radit. Řekne vám, na jaké jste větvi, co je připraveno ke commitu (Zeleně), co je změněno ale není připraveno (Červeně) a o jakých souborech Git ještě vůbec neví (Untracked files).

Chcete-li jen stručný výpis: `git status -s` (nebo `--short`).
Výstup `-s` používá dva sloupce znaků:
*   `??` Untracked (Git to nesleduje)
*   `A ` Added (Nové ve Staging Area)
*   ` M` Modified (Změněno na disku, ale ne ve Staging Area)
*   `M ` Modified a připraveno ve Staging Area
*   `MM` Bylo to ve Staging Area, ale pak jste to *znovu* upravili.

## 2. Přidávání změn (Staging): `git add`
Příkaz `git add` dělá z netrackovaných souborů sledované a ze sledovaných změněných souborů dělá soubory "staged" (připravené ke commitu). Interně tento příkaz vezme obsah souboru, zahashuje ho, zkomprimuje do *Blobu* a zařadí jeho odkaz do *Indexu*.

```bash
git add README.md       # Přidá konkrétní soubor
git add .               # Přidá všechny soubory a složky v aktuálním adresáři
```

### Interaktivní staging (Pro profíky)
Pokud jste v jednom souboru udělali pět různých oprav, ale chcete vytvořit dva samostatné commity (protože logicky se týkají dvou různých chyb), použijete parametr `-p` (nebo `--patch`).
```bash
git add -p
```
Git vám ukáže každý blok změn (hunk) a zeptá se, jestli ho chcete přidat (`y`), přeskočit (`n`), nebo dokonce manuálně upravit a rozdělit na menší části (`s`). Toto je naprosto klíčové pro tvorbu čisté historie (tzv. "čistých commitů").

## 3. Uložení stavu: `git commit`
Vše, co je ve Staging zóně (tedy to, na co jste zavolali `git add`), se nyní vezme a uloží do stálé paměti.

```bash
git commit -m "Přidání přihlašovacího formuláře"
```
Pokud příkaz spustíte bez `-m`, otevře se vám váš výchozí textový editor (Vim, VS Code), kam máte zprávu zapsat. 

> [!TIP] Jak psát správné commit zprávy
> První řádek by měl být krátký (do 50 znaků), výstižný a nejlépe v imperativu (např. "Oprav přihlašovací obrazovku" nikoliv "Opravil jsem..."). Následuje prázdný řádek a pak detailní popis "Proč" a "Co" se měnilo, obvykle omezeno na 72 znaků na řádek.

### Rychlý commit (přeskočení add)
Pokud jste jen upravovali soubory, které Git už zná (nejsou to nové soubory), můžete přeskočit krok `git add` a použít přepínač `-a`:
```bash
git commit -a -m "Oprava překlepů"
# Nebo zkráceně: git commit -am "Oprava překlepů"
```
*Pozor: Toto nepřidá nově vytvořené soubory (untracked).*

## 4. Odstraňování a přejmenování souborů

### Mazání
Pokud smažete soubor z disku přes operační systém (nebo klávesou Delete), `git status` vám to ohlásí jako chybějící soubor, který čeká, až tuto informaci o smazání přidáte do Staging area (`git add <soubor>`). 

Pohodlnější je nechat to smazat přímo Gitem:
```bash
git rm hesla.txt
```
Toto soubor smaže z disku a rovnou vloží do Indexu záznam o smazání. 
Pokud chcete soubor smazat z Gitu (aby se už neverzoval), ale nechat si ho na disku, použijte:
```bash
git rm --cached hesla.txt
```

### Přejmenování
Git technicky vzato nesleduje přejmenování souborů explicitně (jen heuristicky počítá shodu obsahů při diffu). Můžete ale použít příkaz:
```bash
git mv stary.txt novy.txt
```
To odpovídá tomu, když na disku soubor přejmenujete, pak starý název z Gitu smažete (`git rm`) a nový přidáte (`git add`).

## 5. Ignorování souborů: `.gitignore`
V každém projektu jsou soubory, které Git nesmí nikdy vidět: hesla, tokeny, lokální IDE konfigurace (např. složka `.idea/`, `.vscode/`), kompilované soubory (`.class`, `node_modules/`, `build/`).

Tato pravidla se zapisují do textového souboru s názvem `.gitignore` (umístěného většinou v rootu projektu). Tento soubor se *musí* komitnout do Gitu, aby měli stejná pravidla všichni vývojáři.

Příklad pravidel:
```sh
# Ignoruj všechny .a soubory
*.a

# Ale nezávisle na pravidlu nahoře sleduj lib.a
!lib.a

# Ignoruj celý adresář build/
build/

# Ignoruj doc/notes.txt, ale ne doc/server/arch.txt
doc/*.txt

# Ignoruj všechny .txt soubory v doc/ adresáři a všech podadresářích
doc/**/*.txt
```
> [!WARNING] Soubor už je v Gitu, ale přidal jsem ho do .gitignore!
> Pokud už Git nějaký soubor sleduje (byl komitnutý v minulosti), přidání do `.gitignore` ho **nevymaže** a nepřestane se sledovat! Musíte ho nejdříve explicitně z Gitu odstranit příkazem: `git rm --cached <soubor>` a provést commit. Až pak ho Git začne úspěšně ignorovat.
