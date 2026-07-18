# Autentizace a přístup

Ačkoliv Git na lokálním počítači funguje naprosto bez přihlašování, jakmile chcete svůj kód sdílet na vzdálený server (GitHub, GitLab, firemní Bitbucket), narazíte na nutnost prokázat svou identitu, aby vám server povolil změny zapsat (Push).

Historicky se hojně využívalo jméno a statické heslo, dnes to ale kvůli bezpečnosti většina serverů (včetně GitHubu) striktně zakazuje.

Dnes máte dvě hlavní cesty, jak s Gitem bezpečně a pohodlně komunikovat: HTTPS nebo SSH.

## 1. HTTPS a Git Credential Manager

HTTPS (přístup přes url typu `https://github.com/user/repo.git`) je dnes preferovanou a uživatelsky nejpřívětivější metodou pro drtivou většinu vývojářů.

Změna je v tom, že místo statického hesla dnes musíte zadat tzv. **Personal Access Token (PAT)** – vygenerovaný dlouhý řetězec, kterému na GitHubu nastavíte práva (např. jen na čtení repozitářů na 30 dní).

### Git Credential Manager (GCM)
Aby ale po vás Git nevyžadoval ten dlouhý nesmyslný token přilepovat při každém `git push` nebo `git pull`, existuje pomocný program **Git Credential Manager**.

Pokud si GCM nainstalujete (ve Windows se u instalace Gitu přidává automaticky jako výchozí volba, na macOS/Linuxu jej lze doinstalovat), stane se toto:
1. Zadáte `git push`.
2. GCM to zachytí a místo terminálu vám **otevře okno prohlížeče**.
3. V prohlížeči se normálně přihlásíte na GitHub, odkliknete 2FA (dvoufázové ověření v mobilu).
4. GCM si na pozadí sám vygeneruje bezpečný token a uloží si ho do systémové Klíčenky (Windows Credential Manager / macOS Keychain).
5. Už nikdy nemusíte nic zadávat, vše je maximálně bezpečné.

## 2. Připojení přes SSH (Secure Shell)

Alternativou k HTTPS je starší, "vývojářštější", ale velmi robustní připojení přes SSH (URL typu `git@github.com:user/repo.git`). Používá se hojně na Linuxových serverech a při propojování s automatizovanými CI/CD systémy.

Zde nevyplňujete žádné jméno a heslo, ale prokazujete se tzv. **kryptografickým klíčem**.

### Jak funguje SSH klíč
Systém SSH klíčů funguje jako zámek a klíč:
*   **Privátní klíč (klíč):** Tajný soubor (např. `id_rsa` nebo `id_ed25519`), který leží schovaný hluboko u vás na disku. Nesmíte ho nikomu dát.
*   **Veřejný klíč (zámek):** Soubor končící na `.pub`. Ten nahrajete na GitHub.

Když se snažíte o `git push`, GitHub se podívá, jestli onen zámek u vašeho účtu na serveru pasuje do klíče, kterým k němu ze svého počítače kroutíte. Pokud ano, pustí vás.

### Generování nového klíče (Windows / Mac / Linux)

Pokud ještě klíč nemáte, otevřete terminál a zadejte:
```bash
ssh-keygen -t ed25519 -C "vas.email@priklad.cz"
```
*(Algoritmus ed25519 je dnes doporučovaný standard, je kratší a bezpečnější než starý RSA).*

Terminál se vás zeptá, kam má klíč uložit (stačí odentrovat výchozí cestu `~/.ssh/id_ed25519`) a nabídne vám zadat **Passphrase** (heslo ke klíči). Zde se doporučuje heslo vyplnit pro vyšší bezpečnost, ale pokud ho necháte prázdné a jen odentrujete, nebude vás to při každém Push otravovat o heslo (bezpečnost pak zajišťuje samotný fakt, že nikdo nesmí ukrást ten soubor z vašeho disku).

### Přidání klíče na GitHub

Následně musíte obsah toho **veřejného** klíče nahrát na GitHub. Vypište si ho do terminálu (nebo otevřete v notepadu):
```bash
cat ~/.ssh/id_ed25519.pub
```
*(Zkopírujte celý vypsaný řádek začínající `ssh-ed25519...`)*

Jděte na GitHub do **Settings** -> **SSH and GPG keys** -> **New SSH key**. Vložte jej tam. Od této chvíle vás GitHub pustí bez ptaní ke všem repozitářům spojeným s vaším účtem (pokud je budete klonovat přes SSH URL).
