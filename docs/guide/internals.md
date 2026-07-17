# Co je Git a jak myslí

Abychom mohli Git skutečně ovládnout a nebyli odkázáni jen na slepé kopírování příkazů ze Stack Overflow, je naprosto klíčové pochopit, jak Git přemýšlí o ukládání dat. Git se totiž fundamentálně liší od většiny ostatních verzovacích systémů (jako je Subversion nebo Perforce).

## Distribuovaný verzovací systém

Git je **distribuovaný verzovací systém (DVCS)**. To znamená, že na rozdíl od centralizovaných systémů (CVCS), kde je jedna centrální databáze historie a každý klient má jen "aktuální snímek" (checkout), v Gitu si každý klient plně zrcadlí celý repozitář včetně jeho kompletní historie. 

Pokud vypadne centrální server (např. GitHub), každý klient má na svém disku kompletní zálohu všeho a může ji použít k plné obnově serveru. Můžete pracovat offline – dělat commity, prohlížet historii, tvořit větve – a synchronizovat se s ostatními, až když jste opět připojeni.

## Snímky, ne rozdíly (Snapshots, Not Differences)

Toto je nejdůležitější koncept celého Gitu. 

Většina ostatních systémů (CVS, Subversion) ukládá data jako sadu počátečních souborů a k nim přiřazuje seznam změn (tzv. *deltas*), které se udály v čase. Systém si pamatuje: "V souboru A se na řádku 5 smazalo slovo 'foo'". Tomuto přístupu se říká verzování založené na deltech (delta-based version control).

**Git k datům přistupuje jako k sérii mini-snímků (snapshots) celého souborového systému.**
Pokaždé, když provedete commit (uložení stavu), Git v podstatě vyfotí aktuální stav všech vašich souborů a uloží odkaz na tento snímek. Aby byl efektivní, pokud se soubor od posledního snímku nezměnil, Git soubor neukládá znovu. Místo toho jen vytvoří odkaz na předchozí identický soubor, který už má uložený. 

Git je v podstatě **mini souborový systém s historií**, na jehož vrcholu je postavené uživatelské rozhraní (příkazy).

## Vše je ověřeno kontrolním součtem (Checksums)

Všechno v Gitu se před uložením prožene hashovací funkcí a až na základě jejího výsledku se s daty dále pracuje. To znamená, že je absolutně nemožné změnit obsah jakéhokoliv souboru nebo adresáře bez toho, aby to Git věděl.

Mechanismus, který k tomu Git používá, je SHA-1 hash. Jedná se o 40místný hexadecimální řetězec (např. `24b9da6552252987aa493b52f8696cd6d3b00373`), který je vypočítán z obsahu souboru a struktury adresářů.

Pokud změníte jeden jediný znak v souboru, změní se i jeho SHA-1 hash. Změní se hash souboru, čímž se změní hash adresáře (Tree), ve kterém soubor leží, čímž se změní hash nadřazeného adresáře atd. To poskytuje spolehlivou integritu dat. Nemůžete data ztratit nebo je zkorumpovat při přenosu po síti bez detekce.

## Git většinou data jen přidává

Téměř všechny akce, které v Gitu děláte, přidávají data do interní databáze. Je velmi obtížné dostat systém do stavu, kdy data smaže nebo udělá něco nevrátitelného (pokud se nesnažíte úmyslně odstraňovat historii nebo neuděláte tzv. "hard reset"). 

Jakmile vytvoříte commit, můžete bez obav experimentovat, zkoušet nové věci, slučovat větve a cokoli pokazíte, se většinou dá zachránit pomocí nástrojů jako je [Reflog](/guide/reflog).

> [!TIP] Přemýšlejte o Gitu jako o databázi s klíč-hodnota
> Kdykoliv vložíte data (soubor) do Gitu, Git vám vrátí klíč (SHA-1 hash). Pomocí tohoto klíče můžete kdykoliv data vytáhnout zpět. Nic se "neukládá do souboru s konkrétním jménem", vše se ukládá pod svým hashem obsahu.
