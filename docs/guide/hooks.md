# Git Hooks (Háčky)

Git obsahuje mechanismus, který vám umožňuje automaticky spustit nějaký vlastní skript pokaždé, když dojde k určité významné události (např. před commitováním, po pushnutí, při přijetí dat na serveru atd.). Tyto skripty se nazývají **Hooks** (Háčky).

Jsou vynikajícím nástrojem pro vynucování týmových konvencí, spouštění linterů nebo posílání notifikací.

## Kde Hooky žijí?

Pokud se podíváte do jakéhokoliv Git repozitáře, ve skryté složce najdete adresář `.git/hooks`. 
Git sem při `git init` automaticky generuje spoustu ukázkových skriptů s koncovkou `.sample` (např. `pre-commit.sample`). Aby hook začal fungovat, stačí mu odmazat koncovku `.sample` a ujistit se, že má v operačním systému právo na spuštění (executable).

Skript může být napsán v jakémkoliv jazyce, který umí váš systém spustit – Shell (bash), Python, Ruby, Perl atd. Rozhodující je, zda skript vrátí chybový kód `0` (úspěch - akce pokračuje) nebo cokoliv jiného (neúspěch - Git akci zruší).

## Nejpoužívanější Hooky na straně klienta

### 1. `pre-commit`
Tento hook se spustí ihned poté, co napíšete `git commit`, ještě předtím, než od vás Git vyžaduje commit message.
*   **Využití:** Kontrola kódu. Můžete zde spustit linter (ESLint, Prettier), statickou analýzu, nebo testy. Pokud skript zjistí, že kód porušuje standardy, vrátí chybový kód `1` a Git commit vůbec nevytvoří. Tím se zaručí, že do repozitáře nikdy nepronikne "ošklivý" kód.
*   **Obejití:** Pokud máte dobrý důvod (třeba je to urgentní hotfix), můžete ho přeskočit pomocí `git commit --no-verify`.

### 2. `commit-msg`
Spouští se po zadání zprávy k commitu, ale před jeho vytvořením. Skript dostane cestu k dočasnému souboru obsahujícímu vaši textovou zprávu.
*   **Využití:** Validace formátu commit message. Používá se pro vynucení konvencí typu *Conventional Commits* (např. kontrola, zda zpráva začíná na "feat:", "fix:" apod.). Může také zkontrolovat, zda zpráva obsahuje ID tiketu z Jiry.

### 3. `pre-push`
Spouští se předtím, než se data začnou odesílat na vzdálený server (`git push`).
*   **Využití:** Poslední pojistka. Spuštění sady těžkých testů, abyste neposlali rozbitý kód kolegům. 

## Problém s distribuováním Hooků

Adresář `.git` (včetně složky `hooks`) se **neklonuje** ani se neposílá na server při pushnutí. Pokud napíšete skvělý bashový skript pro linter do svého `pre-commit`, vaši kolegové ho u sebe mít nebudou.

### Moderní řešení pro JavaScript/TypeScript projekty: Husky
V ekosystému Node.js se tento problém stal natolik velkým, že vznikl nástroj **Husky**. Husky elegantně nastaví repozitář tak, aby se při `npm install` automaticky konfigurovaly sdílené hooky pro každého vývojáře. Pravidla (např. zavolání ESLintu nebo Lint-Staged) se komitují normálně do verzovaných souborů projektu (např. do složky `.husky/`) a díky tomu jsou zajištěna u celého týmu.

Pro ostatní jazyky (Python, PHP) se používají podobné nástroje jako *pre-commit framework*. Můžete také v Gitu změnit cestu, kde má hledat hooky: `git config core.hooksPath .githooks` a složku `.githooks` normálně verzovat.
