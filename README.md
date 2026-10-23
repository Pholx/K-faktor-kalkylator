# K-Faktor & Böjtillägg (Kalkylator för kantbockning)

https://pholx.github.io/K-faktor-kalkylator/

En verklighetsnära, webbaserad kalkylator för kantbockning av plåt. 
Appen är byggd som en **PWA (Progressive Web App)**, 
vilket innebär att den kan installeras på din surfplatta eller telefon och köras helt offline i verkstaden.

## 🛠️ Funktioner
*   **K-faktor Beräkning:** Räknar ut K-faktorn baserat på material, tjocklek, innerradie och bockmetod.
*   **Bockmetoder:** Tar hänsyn till luftbockning, bottning och prägling (med visuella förklaringar).
*   **Utvikningskalkyl:** Beräknar Böjtillägg (BA), Bockavdrag (BD) och total platt längd.
*   **Återfjädring (Springback):** Uppskattar rekommenderad överbockning, särskilt viktigt för förhärdat stål och aluminium.
*   **Manuell Override:** Möjlighet att låsa ett beprövat K-värde (t.ex. 0.33) och direkt se hur mycket den platta längden ändras jämfört med det teoretiska värdet.
*   **Offline-stöd:** Fungerar felfritt utan internetuppkoppling efter första laddningen.

## 🚀 Hur man installerar (PWA)
1. Öppna appens URL i webbläsaren på din enhet (Safari på iOS, Chrome på Android/Windows).
2. **iOS (iPad/iPhone):** Tryck på "Dela"-ikonen och välj **"Lägg till på hemskärmen"**.
3. **Android/Chrome:** Tryck på de tre prickarna och välj **"Installera app"** eller **"Lägg till på hemskärmen"**.
4. Appen startar nu i helskärm och fungerar precis som en inbyggd app.

## 🧮 Bakomliggande formler
Appen använder etablerade industristandarder för plåtbearbetning (DIN 6935):
*   **Böjtillägg (BA):** `BA = (π/180) · vinkel · (R + K · T)`
*   **Bockavdrag (BD):** `BD = 2 · OSSB − BA` (där OSSB = tan(vinkel/2) · (R + T))
*   **Platt längd:** `L = A + B − BD`

## ⚠️ Ansvarsfriskrivning
Alla värden i appen är teoretiska uppskattningar. 
Verklig K-faktor påverkas av verktygsslitage, materialbatch, fiberriktning och exakt maskin. 
**Gör alltid en provbock** för produktionskritiska detaljer. 
Använd Override-funktionen för att låsa in dina verkstadsspecifika erfarenhetsvärden.
