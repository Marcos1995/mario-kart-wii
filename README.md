# Mario Kart Wii

Archivo de las 145 competiciones oficiales del Canal Mario Kart, de mayo de 2008 a mayo de 2014. Nintendo las publicaba dos veces al mes, del día 1 al 10 y del 15 al 25. Los servidores oficiales cerraron el 20 de mayo de 2014.

Las clasificaciones de esta copia salen de [ninrankings.org](https://ninrankings.org/competitions/), que sigue publicando las tablas. El circuito y las reglas salen de la [lista de la Super Mario Wiki](https://www.mariowiki.com/List_of_Mario_Kart_Wii_tournaments).

La web de origen no ofrece un top 1000 fijo. Cada tabla guarda todas las filas que todavía sirve: en unos mundiales son unos cientos y en otros pasan de mil. Japón, Norteamérica, Europa y Australia guardan su propia tabla. Corea no devuelve filas.

## Cómo verlo

```bash
npm install
npm run dev
```

El comando abre el archivo en el puerto 3847.

La página pública, cuando el repositorio `mario-kart-wii` está en GitHub y GitHub Pages está activo, es [https://marcos1995.github.io/mario-kart-wii/](https://marcos1995.github.io/mario-kart-wii/). El archivo `index.html` lo genera la compilación estática; GitHub Pages lo publica desde la acción `.github/workflows/pages.yml`.

## Qué hay guardado

- `public/data/catalog.json`: las 145 competiciones, fechas, circuito, reglas y campeón.
- `public/data/rankings/001.json` … `145.json`: cada puesto, con jugador, tiempo, región, país, personaje, vehículo, mando y fecha.
- `public/data/players.json`: el mismo historial agrupado por nombre.
- `public/data/leaders.json`: quién ganó más mundiales, títulos regionales y podios.

Un tiempo por debajo de cinco segundos se conserva en su puesto y se marca como anómalo. El servidor oficial aceptó marcas imposibles, como 0:00.001. Las estadísticas de campeones usan el primer tiempo real.

Los nombres se cuentan tal como están escritos. Dos cuentas son dos nombres, aunque fueran la misma persona.

Para volver a copiar las tablas, si la web de origen sigue en pie:

```bash
python3 scripts/build_archive.py
```
