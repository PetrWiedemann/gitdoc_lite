# Tahák a Denní rutiny

Tato kapitola slouží jako rychlá kuchařka pro vaše každodenní programování. Nepůjdeme zde do hluboké teorie, ale ukážeme si přesné sekvence příkazů pro běžnou práci a rychlou záchranu z nepříjemných situací.

## 1. Začátek projektu (Založení Gitu)

Máte tři možnosti, jak se dostat k verzovanému kódu.

### A) Chci úplně nový prázdný repozitář
Nejčastěji pro nový osobní projekt, který zatím není nikde na serveru.
```bash
mkdir muj-projekt
cd muj-projekt
git init
```

### B) Mám projekt na disku, chci ho nahrát na server
Už měsíc programujete, máte plnou složku kódu a teď jste se rozhodli, že ho nahrajete na GitHub (nebo firemní server).
```bash
cd slozka-s-kodem
git init
git add .
git commit -m "První commit mého existujícího kódu"

# Vytvořte si prázdný repozitář na GitHubu a vložte jeho adresu sem:
git remote add origin https://github.com/jmeno/projekt.git
git push -u origin main
```

### C) Připojuji se do existujícího projektu
Kolega už něco naprogramoval (kód je na serveru) a vy si to chcete stáhnout k sobě a přidat se.
```bash
git clone https://github.com/jmeno/projekt.git
cd projekt
```

---

## 2. Standardní denní workflow

Takto vypadá běžný den vývojáře v moderním týmu. Předpokládáme, že pracujete v oddělené větvi a na konci dne svou práci odesíláte.

### Ráno: Stažení novinek
Předtím než začnete psát vlastní kód, stáhněte si změny, které přes noc udělali kolegové.
```bash
git switch main
git pull
```

### Dopoledne: Začínám novou práci
Nikdy neprogramujte přímo do větve `main`. Udělejte si vlastní větev pojmenovanou podle úkolu (např. oprava chyby číslo 42).
```bash
git switch -c fix/bug-42
```

### Odpoledne: Jdu si udělat kávu (Ukládání průběžné práce)
Máte rozepsaný kód a chcete si ho uložit.
```bash
# Zkontroluji, co jsem vlastně změnil (abych neuložil tajná hesla)
git status
git diff

# Přidám všechny upravené soubory do "košíku" (Staging area)
git add .

# Vytvořím snímek (Commit) s popisnou zprávou
git commit -m "Základní formulář pro login"
```
*(Tento krok s `add` a `commit` můžete opakovat klidně 10x denně.)*

### Večer: Odeslání práce kolegům
Máte hotovo a chcete to poslat na GitHub, aby to kolegové mohli zkontrolovat.
```bash
git push -u origin fix/bug-42
```
*(Parametr `-u` je nutný pouze při úplně prvním pushnutí vaší nové lokální větve. Zítra už by stačilo jen prosté `git push`).* Následně jdete na web GitHubu a vytvoříte Pull Request.

---

## 3. Tahák: Co dělat, když... (Záchranné brzdy)

Tyto příkazy zkopírujte, když máte problém a potřebujete ho rychle vyřešit.

### Zapomněl jsem přidat soubor do commitu
Právě jste vytvořili commit, ale zapomněli jste do něj vložit jeden drobný CSS soubor. Nezakládejte nový malý commit s názvem "oprava css".
```bash
git add zapomenuty_styly.css
git commit --amend --no-edit
```
*(Commit se tiše upraví a bez ptaní do sebe "spolkne" i ten zapomenutý soubor).*

### Napsal jsem špatnou zprávu commitu (překlep)
Chcete pouze přejmenovat ten úplně poslední commit, kód je v pořádku.
```bash
git commit --amend -m "Nová a správná zpráva"
```

### Chci zahodit to, co jsem teď naťukal (Ještě nekomitováno)
Programovali jste, ale je to celé špatně a chcete se vrátit do stavu přesně po posledním commitu. Potřebujete smazat neuloženou práci.
```bash
# Pokud chcete zahodit úpravy v jednom konkrétním souboru:
git restore soubor.js

# Pokud chcete zahodit úpravy úplně všude (bezpečné pouze pro již verzované soubory):
git restore .

# Pokud jste vytvořili i úplně nové dočasné soubory, které chcete taky smazat:
git clean -fd
```

### Přidal jsem si něco omylem do `git add`
Chcete soubor vyndat z košíku, protože do commitu nepatří (např. soubor s vaším heslem do databáze). Tento příkaz vám soubor nesmaže z disku, jen ho odškrtne z budoucího commitu.
```bash
git restore --staged tajne_heslo.txt
```

### Mám tam velký nepořádek a chci se vrátit v čase o 2 commity
Rozbili jste to a ty poslední dva commity prostě chcete smazat a dělat, že se nikdy nestaly.
```bash
# Smaže historii, ale váš kód na disku nechá upravený, ať ho můžete přepsat:
git reset HEAD~2

# [POZOR: NEVRATNÉ] Smaže commity a okamžitě vám smaže kód i z disku:
git reset --hard HEAD~2
```

### Spustil jsem `git pull` a vyskočil na mě KONFLIKT
Zčervenal vám terminál a soubory mají v sobě podivné značky `<<<<<<<`. Zkuste konflikt vyřešit ručně, ale pokud se v tom ztratíte a chcete z toho procesu odstoupit:
```bash
git merge --abort
# nebo pokud používáte rebase:
git rebase --abort
```
Všechny ty konfliktní značky z kódu zmizí a vy se vrátíte přesně do stavu před stažením dat z internetu.

### Smazal jsem si omylem větev / Udělal jsem tvrdý reset a chci kód zpět
Použijte Reflog. Git si píše deníček úplně všeho, i smazaných věcí.
```bash
git reflog
# Najděte hash akce, která proběhla TĚSNĚ PŘED vaším omylem (např. a1b2c3d)
git branch jmeno_obnovene_vetve a1b2c3d
```
