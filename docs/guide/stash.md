# Odkládání práce: git stash

Každý vývojář zná tuto situaci: Pracujete na nové funkci ve větvi `feature`, máte v editoru napůl rozepsaný kód, spoustu změn ve stavu `Modified`. V tom vám volá šéf, že je kritická chyba na produkci (`main`) a musíte ji jít *hned* opravit.

Co s rozpracovaným kódem?
1. Komitnout polotovar (např. `git commit -m "Zatím nefunguje"`). To zaneřádí historii.
2. Smazat ho. To nepřipadá v úvahu.
3. **Založit ho do Stash (Šuplíku).**

Příkaz `git stash` vezme znečištěný pracovní adresář (vaše modifikované a indexované sledované soubory), zabalí tyto nedodělky do takového dočasného "mini-commitu" v pozadí, a váš pracovní adresář i staging area **zcela vyčistí** tak, aby odpovídaly poslednímu řádnému commitu (HEAD).

```bash
git stash
```

Můžete si přidat i zprávu, abyste si pamatovali, co v tom šuplíku máte:
```bash
git stash push -m "Rozdělaný přihlašovací formulář"
```

Nyní máte čistý stůl. Můžete se přepnout (`git switch main`), opravit chybu, komitnout, poslat šéfovi a přepnout se zpět (`git switch feature`).

## Vrácení dat ze šuplíku

Jakmile jste zpět na své větvi a chcete pokračovat tam, kde jste přestali, máte dvě možnosti:

### 1. Aplikovat a smazat (Pop)
Toto je nejběžnější způsob.
```bash
git stash pop
```
Tento příkaz vytáhne nejnovější obsah ze šuplíku, aplikuje ho do vašeho aktuálního pracovního adresáře (získáte zpět všechny modifikované soubory) a následně onen **záznam ze šuplíku trvale smaže**.

> [!WARNING] Stash Pop s konfliktem
> Pokud `git stash pop` narazí na to, že vaše současná složka obsahuje kód, který je v konfliktu s tím ze šuplíku (změnili jste mezitím stejné řádky), Git aplikuje změny, vyhlásí konflikt k ručnímu řešení, ale **záznam ve stashi nesmaže**. Bude ho pro jistotu brát jako cennou zálohu, dokud ho sami nevymažete.

### 2. Aplikovat a ponechat (Apply)
Pokud chcete změny aplikovat, ale v šuplíku si je nechat jako zálohu (nebo je plánujete aplikovat ještě i do jiné větve):
```bash
git stash apply
```

### Záchrana stavu "Staging area" (Indexu)
Ať už použijete `pop` nebo `apply`, Git se při navrácení souborů ze šuplíku neobtěžuje tím, aby zjistil, které soubory byly tehdy "připraveny v košíku" (`git add`). **Všechny obnoví jako Unstaged.** To je nepříjemné, pokud jste měli precizně na-stagované vybrané řádky. Abyste si zachovali i stav indexu přesně tak, jak byl před `git stash`, musíte k `pop` nebo `apply` přidat parametr `--index`:
```bash
git stash pop --index
```

## Práce s více věcmi ve stashi

Do stashe můžete vložit (pushnout) více věcí najednou (funguje to jako datová struktura LIFO zásobník). 
Pro zobrazení všeho, co máte v šuplíku:
```bash
git stash list
```
Výstup bude vypadat např.:
```text
stash@{0}: On feature: Rozdělaný přihlašovací formulář
stash@{1}: On main: Úpravy stylů z pátku
```
Pokud chcete aplikovat `stash@{1}` a ne jen ten úplně nahoře (`stash@{0}`), stačí to specifikovat:
```bash
git stash apply stash@{1}
```

## Stash a Untracked files
Ve výchozím nastavení bere `git stash` pouze **upravované soubory, které Git už zná (tracked files)**. Pokud jste vytvořili úplně nový soubor, např. `login.html`, a nezavolali na něj `git add`, standardní `git stash` ho tam nechá ležet na disku!

Pokud chcete do stashe schovat **všechno**, včetně untracked souborů:
```bash
git stash push -u    # nebo --include-untracked
```
A pokud chcete do stashe spláchnout úplně všechno včetně ignorovaných souborů (`.gitignore`), použijete přepínač `-a` (nebo `--all`). To se ale moc nedoporučuje (chvíli to trvá a máte v šuplíku smetí jako node_modules).

## Smazání záznamů
Pokud si chcete šuplík manuálně promazat:
```bash
git stash drop stash@{1}  # Smaže konkrétní záznam
git stash clear           # Smaže KOMPLETNĚ VŠECHNO ze šuplíku. Pozor na to!
```
