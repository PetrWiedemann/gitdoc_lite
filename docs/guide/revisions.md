# Ukazování na commity (Revize)

Během práce s Gitem musíte často Gitu říct, s jakým commitem chcete pracovat (např. při `git log`, `git diff`, `git reset`). Většinou na to používáme jména větví (např. `main`) nebo přímé SHA-1 hashe (např. `1a2b3c4`).

Git ale nabízí mnohem mocnější a relativní způsoby, jak se v historii pohybovat.

## 1. Značka HEAD a relativní cesty

**`HEAD`** je speciální ukazatel, který vždy ukazuje na váš aktuální commit (to, co máte právě v pracovním adresáři).
Od `HEAD` (nebo od jakékoliv jiné větve) můžete počítat kroky zpět do historie pomocí operátorů vlnovky `~` a stříšky `^`.

### Vlnovka `~` (Cesta po hlavní linii zpět)
Používá se k pohybu "lineárně zpět" o daný počet generací.
*   `HEAD~1` (nebo jen `HEAD~`): Otec (rodič) aktuálního commitu (o 1 krok zpět).
*   `HEAD~3`: Pradědeček (o 3 kroky zpět v čase).
*   `main~2`: Dva commity zpět od vrcholu větve `main`.

Pokud narazí na rozvětvení historie (merge commit), vlnovka jde vždy po první linii (po rodiči číslo 1, což je většinou hlavní větev, do které se slučovalo).

### Stříška `^` (Pohyb do stran u Merge commitů)
Používá se téměř výhradně, když stojíte na **Merge commitu**, který má více rodičů.
*   `HEAD^1` (nebo jen `HEAD^`): První rodič (větev, **do** které jste slučovali, např. `main`).
*   `HEAD^2`: Druhý rodič (větev, **ze** které jste slučovali, např. `feature-login`).

**Kombinace obou:**
Můžete je i řetězit: `HEAD~2^2` znamená: *"Jdi o dva commity zpět po hlavní linii, a na tamním merge commitu vyber jeho druhého rodiče."*

## 2. Rozsahy commitů (A..B)

Když pracujete s příkazy jako `git log` nebo `git diff`, často vás nezajímá celá historie, ale jen to, co se stalo mezi dvěma body.

### Dvě tečky `A..B` (Rozdíl a dostupnost)
Tento zápis logicky znamená: *"Dej mi všechno, co je dostupné (reachable) z bodu B, ale vyluč všechno, co je dostupné z bodu A."*

Nejčastější použití je zjištění: **"Co jsem naprogramoval já na své větvi od chvíle, kdy jsem se oddělil od hlavní větve?"**
```bash
git log main..feature
```
Toto vám vypíše pouze ty commity, které jsou na `feature`, ale nejsou na `main`. Pokud si to prohodíte (`git log feature..main`), uvidíte, co už naprogramoval zbytek týmu na `main` a vy to u sebe ještě nemáte.

### Tři tečky `A...B` (Symetrický rozdíl)
Znamená: *"Dej mi commity, které jsou k dispozici z A nebo B, ale ne ty, které jsou společné pro obě."*
Používá se méně často. Pokud zavoláte `git diff A...B`, Git vám neukáže rozdíl mezi koncem A a koncem B, ale rozdíl mezi **jejich nejbližším společným předkem** a koncem B. (Toto pod kapotou dělá Pull Request na GitHubu).

## 3. Ukazatele na vzdálené servery (@{upstream})

Jak už víme, lokální Git si udržuje read-only kopie serverových větví (např. `origin/main`).
Git má pro to zkratku `@{u}` (případně dlouze `@{upstream}`). Znamená to "větev na serveru, se kterou je tato moje aktuální lokální větev propojena".

Můžete tedy snadno zjistit, jak moc jste pozadu (nebo napřed) oproti serveru:
```bash
# Ukaž mi, co leží na serveru a já to ještě nemám stáhnuté
git log HEAD..@{u}

# Ukaž mi, co jsem vytvořil já a čeká to na to, abych zavolal git push
git log @{u}..HEAD
```

Git je natolik chytrý, že u příkazu `git log` můžete tu zkratku i úplně vynechat. Pokud napíšete jen:
```bash
git log @{u}..
```
Git si domyslí, že druhá strana je `HEAD`.
