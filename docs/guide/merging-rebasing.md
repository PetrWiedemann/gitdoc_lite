# Slučování a Přepisování historie (Merge vs Rebase)

Když pracujete odděleně ve větvi a úkol máte hotový, potřebujete ho dostat zpět do hlavní větve (např. `main`). Git k tomu nabízí dvě zcela odlišné cesty: `merge` a `rebase`. Pochopit rozdíl mezi nimi je jedním z milníků pokročilého ovládání Gitu.

## 1. Slučování: `git merge`

Merge je destruktivně nejbezpečnější operace, protože **nikdy nemění existující historii**. Může vytvořit konflikt (který musíte vyřešit), ale původní commity zůstávají netknuté.

Chcete-li sloučit větev `feature` do větve `main`, musíte na `main` nejprve přejít:
```bash
git switch main
git merge feature
```

Git má dva způsoby, jak merge provést:

### Fast-forward merge (Rychlý posun vpřed)
Pokud jste vytvořili větev z bodu A a od té doby se větev `main` nikam nepohnula, Git nemusí nic složitě počítat. Prostě vezme ukazatel větve `main` a posune ho po časové ose dopředu na stejný commit, kde leží `feature`. Graf zůstává lineární.

### 3-way merge (Trojcestné sloučení) a Merge Commit
Pokud se `main` posunula (někdo jiný tam např. nahrál jinou opravu) a vaše větev `feature` se taky posunula, historie se nám rozdvojila (`Y` tvar). 
Git už nemůže jen posunout ukazatel. Musí vzít:
1. Poslední commit větve `main`.
2. Poslední commit větve `feature`.
3. Jejich nejbližšího společného předka (commit, kde se rozdělily).

Z těchto tří bodů vypočítá změny a **vytvoří úplně nový snímek**, takzvaný **Merge Commit**. Tento commit je speciální tím, že má dva rodiče. Tímto se obě historie spojí dohromady. 

Výhoda je naprostá přesnost a zachování reálné historie. Nevýhoda je, že u velkých projektů začne graf vypadat jako "vlakové nádraží" s hromadou protínajících se drah a propletenců.

## 2. Přepisování historie: `git rebase`

Rebase je alternativní přístup. Pokud nechcete nepřehlednou historii a zbytečné merge commity, použijete rebase. 
Zatímco merge říká: *"Vezmi konec mojí větve, konec cizí větve a sešij to k sobě."*
Rebase říká: *"Vezmi ty commity, které jsem udělal na své větvi, zkopíruj je, a nalep je jeden po druhém na konec hlavní větve."*

```bash
git switch feature
git rebase main
```

**Co Git udělá?**
1. Najde nejbližšího společného předka větve `feature` a `main`.
2. Vezme všechny vaše commity od onoho předka a dočasně si je uloží bokem.
3. Přesune interní ukazatel `HEAD` přesně na aktuální vrchol větve `main`.
4. Jeden po druhém aplikuje uložené commity na tento nový základ.
5. Až když jsou všechny commity úspěšně aplikovány, teprve přesune ukazatel vaší větve `feature` na konec této nové linie. (Právě proto při konfliktu můžete operaci přerušit přes `--abort` a vaše původní větev se vůbec nezmění, protože Git s ní hýbe až úplně nakonec).

Vaše historie teď vypadá naprosto lineárně. Jako byste ty commity napsali až potom, co kolega updatoval `main`. Ale pozor: **Git původní commity zahodil a vygeneroval úplně nové** (s úplně novými SHA-1 hashi, protože se změnil jejich rodič a čas vytvoření, ačkoliv vnitřní změny kódu zůstaly stejné).

Z větve `feature` se teď můžete přepnout na `main` a udělat rychlý `git merge feature` – stane se z toho čistý Fast-forward.

> [!TIP] Řešení konfliktů při Rebase a Záchranná brzda
> Zatímco u běžného Merge se na vás všechny konflikty vyvalí najednou v jednom ohromném zmateném bloku, u Rebase se aplikuje postupně jeden commit za druhým. Pokud při rebasování nastane konflikt, proces se elegantně pozastaví u konkrétního problémového commitu.
> Po ručním vyřešení konfliktu v editoru a uložení souboru musíte přidat upravené soubory pomocí `git add` a následně Gitu říci, ať ve své přerušené práci pokračuje dál:
> ```bash
> git rebase --continue
> ```
> Pokud je situace pro vás příliš chaotická a chcete celou operaci rebase kompletně stornovat a vrátit se do původního, nezničeného výchozího bodu, použijete záchrannou brzdu:
> ```bash
> git rebase --abort
> ```

> [!CAUTION] ZLATÉ PRAVIDLO REBASE
> **Nikdy, za žádných okolností, nedělejte rebase na commitech, které už jste pushnuli na vzdálený server (např. na GitHub), ze kterého si je mohl někdo jiný stáhnout.**
> Pokud to uděláte, vygenerujete novou alternativní historii. Pokud s ní pak nahradíte tu starou na serveru (což vyžaduje nebezpečný `--force` push), všichni vaši kolegové, kteří mají starou historii u sebe na disku, se dostanou do složitých konfliktů a duplicitních commitů při pokusu o synchronizaci. Rebasujte POUZE vaši lokální, čistě soukromou práci, kterou ještě nikdo neviděl.

## Interaktivní Rebase: Mocný nástroj Gitu

Rebase nemusíte použít jen ke změně základu vůči jiné větvi. Můžete ho použít na sebe sama k "vyčištění" vaší lokální historie předtím, než ji pošlete kolegům.

```bash
git rebase -i HEAD~3
```
Toto (interaktivní rebase) se podívá na vaše poslední 3 commity a otevře textový editor. Uvidíte něco takového:

```text
pick 1a2b3c4 První pokus o feature
pick 4d5e6f7 Oprava překlepu
pick 7g8h9i0 Finální dokočení
```
Místo slova `pick` (použít) můžete napsat `squash` (nebo jen `s`). Squash vezme tento commit a začlení ho do commitu nad ním, a sloučí jejich zprávy. Pokud napíšete `reword` (`r`), Git vám dovolí upravit text zprávy. Pokud napíšete `drop` (`d`), commit se úplně vymaže. Pokud přehodíte řádky, commity se prohodí v historii.

Můžete tak z několika zmatených pokusů udělat jeden čistý, smysluplný commit, než ho nadobro zveřejníte v pull requestu.
