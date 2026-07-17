# GitHub a jeho integrace s Gitem

Zatímco Git je samotný verzovací nástroj běžící u vás na počítači, GitHub je komerční hostingová služba založená na webu (vlastněná společností Microsoft), která poskytuje prostor pro sdílení Git repozitářů, ale navíc k nim přidává obrovskou vrstvu pro spolupráci.

Git můžete používat bez GitHubu, ale v dnešním softwarovém světě je to téměř nemyslitelné. GitHub vytvořil koncepty, které samotný Git nezná.

## 1. Forking (Vidličkování)

V klasickém firemním prostředí máte jeden centrální repozitář, všichni do něj mají právo zápisu a všichni z něj klonují a dělají push. V open-source světě by to ale byl chaos a obrovské bezpečnostní riziko. Kód Linuxu by zničil kdokoliv do minuty.

GitHub to řeší pomocí konceptu **Fork**.
Pokud chcete přispět do cizího open-source projektu na GitHubu, kliknete na tlačítko "Fork". To nevytvoří lokální kopii u vás na disku, ale vytvoří to **kompletní kopii repozitáře na serverech GitHubu, ale ve vašem osobním účtu**. V tomto vašem forku máte absolutní práva (můžete tam zapisovat jak chcete).

1. Kliknete na Fork na GitHubu (vznikne `github.com/vase-jmeno/linux`).
2. Tento SVŮJ fork si zklonujete k sobě na disk (`git clone ...`).
3. Pracujete, komitujete, tvoříte větve.
4. Pošlete větve příkazem `git push` zpět do svého forku.

## 2. Pull Requesty (Žádosti o stažení)

Nyní máte skvělý kód ve svém forku, ale chcete ho dostat k původnímu autorovi. Otevřete na GitHubu tzv. **Pull Request (PR)**. (V ekosystému GitLabu se to jmenuje *Merge Request*).

PR je v podstatě žádost typu: *"Ahoj správce původního repozitáře. Na této své větvi v mém forku jsem napsal skvělý kód. Mohl by sis ho prosím stáhnout (pull) a sloučit (merge) do své hlavní větve?"*

### Code Review (Revize kódu)
PR není jen o sloučení kódu. Otevře se diskuzní vlákno. Správci si prohlédnou váš Diff. Mohou přidávat komentáře ke konkrétním řádkům kódu (např. "Tady máš bezpečnostní chybu, přepiš to"). Vy to na svém počítači opravíte, uděláte nový commit a pošlete ho do své větve. GitHub PR se automaticky zaktualizuje. 
Až jsou všichni spokojení, správce klikne na velké zelené tlačítko "Merge Pull Request", které provede standardní `git merge` v pozadí na jejich serveru.

> [!TIP] Pull Requesty ve firmách
> Ačkoliv firmy nepoužívají forky (všichni vývojáři sdílí jeden repozitář), koncept Pull Requestů se používá i tam! Vývojář pošle svou větev na firemní GitHub (`git push origin feature-A`) a rovnou z ní vytvoří PR do větve `main`. Slouží to jako povinné "razítko kvality" – kód se nedostane do produkce, dokud ho v PR nezkontrolují alespoň dva další kolegové.

## 3. GitHub Actions (CI/CD)

Moderní repozitáře nejsou jen skladištěm. Git sám o sobě kód nespouští. GitHub Actions je nástroj pro automatizaci, který je integrován přímo do repozitáře.

Do složky `.github/workflows/` vkládáte YAML soubory. Můžete definovat pravidla jako: *"Pokaždé, když někdo založí Pull Request, automaticky na čistém serveru GitHubu stáhni kód, nainstaluj závislosti, spusť unit testy, a pokud některý spadne, zablokuj zelené tlačítko Merge v Pull Requestu."*

## Další funkce GitHubu
*   **Issues:** Integrovaný "to-do list" a bug tracker. Lze propojovat s commity (když do commit zprávy napíšete `Fixes #42`, po mergi se automaticky zavře chyba číslo 42).
*   **GitHub Pages:** Pokud do speciální větve `gh-pages` umístíte HTML soubory, GitHub je automaticky vystaví na internetu zdarma jako veřejnou webovou stránku.

## 4. Ochrana soukromí: E-mailové adresy v commitech

V Gitu je autorství commitu napevno svázáno s e-mailovou adresou, kterou jste si nastavili na svém počítači pomocí `git config user.email`. Když váš commit odešlete na veřejný GitHub repozitář, kdokoliv si ho stáhne, na věky uvidí vaši e-mailovou adresu v historii (`git log`). Vývojáři se tak často stávají terčem spamu.

GitHub poskytuje dva vestavěné mechanismy, jak vaše soukromí absolutně ochránit:

### Nastavení na GitHubu (Webové rozhraní)
V nastavení vašeho profilu na GitHubu (položka *Settings* -> *Emails*) si můžete zaškrtnout dvě klíčové volby:
1. **Keep my email addresses private** (Udržovat mé e-maily v soukromí).
2. **Block command line pushes that expose my email** (Zablokovat nahrání z příkazové řádky, pokud obsahuje můj skutečný e-mail).

Zejména druhá volba je skvělá pojistka. Pokud ji zapnete, GitHub okamžitě odmítne každý váš pokus o `git push`, ve kterém by detekoval, že vaše commity obsahují vaši skutečnou e-mailovou adresu, a nahlásí chybu v terminálu, čímž vás uchrání před chybou.

### Konfigurace vašeho Gitu pomocí `noreply` adresy
Když zaškrtnete první zmíněnou volbu, GitHub vám pro maskování identity přidělí speciální, "slepou" adresu ve formátu `ID+uzivatelskejmeno@users.noreply.github.com`. Tu najdete vypsanou přímo tam v nastavení e-mailů.

Tuto adresu pak stačí jednoduše podstrčit vašemu lokálnímu Gitu, aby ji používal při vytváření všech budoucích commitů namísto vašeho skutečného e-mailu.

**Globální nastavení (pro všechny vaše repozitáře na počítači):**
```bash
git config --global user.email "1234567+PepaNovak@users.noreply.github.com"
```

**Lokální nastavení (pouze pro vybraný repozitář):**
Pokud chcete tuto skrytou `noreply` adresu používat jen u veřejných open-source projektů, ale ve vaší firemní složce chcete dál tvořit commity pod svým skutečným firemním e-mailem, stačí vlézt do složky s veřejným projektem a nastavit e-mail lokálně (tj. smazat z příkazu slovíčko `--global`):
```bash
git config user.email "1234567+PepaNovak@users.noreply.github.com"
```
Od tohoto okamžiku se budou vaše commity na GitHubu pro lidi tvářit jako anonymní, GitHub si je vnitřně ale naprosto správně spáruje s vaším profilem a statistikou, avšak nikdo cizí neuvidí váš skutečný e-mail.
