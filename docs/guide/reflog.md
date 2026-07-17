# Záchrana ztracených dat (Git Reflog)

Pokud jste četli kapitolu o Hard resetu nebo přepisování historie přes Rebase, možná vás napadlo, že s Gitem je vlastně docela snadné přijít o hodiny práce, pokud napíšete špatný příkaz.

Pravdou však je, že **v Gitu je poměrně obtížné skutečně ztratit data**, pokud jste je někdy aspoň jednou komitnuli (nebo aspoň uložili do Stashe). Dokonce i když větev smažete (`git branch -D`) nebo uděláte `git reset --hard` o 10 commitů zpět, vaše objekty s kódem jsou na disku v `.git/objects` stále dostupné. Git je totiž tzv. "append-only" databáze. Promazává ji až Garbage Collector většinou po mnoha dnech nebo měsících.

Problém je, že ty smazané commity už "visí ve vzduchu" (tzv. dangling commits). Nevede na ně žádná pojmenovaná větev, takže je nemáte jak najít, protože neznáte jejich 40místný SHA-1 hash.

A přesně proto existuje **Reflog (Reference Log)** - hlavní záchranná síť Gitu.

## Co je to Reflog?

Git si na pozadí, na vašem lokálním stroji, zapisuje deníček. Tento deníček si eviduje **každý pohyb ukazatele HEAD**, ke kterému došlo za posledních cca 30 dní.

Přepnuli jste větev? Do deníčku. Udělali jste commit? Do deníčku. Udělali jste hrůzný omyl v podobě `git reset --hard HEAD~5` a smazali jste si práci? Do deníčku.

```bash
git reflog
```

Výstup bude vypadat jako magie:
```text
8b2d45c (HEAD -> main) HEAD@{0}: reset: moving to HEAD~2
a1b2c3d HEAD@{1}: commit: Funkce generování PDF
9f8e7d6 HEAD@{2}: checkout: moving from test to main
4x3y2z1 HEAD@{3}: commit (amend): Oprava login stránky
```

Přečtěme si výše uvedený log z pohledu vývojáře. Vidíme (úplně nahoře), že jsme před chvílí omylem udělali reset a stojíme teď na commitu `8b2d45c`. Jenže vidíme i to, že těsně před tou chybou (`HEAD@{1}`) jsme udělali rozsáhlý a pracný commit "Funkce generování PDF" s hashem `a1b2c3d`.

## Jak vzkřísit mrtvého?

Není nic jednoduššího. Nyní, když známe přesný hash onoho ztraceného commitu (který by jinak v logu nikdy nebyl vidět), můžeme na ten hash tvrdě resetovat zpět, čímž do onoho "budoucího" a smazaného bodu posuneme naši větev. Cestování v čase oběma směry.

```bash
git reset --hard a1b2c3d
# (Nebo alternativně: git reset --hard HEAD@{1})
```

A je to. Váš ztracený kód se znovu zjeví ve vašem editoru.

### Záchrana smazané větve
Pokud jste omylem dali `git branch -D nova-vzhled` a chcete tu větev zpět, najděte v reflogu bod, kdy jste na té větvi dělali poslední commit (nebo kdy jste z ní odcházeli), poznamenejte si jeho hash (např. `f5g6h7j`) a založte na tom bodě větev novou!

```bash
git branch nova-vzhled f5g6h7j
```

> [!TIP] Reflog je jen váš
> Reflog záznamy se NIKDY neposílají na server přes `git push`. Je to čistě váš lokální deník. To znamená, že vás to zachrání z vašich chyb, ale pokud vymažete historii a pošlete to na server a kolega si tu zničenou historii přes `git pull` stáhne, už ho nezachráníte vaším reflogem. On se bude muset podívat do svého vlastního.
