# Hledání chyb binárním půlením: git bisect

Většina vývojářů zažila ten moment hrůzy: Aplikace zničehonic padá při kliknutí na tlačítko "Odeslat". Nikdo netuší proč. Naposledy, když jste to testovali před měsícem ve verzi 1.0, to fungovalo bez problémů. Mezitím ale váš tým vytvořil 200 dalších commitů. 

Procházet každý jeden ze 200 commitů a testovat ho by trvalo dny. Zde nastupuje na scénu `git bisect` - velmi užitečný nástroj Gitu na hledání viny.

## Jak Bisect funguje?

Bisect používá algoritmus binárního vyhledávání. Git rozdělí historii na polovinu. Přeskočí přesně doprostřed vašich 200 commitů (na commit č. 100) a řekne: *"Zkus to otestovat teď"*.
Vy otestujete kód. Pokud funguje, znamená to, že oněch prvních 100 commitů je naprosto v pořádku a chyba musela být zanesena až někdy mezi commitem 101 a 200. Git pak přeskočí na commit 150... a tak dále. Z 200 commitů tak najdete viníka na **pouhých 8 kroků**.

## Základní postup

1. **Spuštění vyhledávání:**
```bash
git bisect start
```

2. **Oznámení špatného stavu (teď):**
Jste na aktuální větvi, kde víte, že je chyba.
```bash
git bisect bad
```

3. **Oznámení dobrého stavu (někdy v minulosti):**
Vzpomenete si, že ve verzi v1.0 (nebo v konkrétním starém commitu) to fungovalo.
```bash
git bisect good v1.0
```

Jakmile to uděláte, Git okamžitě přepne váš pracovní adresář na commit, který leží přesně v polovině mezi `v1.0` a aktuálním stavem. Uvidíte výpis typu:
`Bisecting: 100 revisions left to test after this (roughly 7 steps)`

4. **Testování:**
Nyní vyzkoušíte svou aplikaci (zkusíte kliknout na ono rozbité tlačítko).
*   Pokud to **spadne** (chyba tu už je), napíšete: `git bisect bad`
*   Pokud to **funguje** (chyba se ještě nestala), napíšete: `git bisect good`

5. Git vás po zadání automaticky posune do další poloviny. Tento krok (Test -> Hodnocení bad/good) opakujete, dokud Git vítězoslavně neoznámí něco takového:
```text
3f4g5h6i is the first bad commit
commit 3f4g5h6i...
Author: Jane Roe <jane@example.com>
Date:   Wed Feb 15 14:22:10 2023 +0100

    Refaktoring logiky tlačítka odeslat
```

Voilá! Našli jste přesně ten jeden jediný commit, který všechno rozbil. Přečtěte si, co se v něm měnilo přes `git show 3f4g5h6i`.

6. **Ukončení vyhledávání:**
Jakmile chybu opravíte (nebo zjistíte její příčinu), musíte vyhledávání ukončit, čímž vás Git vrátí zpět na vaši původní aktuální větev, kde jste s bisectem začali.
```bash
git bisect reset
```

> [!TIP] Automatický bisect
> Pokud pro detekci chyby nemusíte klikat v UI, ale máte automatizovaný skript nebo Unit Test (např. `npm run test:button`), nemusíte kroky ručně odklikávat! Můžete zadat:
> `git bisect run npm run test:button`
> Git provede celých např. 1000 testů plně automaticky za pár vteřin a na konci vám prostě vyplivne SHA-1 hledaného špatného commitu. Je to neuvěřitelně mocné.
