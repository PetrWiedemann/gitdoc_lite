# Konfigurace a Inicializace

Před tím, než začnete verzovat kód, musíte mít repozitář (bezpečné úložiště) a musíte Gitu říct, kdo jste.

## 1. Konfigurace: git config

Když Git zaznamenává změny (commity), ukládá do nich vaše jméno a e-mailovou adresu. Toto jméno a e-mail se stávají pevnou součástí kryptografického hashe samotného objektu commitu. Bez složitého přepisování historie (např. pomocí pokročilého `rebase` nebo nástroje `git filter-repo`) je nelze zpětně změnit. Z tohoto důvodu je nutné toto nastavit úplně nejdřív.

Nástroj, kterým se to dělá, se jmenuje `git config`.

Git načítá konfiguraci ze tří míst v tomto pořadí (každá další vrstva přepisuje tu předchozí):
1.  **System:** Soubor `/etc/gitconfig` (nebo obdoba ve Windows). Týká se všech uživatelů na daném počítači.
2.  **Global:** Soubor `~/.gitconfig` nebo `~/.config/git/config`. Týká se konkrétního uživatele v operačním systému. Používá se nejčastěji. Parametr `--global`.
3.  **Local:** Soubor `.git/config` přímo ve vašem repozitáři. Týká se jen a pouze tohoto konkrétního repozitáře. Parametr `--local` (nebo se nepíše nic, je to výchozí).

### Nastavení identity
```bash
git config --global user.name "John Doe"
git config --global user.email "johndoe@example.com"
```
*Poznámka pro firemní prostředí:* Pokud pro soukromé věci používáte osobní e-mail na GitHubu, nechte si ho `--global`. Ale ve firemním repozitáři přejděte do něj a nastavte si firemní e-mail pouze lokálně: `git config --local user.email "john.doe@company.com"`.

### Další užitečná nastavení
Výchozí editor (např. pro zprávy commitů):
```bash
git config --global core.editor "code --wait" # Pro VS Code
git config --global core.editor "vim"
```

Výchozí jméno hlavní větve (od verze 2.28 je moderní `main` místo `master`):
```bash
git config --global init.defaultBranch main
```

Zobrazení všech nastavení a kde se berou:
```bash
git config --list --show-origin
```

## 2. Inicializace repozitáře

Máte dvě možnosti, jak získat Git repozitář: buď převedete existující adresář s vaším kódem na repozitář, nebo si zkopírujete repozitář už existující někde jinde (např. z GitHubu).

### Z existujícího adresáře (`git init`)
Máte-li adresář s vaším projektem, který ještě není verzovaný:
```bash
cd /cesta/k/projektu
git init
```
Tento příkaz udělá jedinou věc: vytvoří skrytý podadresář `.git`, který obsahuje celou kostru repozitáře (složky `objects`, `refs`, soubor `HEAD` atd.). 

V tento okamžik se vaše soubory na disku **ještě nezačaly verzovat**. Git pouze vytvořil prázdnou databázi. Abyste soubory začali sledovat, musíte použít `git add` a `git commit`.

### Klonování z existujícího zdroje (`git clone`)
Pokud se chcete zapojit do existujícího projektu, použijete `git clone`.

```bash
git clone https://github.com/torvalds/linux.git
```

**Co všechno `git clone` udělá pod kapotou?**
1.  Vytvoří na disku adresář (v tomto případě `linux`).
2.  Uvnitř něj spustí `git init` pro vytvoření skryté databáze `.git`.
3.  Zavolá příkaz `git remote add origin https://github.com/torvalds/linux.git`, čímž si uloží adresu vzdáleného serveru pod jméno "origin".
4.  Zavolá `git fetch origin`, čímž stáhne z internetu *kompletně celou historii, všechny commity a všechny větve* do vaší lokální `.git` databáze.
5.  Zavolá `git checkout` (nebo `git switch`) na výchozí větev (obvykle `main` nebo `master`), čímž z komprimované databáze extrahuje nejnovější verzi souborů do vašeho pracovního adresáře, abyste s nimi mohli pracovat.

> [!TIP] Různé protokoly pro klonování
> Repozitáře můžete klonovat přes **HTTPS** (`https://github.com/user/repo.git`), kde se většinou ověřujete jménem a heslem (nebo tokenem). Nebo přes **SSH** (`git@github.com:user/repo.git`), což je bezpečnější a pohodlnější pro vývojáře, protože využívá vaše veřejné/soukromé SSH klíče a nemusíte pokaždé zadávat heslo. Existuje i protokol `file://` pro klonování z lokálního disku nebo sdíleného disku (`git clone file:///Z:/company/repo.git`).

## 3. Standardizace repozitáře: .gitattributes

Předtím, než začnete psát kód, je v profesionální praxi standardem založit v kořeni repozitáře soubor `.gitattributes`. 
Zatímco známější `.gitignore` (který Gitu říká, kterých souborů si nemá všímat) se používá k potlačení dočasných složek a generovaných dat, `.gitattributes` Gitu říká, **jak přesně má se sledovanými soubory zacházet**.

Nejčastější a nejkritičtější použití je **zalamování řádků (Line Endings)**. Windows používá pro konec řádku znaky `CRLF`, zatímco Linux a macOS používají pouze `LF`. Pokud v týmu pracují lidé na různých systémech, Git by neustále hlásil obrovské falešné změny na každém řádku, protože by se "praly" konce řádků z různých editorů.

Dříve se to řešilo globálním nastavením `git config --global core.autocrlf true`, což ale působilo zmatky, protože každý vývojář to mohl mít nastaveno jinak. Dnes je jediným správným řešením vytvoření souboru `.gitattributes`, čímž se pravidla vynutí pro všechny automaticky:
```text
# Pokaždé převést textové soubory na LF při nahrání do Gitu (do databáze)
# ale při stažení zpět na Windows je pro lokální editory automaticky konvertovat na CRLF.
* text=auto

# Vynutit si čisté LF například pro bash skripty, aby na Linuxových serverech nikdy nezhavarovaly
*.sh text eol=lf
```
Tímto jediným souborem zabráníte množství budoucích komplikací při spolupráci ve smíšených týmech.

> [!TIP] Dodatečná náprava: Renormalizace
> Pokud jste do projektu přidali soubor `.gitattributes` až dodatečně, nebo jste zjistili, že už máte v databázi nahrané nesprávné konce řádků (CRLF) a všechny soubory najednou "svítí" jako upravené, stačí spustit tzv. renormalizaci:
> ```bash
> git add --renormalize .
> git commit -m "Normalizace konců řádků na čisté LF"
> ```
> Git celý adresář přečte znovu a tvrdě aplikuje pravidla z `.gitattributes`.
