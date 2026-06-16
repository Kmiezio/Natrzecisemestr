# Natrzecisemestr
-----

### Osoby 
- Jakub Miezio (Lider)
- Mateusz Tomczuk 
- Kuba kirej

### Obszar
GRY

### Wstępny koncept:
Stworzenie bibliotegi gier coś w stylu SteamDB (plan jest o wyszukiwaniu gier i wiadaomości na jej temat (ceny, liczba graczy, możliwie książki lub seriale powiązane z grą)

### Używane API 
- Dokumentacja Steam Web API

## Podział prac i odpowiedzialności w projekcie

###  Jakub Miezio (Lider)
* **`kontakt-form.js` / `kontakt-form.css`** – logika dynamicznego formularza, walidacja danych, system ocen oraz przechowywanie opinii w `localStorage`.
* **`premiery.html` / `premiery.js`** – kalendarz nadchodzących premier gier, integracja z zewnętrznym RAWG API oraz filtrowanie wyników po datach i platformach.
* **`szczegoly-premiery.html` / `szczegoly-premiery.js`** – dynamiczny widok szczegółowych informacji o wybranej z kalendarza premierze gry.
* **`kontakt.html`** – oraz struktura kontenerów dla sekcji opinii użytkowników.

###  Kuba Kirej
* **`index.html` / `script.js`** – strona główna serwisu, integracja z CheapShark API (baza promocji cenowych), wyszukiwarka ofert oraz mechanizm „Załaduj więcej”.
* **`szczegoly.html`** – podstrona prezentująca szczegóły konkretnej promocji, procentowe oszczędności, oceny Steam oraz bezpośredni link do sklepu.
* **`kontakt.html`** – szkielet podstrony kontaktowej oraz struktura kontenerów dla sekcji opinii użytkowników.

###  Mateusz Tomczuk (Już nie jest w grupie)
* **`style.css`** – kompletna architektura wizualna i stylistyka całego serwisu utrzymana w spójnej gamingowej estetyce *Dark Mode* (czerń i neonowa zieleń).
* **Responsywność (RWD)** – dostosowanie interfejsu (nagłówka, menu nawigacyjnego, stopki oraz siatki kart z grami) do poprawnego wyświetlania na smartfonach i tabletach.
