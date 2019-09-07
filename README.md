# Destination Line #

## Introduktion ##
Produkten är en webbaserad social plattform där bildhantering är en stor del. Produktens syfte är att kunna dela bilder och inlägg till övriga besökare på sidan. Varje användare har en profil med sina uppladdade album från olika rese-tillfällen på en tidslinje för bättre användarupplevelse. För att bli en användare krävs registrering med e-post, användarnamn och lösenord där varje användarnamn och e-post måste vara unikt. Som användare kan du följa andra användare och kommentera inlägg. En sökfunktion kommer att fungera som en reseguide, genom att du söker på land/stad/sevärdheter/användarnamn eller e-post. Besökare som inte har ett användarkonto har ändå möjlighet att använda sökfunktionen för att få inspiration och tips på destinationer. Startsidan består av “populära länder” och en sökruta, de populära länderna består av interaktiva bilder som man kan klicka på. Populära länder baseras på länder där flest inlägg postas från. Därefter kommer man till en sida med inlägg inom kategorin man valt, ordningen som inläggen visas i är baserad på rankning med flest följare. När man klickar in på ett inlägg kommer man till användarens profil som skapat inlägget, där kan man läsa inlägget samt se användarens tidslinje för att utforska vidare.  

## Installation ##
### Windows & Mac ###
Installera Pip-moduler från requirements.txt:
```bash
pip install -r requirements.txt
```
## Förberedelser ##
Skapa en PostgreSQL databashanterare (Version > 11)

## Konfiguration ##
Konfiguration sker i config.py

## Användning ##
- Starta serverprogrammet genom "run.py"-filen (python3 run.py).
- Gå till "127.0.0.1:5000" i en valfri webbläsare.
