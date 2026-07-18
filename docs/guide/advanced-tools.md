# Tagy, Submoduly, Worktrees a Cherry-pick

Tato kapitola představuje nástroje, které možná nebudete potřebovat první den vývoje, ale jakmile projekt vyroste, stanou se nepostradatelnými.

## 1. Vybírání třešniček: `git cherry-pick`

Představte si, že kolega pracoval na větvi `feature-A`, vytvořil tam 10 commitů, ale ten pátý commit v pořadí obsahuje drobný pomocný skript, který vy nutně potřebujete ve své větvi `main`. Nechcete ale z jeho větve dělat merge (protože větev ještě není hotová).
Můžete sáhnout do jeho větve a "utrhnout si" jen ten jeden konkrétní commit a zkopírovat si ho k sobě.

```bash
git cherry-pick <hash-zajimaveho-commitu>
```
Git vezme změny z daného commitu a aplikuje je na vaši aktuální větev jako zbrusu nový commit. *Pozor, nový commit bude mít nový hash (změnil se rodič).*

## 2. Značkování historie: `git tag`

Zatímco větve jsou ukazatele, které se neustále posouvají s novými commity dopředu, Tagy jsou ukazatele, které se **nikdy nehýbou**. Slouží k označení významných bodů v historii, nejčastěji pro sémantické verzování (např. `v1.0.0`, `v2.4.1-beta`).

**Odlehčený tag (Lightweight tag):**
Je to jen statický ukazatel na commit. Vytvoří se rychle a jednoduše.
```bash
git tag v1.0
```

**Anotovaný tag (Annotated tag):**
Silně se doporučuje používat tyto. Anotovaný tag vytvoří v databázi skutečný samostatný objekt (viz Interní model dat). Uloží si jméno tagující osoby, e-mail, datum, zprávu (jako commit message) a lze jej podepsat PGP klíčem pro prokázání pravosti verze.
```bash
git tag -a v1.0 -m "Vydání první stabilní verze"
```

Odeslání tagů na server:
Standardní `git push` tagy na server nepřenáší. Musíte je tam poslat explicitně:
```bash
git push origin v1.0     # Jeden tag
git push origin --tags   # Všechny tagy
```

**Smazání tagu:**
Pokud se spletete a chcete tag lokálně smazat, než ho někam pošlete:
```bash
git tag -d v1.0
```

## 3. Repozitář v repozitáři: `git submodule`

Máte hlavní projekt, a ten závisí na jiné knihovně, která je vyvíjena v úplně cizím Git repozitáři (a vy z ní nechcete dělat běžný npm nebo maven balíček, protože do ní chcete i zapisovat kód). Submodul dovoluje mít jeden Git repozitář uvnitř podadresáře jiného Git repozitáře.

Přidání submodulu do složky `externi-knihovna`:
```bash
git submodule add https://github.com/cizi/knihovna externi-knihovna
```
Hlavní repozitář si neukládá soubory submodulu, uloží si do sebe jen URL adresu a specifický SHA-1 hash commitu, na kterém má submodul momentálně "stát". 

**Klonování projektu se submoduly:**
Běžný `git clone` vám stáhne hlavní projekt, ale složka se submoduly bude prázdná. Pro stažení všeho najednou:
```bash
git clone --recurse-submodules https://github.com/muj/projekt
```

**Aktualizace submodulu:**
Pokud kolega zaktualizoval submodul na novější commit a vy si stáhnete jeho změny (přes `git pull`), Git vám sice stáhne nový ukazatel na tento commit, ale neaktualizuje automaticky fyzické soubory uvnitř složky submodulu. Pro propsání změn musíte zavolat:
```bash
git submodule update --init --recursive
```

**Práce uvnitř submodulu a nástraha "Detached HEAD":**
Když vejdete do složky submodulu, funguje to tam jako samostatný Git. Pokud dáte uvnitř `git pull` nebo `git checkout`, je velmi snadné se dostat do stavu *Detached HEAD* (Neukotvený HEAD), kdy pracujete "ve vzduchoprázdnu" mimo jakoukoliv větev. Než začnete uvnitř submodulu cokoliv měnit a komitovat, **vždy se nejprve ujistěte, že jste si checkoutnuli lokální větev** (např. `git switch main`), jinak se vaše nové commity po nejbližší nadřazené aktualizaci "ztratí" (nikam se nepropíší).

> [!WARNING] Zrádná past: Zapomenutý push submodulu
> Pokud změníte kód v submodulu a komitnete ho, musíte udělat dva push příkazy! Nejprve musíte udělat `git push` přímo ve složce submodulu a teprve **potom** `git push` v hlavním repozitáři (který zaznamenává onen posunutý ukazatel na hash submodulu). Pokud nahrajete hlavní repozitář a zapomenete nahrát submodul, **kompletně tím rozbijete projekt úplně všem kolegům**, protože Git u nich uvidí, že hlavní repozitář vyžaduje po submodulu konkrétní nový hash, který ale nikde na serveru neexistuje.

## 4. Více pracovních adresářů najednou: `git worktree`

Běžně máte jeden repozitář `.git` a jeden pracovní adresář. Pokud pracujete na větvi `feature` a šéf po vás chce opravit chybu v `main`, musíte udělat `git stash` (nebo commit), přepnout na `main`, opravit, komitnout, vrátit se.

Pokud je projekt obrovský, přepnutí větve může trvat dlouho (rekompilace všech souborů, node_modules se rozbijí apod.). 

`git worktree` dovoluje vzít jeden `.git` repozitář a checkoutnout si ho na disku vedle do **úplně jiné nové složky**. Máte pak na disku vedle sebe složky `projekt-main` a `projekt-feature`, máte to otevřené ve dvou editorech a obě složky sdílejí jednu společnou Git historii!

```bash
# Vytvoří vedle stávající složky novou a checkoutne v ní větev hotfix
git worktree add ../projekt-hotfix hotfix
```
Když dopracujete, smazání provedete čistě takto (nesmažte jen složku natvrdo):
```bash
git worktree remove ../projekt-hotfix
```

> [!WARNING] Omezení Worktree
> U worktrees existuje jedno zásadní omezení: **Nemůžete mít jednu konkrétní větev (např. `main`) aktivní ("checkoutnutou") ve dvou různých worktree složkách najednou.** Git tím chrání konzistenci větve a ukazatele HEAD (aby nenastal stav, kdy jedna větev ukazuje na dva různé commity v různých složkách). Pokud se pokusíte přejít na větev, která už je zapnutá v jiné složce, Git vás zastaví.

## 5. Verzování velkých binárních souborů: Git LFS (Large File Storage)

Git byl původně navržen pouze pro textové soubory (zdrojový kód). Pokud do Gitu vložíte 500MB video, 2GB datový export nebo desítky PSD návrhů a uděláte pár drobných změn, velikost celého vašeho `.git` repozitáře výrazně naroste. Stahování takového repozitáře (`git clone`) pak bude trvat nesmírně dlouho, protože Git se pokusí stáhnout celou historii a všechny verze těchto obrovských binárních souborů.

K definitivnímu řešení tohoto problému slouží oficiální rozšíření **Git LFS**.

LFS funguje tak, že při nahrání do Gitu obrovské soubory fyzicky nahradí malinkým textovým "odkazem" (pointerem) a samotný obrovský binární soubor odloží bokem na vyhrazený, na míru optimalizovaný LFS server.

**Jak začít s LFS:**
1. Nainstalujete si na počítač Git LFS klienta (bývá již součástí moderních instalátorů pro Windows a Mac).
2. V projektu ho jednorázově aktivujete:
```bash
git lfs install
```
3. Řeknete Gitu, aby pomocí LFS sledoval určité přípony nebo složky (vygeneruje se tím pravidlo do souboru `.gitattributes`):
```bash
git lfs track "*.psd"
git lfs track "*.mp4"
```
Od této chvíle se k nim můžete chovat jako k úplně běžným souborům (`git add`, `git commit`), ale na pozadí je LFS bude přelévat do správného úložiště, aniž by zahltily vaši Git databázi.

## 6. Automatické řešení opakujících se konfliktů: `git rerere`

Zkratka `rerere` znamená *"Reuse Recorded Resolution"* (Znovupoužití zaznamenaného řešení).

Představte si rozsáhlou "feature" větev, na které děláte čtvrt roku a kterou se každý týden snažíte udržovat aktuální s hlavní větví `main` pomocí merge. Bohužel vám ale neustále vyskakuje jeden a ten samý komplikovaný konflikt (např. rozsáhlé přeformátování souboru od kolegy), který musíte dokola manuálně řešit pokaždé, když si `main` k sobě stahujete.

Když si v Gitu zapnete `rerere`, Git si pokaždé, když nějaký konflikt manuálně vyřešíte, tento konflikt tajně "vyfotí" (uloží si před a po stav). Pokud narazí na úplně identický konflikt někdy v budoucnu (při rebase, při merge, při cherry-picku), **vyřeší ho za vás zcela automaticky** a vám na obrazovku jen napíše "*Resolved using previous resolution*".

Pro maximální komfort si můžete zapnout i to, aby Git takto vyřešený soubor rovnou přidal do Staging area (ušetříte si psaní `git add` po vyřešení rerere):
```bash
git config --global rerere.autoUpdate true
```

Aktivace pro konkrétní repozitář:
```bash
git config rerere.enabled true
```
Doporučuje se ho zapnout rovnou globálně napříč všemi vašimi projekty:
```bash
git config --global rerere.enabled true
```
