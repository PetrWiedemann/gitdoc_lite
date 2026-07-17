# Stahování a Odesílání změn (Fetch, Pull, Push)

Pro komunikaci s vzdáleným repozitářem slouží svatá trojice síťových příkazů. Věnujte zvláštní pozornost rozdílu mezi fetch a pull, je to základ pro prevenci konfliktů.

## 1. Stahování změn bez zásahu do vaší práce (`git fetch`)

Příkaz `git fetch` je ten nejbezpečnější způsob, jak se podívat, co je nového na serveru.
```bash
git fetch origin
```
**Co to udělá:**
1. Git se spojí se serverem `origin`.
2. Stáhne od něj všechny commity (objekty, stromy, hashe), které na serveru přibyly a vy je ještě nemáte.
3. Posune ukazatele vašich **remote-tracking větví** (např. posune ukazatel `origin/main` dopředu na ty nové commity).

**Co to NEUDĚLÁ:**
Neudělá absolutně nic s vaším pracovním adresářem (Working Directory). Vaše aktuálně checkoutnutá větev (např. vaše lokální `main`) zůstane na původním místě. 

Po provedení `fetch` je velmi dobrým zvykem podívat se do historie a porovnat vaši lokální práci s tím, co jste právě stáhli:
```bash
git log --oneline --graph main origin/main
git diff main origin/main
```

## 2. Stažení a automatické sloučení (`git pull`)

`git pull` není nic jiného než zkratka pro dva příkazy: `git fetch` následovaný `git merge`.

```bash
git pull origin main
```
Toto stáhne změny (`fetch`) a okamžitě se je pokusí sloučit (`merge`) do vaší AKTUÁLNÍ větve. Pokud se vaše lokální historie a historie na serveru rozešly různým směrem, Git vygeneruje Merge Commit, nebo dokonce hodí **Merge Konflikt**, který budete muset začít hned řešit.

### Pull with Rebase (Moderní workflow)
Pokud jste udělali nějaké lokální změny a mezitím někdo jiný updatoval větev na serveru, prostý `git pull` vytvoří automatický merge commit, který může dělat historii nepřehlednou. 

Mnohem elegantnější (v profi sféře často vyžadované) je provedení stáhnutí a *Rebase* vaší práce místo merge:
```bash
git pull --rebase origin main
```
To řekne Gitu: "Stáhni změny ze serveru. Pak vezmi moje lokální commity, dej je stranou, posuň moji lokální větev na stažený stav ze serveru, a pak vezmi ty moje bokem odložené commity a zkus je naroubovat hezky jeden po druhém na vrchol té nové serverové historie."

## 3. Odesílání lokální práce na server (`git push`)

Když máte práci hotovou a zkomitovanou na své lokální větvi, použijete `git push`, abyste ji nahráli do světa.

```bash
git push origin moje-vetev
```

Pokud odesíláte tuto větev ÚPLNĚ POPRVÉ, protože jste ji teprve teď založili u sebe na počítači, server `origin` neví, o čem mluvíte. Musíte mu říct, ať tu větev vytvoří a nastaví mezi ní a vaší lokální větví propojení (tracking). K tomu slouží přepínač `-u` (nebo `--set-upstream`):

```bash
git push -u origin moje-vetev
```
Díky parametru `-u` se zapamatuje spojení a příště, až na této větvi uděláte změnu, bude vám stačit napsat už jen samotné **`git push`** bez specifikace jména.

### Jak přepsat historii na serveru (Force Push)
Pokud jste použili `git rebase` nebo např. upravili zprávu posledního commitu (`git commit --amend`), změnili jste SHA-1 hashe svých commitů. 
Pokud se takové upravené commity pokusíte poslat na server (`git push`), **Git vás tvrdě odmítne (Rejected)** a řekne vám, že vaše historie není "fast-forward" (nemůže ji prostě nalepit na konec). To je ochranný mechanismus.

Zkušený vývojář ví, že pokud tuto upravenou větev ještě nikdo ze serveru nestáhl, může přikázat Gitu, ať na serveru historii surově a nenávratně přepíše:

```bash
git push --force origin moje-vetev
```

> [!CAUTION] --force vs --force-with-lease
> Zcela upřímně, čistý `--force` byste neměli používat skoro nikdy. Je velmi nebezpečný. Co když váš kolega udělal push sekundu před vámi? Váš `--force` ten jeho push chladnokrevně smaže a nahradí ho jen vašimi daty.
> Zvykněte si používat výhradně:
> **`git push --force-with-lease origin moje-vetev`**
> Tento chytrý příkaz provede push s přepsáním, ale NEJPRVE ZKONTROLUJE, jestli se mezitím na serveru neobjevily cizí commity, o kterých vaše lokální mašina ještě neví (nebo spíše: ujistí se, že přepisuje přesně ten commit, který si myslíte, že přepisuje). Pokud objeví cizí práci, operaci bezpečně zastaví. Je to "force push se záchrannou sítí".
