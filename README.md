# Destination Line #

## Introduktion ##
Produkten är en webbaserad social plattform där bildhantering är en stor del. Produktens syfte är att kunna dela bilder och inlägg till övriga besökare på sidan. Varje användare har en profil med sina uppladdade album från olika rese-tillfällen på en tidslinje för bättre användarupplevelse. För att bli en användare krävs registrering med e-post, användarnamn och lösenord där varje användarnamn och e-post måste vara unikt. Som användare kan du följa andra användare och kommentera inlägg. En sökfunktion kommer att fungera som en reseguide, genom att du söker på land/stad/sevärdheter/användarnamn eller e-post. Besökare som inte har ett användarkonto har ändå möjlighet att använda sökfunktionen för att få inspiration och tips på destinationer. Startsidan består av “populära länder” och en sökruta, de populära länderna består av interaktiva bilder som man kan klicka på. Populära länder baseras på länder där flest inlägg postas från. Därefter kommer man till en sida med inlägg inom kategorin man valt, ordningen som inläggen visas i är baserad på rankning med flest följare. När man klickar in på ett inlägg kommer man till användarens profil som skapat inlägget, där kan man läsa inlägget samt se användarens tidslinje för att utforska vidare.  

## Installation ##
### Windows & Mac ###
- Installera Python3 och Pip
- Installera följande Pip-moduler:
    - Flask (pip install flask)
    - Psycopg2 (pip install psycopg2)
    - Bcrypt (pip install bcrypt)
    - Pillow/PIL (pip install pillow)
### RaspberryPi ###
- Installera Raspbian Stretch
- Skriv följand kommandon:
    - sudo apt-get install python3-pil
    - Fler kommer snart..

## Användning ##
Starta serverprogrammet genom "start.py"-filen (python3 start.py).
Gå till "localhost" i en valfri webbläsare på datorn serverprogrammet körs på.
## Konfiguration ##
- Serverns ipadress ändras i start.py i variabeln SERVER_IP.
- Databaskoppling ändras i Database.py i variablerna DATABASE_*
    - DATABASE_NAME - Namn på databasen
    - DATABASE_USER - Användare som skall användas
    - DATABASE_HOST - Adress för databashanterare
    - DATABASE_PASSWORD - Lösenord för användaren
