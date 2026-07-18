# Práce se vzdálenými repozitáři (Remotes)

Kouzlo Gitu a jeho distribuované povahy naplno využijete až ve chvíli, kdy začnete sdílet kód s ostatními nebo ho zálohovat. Zde přicházejí do hry "Vzdálené repozitáře" (Remotes).

Remote (vzdálený repozitář) je v podstatě jen URL adresa a jméno (alias), pod kterým si váš lokální Git tuto adresu pamatuje. Můžete mít přidáno remotes několik (jeden pro čtení původního open-source projektu, jeden pro zápis na váš GitHub fork, jeden pro nasazení kódu na produkční server).

## Zobrazení aktuálních remotes

Abychom viděli, jaké servery máme nakofigurované:
```bash
git remote -v
```
Výpis ukáže alias a url:
```text
origin  https://github.com/user/project.git (fetch)
origin  https://github.com/user/project.git (push)
```
Výchozí jméno pro první remote repozitář, ze kterého jste kód zklonovali (příkazem `git clone`), je **origin**. Není na něm nic složitého, je to prosté slovo, které se běžně používá místo psaní dlouhé URL adresy. 

Stejně jako výchozí větev je `main` (nebo `master`), tak výchozí remote je `origin`.

## Přidání a správa remotes

Pokud jste repozitář vytvořili lokálně pomocí `git init`, nemáte žádný remote. Musíte ho přidat ručně:

```bash
git remote add origin git@github.com:moje-jmeno/muj-repozitar.git
```
Příkaz `add` bere dva parametry: jméno (alias, v našem případě `origin`) a adresu.

**Změna adresy u existujícího remote** (např. když firma přejde z GitLabu na GitHub):
```bash
git remote set-url origin https://novy-server.com/repo.git
```

**Smazání remote** (Smaže pouze zástupce z vaší lokální konfigurace, nesmaže repozitář na vzdáleném serveru!):
```bash
git remote rm origin
```

**Přejmenování remote:**
```bash
git remote rename origin stary-origin
```

## Vzdáleně sledující větve (Remote-tracking branches)

Toto je velmi důležitý koncept. Git si ve vašem `.git` adresáři udržuje lokální kopie toho, jak vypadaly větve na serveru v době, kdy jste se serverem naposledy komunikovali.

Říká se jim **Remote-tracking branches** a obvykle vypadají takto: `<jmeno-remote>/<jmeno-vetve>`.
Například: `origin/main` nebo `origin/feature-login`.

*   `main` je VAŠE lokální větev.
*   `origin/main` je LOKÁLNÍ KOPIE toho, jak vypadala větev `main` na serveru `origin` naposledy, když jste s ním mluvili. 

> [!TIP] Otevřete oči
> Je naprosto klíčové si uvědomit, že `origin/main` se NEAKTUALIZUJE AUTOMATICKY PŘES INTERNET. Pokud na server nahraje kód váš kolega, váš ukazatel `origin/main` se neposune, dokud z toho serveru neprovedete stažení dat. Větve typu `origin/*` jsou read-only. Nemůžete do nich dělat commity vy. Posunuje s nimi výhradně a pouze sám Git ve chvíli, kdy komunikuje se serverem.

Pokud chcete vidět všechny lokální i vzdálené (remote-tracking) větve pohromadě, napište:
```bash
git branch -a
```

## Mazání na vzdáleném serveru

Lokální větve se mažou pomocí `git branch -d`. Pro smazání větve nebo tagu na vzdáleném serveru (např. na GitHubu) se používá příkaz `push` se speciálním parametrem `--delete`.

**Smazání vzdálené větve:**
```bash
git push origin --delete <jmeno-vetve>
```

**Smazání vzdáleného tagu:**
```bash
git push origin --delete <jmeno-tagu>
```

> [!TIP] Úklid mrtvých duší: Fetch Prune
> Pokud kolega smaže větev na GitHubu, vám po klasickém `git fetch` její zástupce `origin/jmeno-vetve` na disku **zůstane** navždy jako mrtvá duše. Abyste Gitu řekli, že má smazané větve ze serveru vymazat i z vašeho lokálního seznamu, použijte parametr prune:
> ```bash
> git fetch --prune
> ```
