# Nízkoúrovňové (Plumbing) příkazy Gitu

> [!CAUTION] VAROVÁNÍ: Riziko narušení repozitáře
> Tyto příkazy běžný vývojář nikdy nepotřebuje spouštět. Slouží jako stavební kameny (API), na kterých jsou postaveny příkazy uživatelské (Porcelain). 
> Používají se většinou ve skriptech nebo při zachraňování silně poškozených repozitářů. Zatímco `git commit` je bezpečný a zkontroluje spoustu věcí, použití `commit-tree` vytvoří objekt naslepo. Nesprávným použitím těchto příkazů můžete poškodit objekty nebo strom historie takovým způsobem, že Git přestane váš repozitář číst.

## 1. Prohlížení vnitřností

### `git cat-file`
Základní nástroj pro čtení z databáze `.git/objects`. Pokud máte SHA-1 hash jakéhokoliv objektu, tento příkaz vám ho ukáže.
*   `git cat-file -p <hash>` - Vypíše obsah objektu (blob, tree, commit) v čitelné podobě (pretty-print).
*   `git cat-file -t <hash>` - Řekne vám, jaký je to typ objektu (např. vrátí slovo `blob`).

### `git rev-parse`
Překládá cokoliv z Git žargonu (jména větví, tagy, `HEAD~3`) na absolutní 40místný SHA-1 hash. Velmi často se používá ve skriptech.
*   `git rev-parse HEAD` - Vypíše přesný hash aktuálního commitu.
*   `git rev-parse main` - Vypíše přesný hash vrcholu větve main.

### `git ls-tree`
Zobrazí obsah Tree (stromového) objektu – což je obdoba unixového příkazu `ls` pro zobrazení obsahu složky, ale čte se přímo z interní Git databáze.

## 2. Přímá manipulace s databází

### `git hash-object`
Vezme obsah zadaného souboru, vypočítá z něj hash a (volitelně) ho fyzicky zkomprimuje a zapíše jako nový `blob` objekt do `.git/objects`. Obejde to kompletně Staging Area.
*   `git hash-object -w soubor.txt` - `-w` znamená zapsat do databáze (Write). Git vrátí hash vytvořeného objektu.

### `git update-index`
Nejnižší možná úroveň pro zápis do Staging Area (indexu). Pomocí tohoto příkazu můžete do indexu natlačit existující blob z databáze pod určitým jménem souboru. Obyčejný `git add` je vlastně jen obalový skript, který na pozadí volá `hash-object` a `update-index`.

### `git write-tree`
Vezme aktuální stav vašeho Indexu (Staging Area) a vytvoří z něj v databázi skutečný `Tree` (stromový) objekt. Vyplivne vám jeho hash.

### `git commit-tree`
Finální složení commitu. Vezme hash stromového objektu (vytvořeného např. přes `write-tree`), přijme text zprávy (na standardním vstupu) a volitelně hash rodičovského commitu (`-p`). Vygeneruje skutečný objekt Commit.
```bash
echo "Manuální commit z podsvětí" | git commit-tree <hash-stromu> -p <hash-rodice>
```

> [!TIP] Poskládání celku
> Pokud by neexistoval příkaz `git commit`, psali byste při každém uložení toto:
> 1. `git hash-object -w <soubory>`
> 2. `git update-index --add --cacheinfo ...`
> 3. `TREE_HASH=$(git write-tree)`
> 4. `COMMIT_HASH=$(echo "zprava" | git commit-tree $TREE_HASH -p HEAD)`
> 5. `git update-ref refs/heads/main $COMMIT_HASH`
> 
> Git za vás dělá celou tuto instalatérskou práci automaticky na jeden krátký příkaz.
