# Konflikty a jejich řešení

Když se zmíní Git, mnoho začátečníků i pokročilých vývojářů si automaticky vybaví slovní spojení "Merge konflikt". Je to situace, která budí respekt, ale jakmile pochopíte, proč vzniká a jak číst její strukturu, ztratí konflikt punc hrůzy a stane se jen běžnou denní rutinou.

## Proč konflikt vůbec vznikne?

Git je nesmírně chytrý. Pokud vy upravíte začátek souboru a kolega upraví konec téhož souboru, Git po příkazu `git merge` nebo `git pull` obě úpravy naprosto bez problému sloučí dohromady bez vašeho zásahu.

Konflikt vznikne **pouze tehdy, pokud dva různí lidé (nebo vy ve dvou různých větvích) upravili TENTÝŽ ŘÁDEK v tomtéž souboru různým způsobem**, nebo pokud jeden z vás soubor upravil a druhý ho smazal.
V tuto chvíli si Git řekne: *"Pozor, tady jsou dvě odlišné pravdy o stejném řádku kódu. Já jsem jen stroj, nevím, kdo má pravdu. Rozhodni to ty, člověče."*

Git proces slučování zastaví a hodí konflikt.

## Jak vypadá konflikt?

Pokud se tak stane, Git status vám červeně oznámí `Unmerged paths`. Pokud takový soubor otevřete ve svém editoru, najdete v něm vložené speciální "konfliktní markery", které Git vygeneroval, abyste viděli obě verze pohromadě. Vypadá to nějak takto:

```html
<<<<<<< HEAD
<div class="header" id="nav-v2">
=======
<div class="header" id="main-navigation">
>>>>>>> feature-menu
```

Rozbor bloku:
1.  **`<<<<<<< HEAD`**: Toto označuje začátek *vaší* úpravy. HEAD je větev, do které se právě teď snažíte slučovat data (tedy většinou ta, na které stojíte).
2.  **`=======`**: Toto je oddělovač. Odděluje vaši verzi (nahoře) od cizí verze (dole).
3.  **`>>>>>>> feature-menu`**: Toto je označení konce bloku. Takto tento řádek upravila větev `feature-menu` (ta, kterou si snažíte k sobě přitáhnout).

## Jak konflikt vyřešit?

Máte v podstatě tři možnosti, co s tím udělat. Ve všech třech případech je výsledkem to, že **musíte konfliktní markery (`<<<`, `===`, `>>>`) z kódu smazat** a nechat tam jen čistý, finální a fungující kód.

1.  **Použijete jen vaši úpravu:** Smažete markery a cizí řádek.
2.  **Použijete jen cizí úpravu:** Smažete markery a váš řádek.
3.  **Vymyslíte hybridní řešení (Nejčastější):** Například usoudíte, že cizí verze má lepší ID prvku, ale vaše má zase nové CSS třídy. Z kódu uděláte mix: `<div class="header new-styling" id="main-navigation">`.

Jakmile soubor upravíte a vypadá čistě, **uložíte ho a přidáte do Gitu**:
```bash
git add upraveny-soubor.html
```
Tím, že na konfliktní soubor zavoláte `git add`, dáváte Gitu signál: *"Hotovo, tento soubor už konfliktní není, vyřešil jsem to."*
Když to uděláte se všemi červenými soubory, stačí konflikt uzavřít vytvořením merge commitu:
```bash
git commit
```

> [!TIP] Záchranná brzda: `git merge --abort`
> Někdy je konflikt tak rozsáhlý a složitý, že po delší době ručního řešení kódu ztratíte kontext. 
> Pokud se v řešení konfliktu ztratíte a chcete z toho bezpečně odstoupit a vrátit projekt do stavu, v jakém byl před zadáním příkazu `git merge`, stačí zavolat záchrannou brzdu:
> ```bash
> git merge --abort
> ```
> Git instantně smaže všechny konfliktní markery, zruší celý proces slučování a vrátí vás čisté zpět.

## Nástroje na řešení: `git mergetool`

Pokud konflikt zasahuje desítky řádků a míchají se v něm proměnné, je ruční mazání markerů noční můra. Zde nastupují vizuální merge nástroje.

Můžete spustit příkaz:
```bash
git mergetool
```
Tento příkaz otevře nakonfigurovaný externí program (např. *KDiff3*, *Meld*, nebo přímo okno z *VS Code* / *IntelliJ*). Vizuální nástroje obvykle zobrazují tři sloupce:
*   Vlevo: Verze z vaší větve (Local)
*   Vpravo: Verze z cizí větve (Remote)
*   Uprostřed: Společný předek obou větví (Base)
*   Dole: Výsledný soubor, kam klikáním myší přesouváte řádky zleva nebo zprava.

VS Code dnes nabízí brilantní zabudovaný "Merge Editor", který vám umožní konflikty odklikávat jednoduchými tlačítky "Accept Current Change", "Accept Incoming Change" nebo "Accept Both".
