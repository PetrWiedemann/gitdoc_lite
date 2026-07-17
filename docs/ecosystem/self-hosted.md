# Firemní nasazení a Self-hosted Git Servery

Zatímco GitHub, GitLab SaaS nebo Bitbucket jsou skvělé služby pro open-source i firmy, mnoho společností, státních institucí, bank nebo technologických korporací má velmi přísná bezpečnostní pravidla. Firemní kód (intelektuální vlastnictví) nesmí opustit interní podnikovou síť a ležet na cizích cloudech.

V takovém případě musí firma zprovoznit tzv. **Self-hosted Git Server**. Tedy nainstalovat si software na vlastní železo, ve vlastní serverovně, plně pod vlastní kontrolou.

## Enterprise řešení (S těžkým kalibrem)

Pokud firma potřebuje všechny funkce jako má GitHub (Pull requesty, Code Review UI, Issue trackery, CI/CD pipelines), musí sáhnout po komplexním softwaru.

1.  **GitLab (Self-Managed):** Asi nejpopulárnější volba pro velké firmy. GitLab lze nainstalovat na vlastní server. Nabízí neuvěřitelně masivní ekosystém všeho, co firma pro vývoj potřebuje, včetně vlastního integrovaného Docker registru a fantastického CI/CD. Existuje bezplatná komunitní verze a placená Enterprise edice.
2.  **GitHub Enterprise Server:** Přímo od Microsoftu. Dostanete virtuální mašinu (appliance), kterou si rozběhnete ve svém datacentru. Máte tak na své IP adrese 100% klon GitHubu. Bývá finančně nákladný, ale oblíbený díky tomu, že všichni znají jeho uživatelské rozhraní.
3.  **Bitbucket Data Center:** Řešení od Atlassianu. Často ho volí firmy, které už masivně využívají Jiru a Confluence, protože integrace mezi Bitbucketem a Jirou je bezkonkurenční (např. automatické přesouvání tiketů v Jiře podle toho, v jakém stavu je v Bitbucketu Pull Request).

## Odlehčená a rychlá řešení (Pro menší týmy a servery)

Pokud nevyžadujete CI/CD kolosy, existují open-source alternativy napsané převážně v jazyce Go, které vyžadují minimum operační paměti a dají se nainstalovat i na zařízení jako Raspberry Pi.

1.  **Gitea:** Napsané v Go, velmi rychlé, lehké. Vizuálně se velmi podobá GitHubu, takže křivka učení pro vývojáře je minimální. Má podporu pro Pull Requesty, Issues i jednoduché Actions. Velmi oblíbené v self-hosted komunitě.
2.  **Forgejo:** Hard-fork projektu Gitea. Vznikl po určitých sporech uvnitř vývojářského týmu Gitey ohledně komercializace. Poskytuje téměř totožnou funkčnost jako Gitea.
3.  **Gogs:** Předchůdce Gitey (Gitea vznikla jako fork Gogsu). Ještě o malinko lehčí, ale už ne tak rychle vyvíjený.

## Ultra-minimalismus: Git server přes SSH (Bez UI)

Ne každý ví, že ke sdílení kódu v týmu vůbec **nepotřebujete žádné webové rozhraní**. Samotný Git je navržen tak, aby dokázal bezpečně fungovat po obyčejném SSH protokolu. Pokud máte Linuxový server (VPS), ke kterému se připojíte přes SSH, máte Git server hotový za minutu.

**Jak na to (na serveru):**
```bash
# Připojíte se přes SSH na váš server
ssh uzivatel@muj-server.cz

# Vytvoříte složku pro repozitář
mkdir muj-projekt.git
cd muj-projekt.git

# Inicializujete BARE repozitář
git init --bare
```

**Co je `--bare`?**
Bare repozitář nemá žádný Working Directory. Nejsou v něm žádné HTML, JS nebo CSS soubory, které byste si mohli přečíst. Je to jen čistá databáze (obsah skryté složky `.git` rozbalený přímo do rootu `muj-projekt.git`). Nikdo na tomto serveru kód needituje, server slouží JEN jako přestupní stanice pro odesílání a přijímání změn.

**A teď na svém počítači (klient):**
```bash
# Přejdete do svého lokálního hotového kódu
cd muj-lokalni-projekt

# Přidáte server jako remote
git remote add origin ssh://uzivatel@muj-server.cz/cesta/k/muj-projekt.git

# Odeslání (Push) dat
git push -u origin main
```
Hotovo! Nyní se váš kolega může pomocí `git clone ssh://...` připojit ke stejnému serveru a můžete bez problémů a bezpečně spolupracovat bez jakéhokoliv drahého softwaru. Nevýhodou je samozřejmě absence vizuálních Pull Requestů a diskuzí ke kódu.
