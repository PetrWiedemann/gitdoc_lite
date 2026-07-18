# Vracení změn a oprava chyb

Pokud zrovna pracujete, děláte chyby. Git exceluje v tom, že vám dává nepřeberné množství nástrojů, jak jakoukoliv chybu vzít zpět. Volba správného nástroje záleží na tom, **kde** ta chyba je (ve Working Directory, v Indexu, v Commitu, nebo dokonce už na serveru?).

## 1. Chyba je ve Working Directory (Nepřidáno, Nekomitováno)
Upravili jste soubor, ale uvědomili jste si, že jste provedli nesprávné úpravy a chcete soubor uvést do stavu, v jakém byl v posledním commitu. (Ekvivalent *Zahodit lokální změny*).

```bash
git restore soubor.js
```
*Pozor: Toto nevratně smaže vaše neuložené změny na disku. Neexistuje žádný "koš", odkud to pak vytáhnout.*

## 2. Změna je v Indexu (Zavolali jste omylem `git add`)
Přidali jste do Staging Area soubor s tajnými hesly a potřebujete ho z košíku vyndat, aby nešel do commitu. Není to smazání obsahu souboru z disku, je to jen "zrušení zaškrtnutí".

```bash
git restore --staged soubor-s-hesly.txt
```

## 3. Zkazil jsem úplně poslední commit (`--amend`)
Právě jste udělali commit, ale hned poté jste si všimli: "Sakra, překlep ve zprávě!" nebo "Zapomněl jsem k tomu přidat ještě tento malý CSS soubor!". Nemusíte dělat trapný nový commit "Oprava opomenutého souboru". Můžete upravit ten stávající.

1. Proveďte chybějící změnu (např. uložte ten zapomenutý CSS soubor).
2. Přidejte ho do košíku: `git add styl.css`.
3. Nahraďte starý commit novým včetně této změny:
```bash
git commit --amend
```
Otevře se editor, kde můžete upravit i zprávu starého commitu. Výsledkem bude **jeden čistý commit**.

## 4. Resetování větví: `git reset` (Návrat v čase)
Pokud máte ve větvi už několik commitů, které jsou špatné, a vy se chcete "vrátit v čase" o tři commity dozadu a ty špatné vymazat, použijete reset. Ukazatel větve a HEAD se doslova přesunou do minulosti.

Základní syntaxe: `git reset <druh_resetu> <hash_nebo_HEAD~3>`

Existují 3 druhy resetu a každý dělá něco jiného:

### Soft Reset
```bash
git reset --soft HEAD~2
```
Posune ukazatel v historii, **ale** nechá všechny vaše soubory na disku a v indexu úplně netknuté tak, jak byly v té budoucnosti. V podstatě ty dva smazané commity se vám objeví v Gitu rovnou jako `staged`. Vhodné pro situaci: "Chci vzít tyto dva commity a slisovat je do jednoho pořádného".

### Mixed Reset (Výchozí, pokud nespecifikujete)
```bash
git reset HEAD~2
```
Posune ukazatel, smaže Staging zónu, ale soubory na disku nechá upravené. Ty dva commity se objeví jako "Unstaged changes". Můžete je pomalu prozkoumat a znovu na-commitovat jinak.

### Hard Reset (Zbraň hromadného ničení)
```bash
git reset --hard HEAD~2
```
> [!CAUTION] Nevratná operace
> Posune ukazatel historie a **brutálně zahodí všechno**. Váš pracovní adresář i index bude přesně odpovídat starému commitu. Všechno, co jste vytvořili a naprogramovali po tomto bodě v čase, se doslova vypaří z disku. Pokud to nebylo aspoň v nějakém jiném commitu nebo stashi, je to ztraceno **zcela nevratně**. (Pozor: Často zmiňovaný Reflog zachraňuje pouze commitnutou práci; smazané necommitnuté změny Reflog nijak nevrátí).

### Vyčištění nesledovaných (untracked) souborů: `git clean`
Příkazy `restore` i `reset --hard` ovlivňují pouze soubory, které už Git zná (verzuje je). Pokud jste během testování vytvořili spoustu nových dočasných souborů nebo složek, `reset --hard` je na disku nechá ležet. Abyste smazali i tyto nadbytečné soubory a získali čistý repozitář, použijte:
```bash
git clean -fd
```
*(Přepínač `-f` vynutí smazání, `-d` zahrne i celé adresáře. Lze použít `-n` pro zkoušku nanečisto – Git jen vypíše, co by smazal).*

## 5. Bezpečné vrácení veřejného commitu: `git revert`
Pokud jste commit, který obsahuje chybu, už pushnuli na server a ostatní si ho stáhli, **Nesmíte použít `git reset` ani `git commit --amend`** (tím byste přepsali historii, viz kapitola o Push a Rebase).

V takovém případě musíte chybu vzít zpět tak, že vytvoříte **nový commit, který dělá přesný opak toho špatného**. K tomu slouží:

```bash
git revert <hash-toho-spatneho-commitu>
```
Git se podívá, co špatný commit přidal nebo smazal, a vygeneruje patch, který přidá, co bylo smazáno, a smaže, co bylo přidáno. Následně vygeneruje nový commit s názvem např. `Revert "Rozbití produkce"`. Vaše historie neustále roste dopředu, nikomu to nerozbije synchronizaci, ale chyba je z kódu odstraněna.

### Revertování Merge Commitu (Past)
Pokud chyba vznikla tak, že jste omylem do `main` slili (`merge`) obrovskou a rozbitou feature větev, a chcete tento merge zrušit, narazíte na problém. Merge commit má totiž dva rodiče. Když mu řeknete `git revert <hash>`, Git neví, ke kterému z těch dvou rodičů se má vracet (zda zanechat kód z větve `main` nebo z té `feature` větve). Musíte mu explicitně říct, kterou větev považujete za tu "hlavní" (obvykle rodič číslo 1).

```bash
git revert -m 1 <hash-merge-commitu>
```

> [!WARNING] Zrádná past znovusloučení
> Pokud `feature` větev takto revertnete, chybný kód z produkce sice zmizí, ale z pohledu Gitu je tato `feature` větev navždy označená jako "už byla sloučena a následně revertnuta". Pokud kolega tu `feature` větev opraví a zkusíte ji slít do `main` podruhé, Git ty původní opravené soubory bude **ignorovat**! Pro znovusloučení byste museli nejprve "revertnout samotný revert commit". Je to velmi složitá past pro pokročilé. Mnohem bezpečnější pro týmy bývá provést na dané větvi další opravné commity a slít je bez revertu.
