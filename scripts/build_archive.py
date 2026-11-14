#!/usr/bin/env python3
"""Copy every Mario Kart Wii competition ranking still published on ninrankings.org.

The official Nintendo Wi-Fi Connection servers shut down in May 2014. ninrankings.org
is a community mirror of those final tables. This script saves every row that mirror
still serves: the worldwide board (several hundred rows, not a fixed top 1000) and
the Japan, North America, Europe, Australia and Korea boards.
"""

from __future__ import annotations

import argparse
import json
import re
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public" / "data"
RANKINGS = DATA / "rankings"
WIKI_URL = "https://www.mariowiki.com/List_of_Mario_Kart_Wii_tournaments"
SOURCE = "https://ninrankings.org/competitions/"
UA = "MarioKartWiiArchive/1.0 (personal preservation copy of public rankings)"
ANOMALY_MS = 5000
PER_PAGE = 200

REGION_CODES = [
    ("worldwide", "all"),
    ("Japan", "1"),
    ("North America", "2"),
    ("Europe", "3"),
    ("Australia", "4"),
    ("Korea", "6"),
]
SCOPE_CODE = {
    "worldwide": "W",
    "Japan": "J",
    "North America": "N",
    "Europe": "E",
    "Australia": "A",
    "Korea": "K",
}

MONTHS = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12,
}

_rate_lock = threading.Lock()
_next_at = 0.0


def fetch(url: str, timeout: int = 45) -> str:
    global _next_at
    last_error: Exception | None = None
    user_agent = (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        if "mariowiki.com" in url
        else UA
    )
    for attempt in range(5):
        with _rate_lock:
            wait = _next_at - time.monotonic()
            if wait > 0:
                time.sleep(wait)
            _next_at = time.monotonic() + 0.2
        req = urllib.request.Request(url, headers={"User-Agent": user_agent})
        try:
            with urllib.request.urlopen(req, timeout=timeout) as response:
                raw = response.read()
            return raw.decode("utf-8", "replace")
        except (urllib.error.URLError, TimeoutError, ConnectionError) as error:
            last_error = error
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"failed to fetch {url}: {last_error}")


class WikiTable(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_table = False
        self.tables = 0
        self.rows: list[list[tuple[str, int]]] = []
        self.cur: list[tuple[str, int]] | None = None
        self.cell: list[str] | None = None
        self.rowspan = 1

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = {key: value or "" for key, value in attrs}
        if tag == "table" and "wikitable" in attr.get("class", ""):
            self.tables += 1
            self.in_table = self.tables == 1
        if not self.in_table:
            return
        if tag == "tr":
            self.cur = []
        elif tag in ("td", "th") and self.cur is not None:
            self.cell = []
            self.rowspan = int(attr.get("rowspan") or "1")
        elif tag == "br" and self.cell is not None:
            self.cell.append(" ")

    def handle_endtag(self, tag: str) -> None:
        if not self.in_table:
            return
        if tag in ("td", "th") and self.cell is not None and self.cur is not None:
            text = re.sub(r"\s+", " ", "".join(self.cell)).strip()
            self.cur.append((text, self.rowspan))
            self.cell = None
        elif tag == "tr" and self.cur is not None:
            self.rows.append(self.cur)
            self.cur = None
        elif tag == "table" and self.tables == 1:
            self.in_table = False

    def handle_data(self, data: str) -> None:
        if self.cell is not None:
            self.cell.append(data)


def expand_wiki_rows(rows: list[list[tuple[str, int]]]) -> list[list[str | None]]:
    grid: list[list[str | None]] = []
    pending: dict[int, tuple[str, int]] = {}
    width = 5
    for row in rows:
        line: list[str | None] = [None] * width
        cells = iter(row)
        for col in range(width):
            if col in pending:
                text, left = pending.pop(col)
                line[col] = text
                if left - 1 > 0:
                    pending[col] = (text, left - 1)
                continue
            try:
                text, rowspan = next(cells)
            except StopIteration:
                break
            line[col] = text
            if rowspan > 1:
                pending[col] = (text, rowspan - 1)
        grid.append(line)
    return grid


def competition_window(comp_id: int) -> tuple[str, str]:
    index = comp_id - 1
    month_index = 4 + index // 2
    year = 2008 + month_index // 12
    month = month_index % 12 + 1
    start_day, end_day = (1, 10) if index % 2 == 0 else (15, 25)
    return (
        date(year, month, start_day).isoformat(),
        date(year, month, end_day).isoformat(),
    )


def date_to_id(date_text: str) -> int | None:
    match = re.search(r"([A-Za-z]+)\s+(\d{4})", date_text)
    if not match or match.group(1) not in MONTHS:
        return None
    year = int(match.group(2))
    half_match = re.search(r"(\d)\s*$", date_text.strip())
    if half_match:
        half = int(half_match.group(1))
        return (year - 2008) * 24 + (MONTHS[match.group(1)] - 5) * 2 + half
    if match.group(1) == "May" and year == 2014:
        return 145
    return None


def wiki_metadata() -> dict[int, dict[str, str]]:
    html = fetch(WIKI_URL)
    parser = WikiTable()
    parser.feed(html)
    grid = expand_wiki_rows(parser.rows)
    events: list[tuple[int, dict[str, str]]] = []
    for row in grid[1:]:
        comp_id = date_to_id(row[3] or "")
        if comp_id is None or not 1 <= comp_id <= 145:
            continue
        restrictions = (row[4] or "").strip()
        if restrictions in {"", "N/A", "None"}:
            restrictions = ""
        events.append(
            (
                comp_id,
                {
                    "course": (row[1] or "").strip(),
                    "description": (row[2] or "").strip(),
                    "restrictions": restrictions,
                },
            )
        )

    grouped: dict[int, list[dict[str, str]]] = {}
    for comp_id, info in events:
        grouped.setdefault(comp_id, []).append(info)

    original_of: dict[str, int] = {}
    for comp_id, infos in grouped.items():
        if len(infos) == 1:
            description = infos[0]["description"]
            original_of[description] = min(original_of.get(description, comp_id), comp_id)

    # The Mario Wiki repeats two date labels and leaves the neighbouring
    # fortnight blank. Put the earlier original challenge in the lower slot.
    holes = [comp_id for comp_id in range(1, 146) if comp_id not in grouped]
    for comp_id, infos in list(grouped.items()):
        if len(infos) < 2 or not holes:
            continue
        hole = min(holes, key=lambda candidate: (abs(candidate - comp_id), candidate))
        ordered = sorted(infos, key=lambda info: original_of.get(info["description"], 999))
        low, high = sorted((comp_id, hole))
        grouped[low] = [ordered[0]]
        grouped[high] = [ordered[-1]]
        holes.remove(hole)

    found = {comp_id: infos[0] for comp_id, infos in grouped.items() if len(infos) == 1}
    missing = [comp_id for comp_id in range(1, 146) if comp_id not in found]
    if missing:
        raise SystemExit(f"wiki metadata missing competitions: {missing}")
    return found


def decode_cell(value: str) -> str:
    value = re.sub(r"<[^>]+>", "", value)
    value = re.sub(r"&#(\d+);", lambda match: chr(int(match.group(1))), value)
    value = (
        value.replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", '"')
        .replace("&#039;", "'")
        .replace("&nbsp;", " ")
    )
    return re.sub(r"\s+", " ", value).strip()


def pretty_time(raw: str) -> tuple[str, int]:
    minutes, seconds, millis = (int(part) for part in raw.split(":"))
    time_ms = minutes * 60_000 + seconds * 1_000 + millis
    return f"{minutes}:{seconds:02d}.{millis:03d}", time_ms


def parse_board(html: str) -> list[dict[str, object]]:
    rows = []
    for row_html in re.findall(r"<tr[\s\S]*?</tr>", html, flags=re.I):
        cells = [decode_cell(cell) for cell in re.findall(r"<td[^>]*>([\s\S]*?)</td>", row_html, flags=re.I)]
        if len(cells) < 9 or not re.fullmatch(r"\d+", cells[0]):
            continue
        if not re.fullmatch(r"\d+:\d+:\d+", cells[2]):
            continue
        shown, time_ms = pretty_time(cells[2])
        added = cells[8]
        iso_date = ""
        date_match = re.fullmatch(r"(\d{2})-(\d{2})-(\d{4})", added)
        if date_match:
            day, month, year = date_match.groups()
            iso_date = f"{year}-{month}-{day}"
        rows.append(
            {
                "rank": int(cells[0]),
                "player": cells[1],
                "time": shown,
                "timeMs": time_ms,
                "region": cells[3],
                "country": cells[4] if cells[4] != "N/A" else "",
                "character": cells[5],
                "vehicle": cells[6],
                "controller": cells[7],
                "date": iso_date,
            }
        )
    return rows


def fetch_board(comp_id: int, region_code: str) -> list[dict[str, object]]:
    cid = comp_id - 1
    collected: list[dict[str, object]] = []
    seen: set[int] = set()
    for page in range(1, 26):
        url = (
            "https://ninrankings.org/competitions/strecke.php"
            f"?cid={cid}&per_page={PER_PAGE}&page_number={page}&region={region_code}"
        )
        parsed = parse_board(fetch(url))
        if not parsed:
            break
        first_rank = int(parsed[0]["rank"])
        if collected and first_rank != int(collected[-1]["rank"]) + 1:
            break
        fresh = [row for row in parsed if int(row["rank"]) not in seen]
        if not fresh:
            break
        collected.extend(fresh)
        seen.update(int(row["rank"]) for row in fresh)
        if len(parsed) < PER_PAGE:
            break
    return collected


def credible(rows: list[dict[str, object]]) -> dict[str, object] | None:
    for row in rows:
        if int(row["timeMs"]) >= ANOMALY_MS and str(row["player"]).strip():
            return row
    return rows[0] if rows else None


def champion_payload(row: dict[str, object] | None) -> dict[str, object] | None:
    if row is None:
        return None
    return {
        "player": row["player"],
        "time": row["time"],
        "timeMs": row["timeMs"],
        "country": row["country"],
        "region": row["region"],
        "character": row["character"],
        "vehicle": row["vehicle"],
        "controller": row["controller"],
        "anomalous": int(row["timeMs"]) < ANOMALY_MS,
        "rank": row["rank"],
    }


def scrape_one(comp_id: int) -> tuple[int, dict[str, int]]:
    path = RANKINGS / f"{comp_id:03d}.json"
    if path.exists():
        try:
            existing = json.loads(path.read_text())
            if existing.get("complete") is True:
                counts = {"worldwide": len(existing.get("worldwide", []))}
                counts.update({name: len(rows) for name, rows in existing.get("regions", {}).items()})
                return comp_id, counts
        except json.JSONDecodeError:
            pass
    boards: dict[str, list[dict[str, object]]] = {}
    for name, code in REGION_CODES:
        boards[name] = fetch_board(comp_id, code)
    payload = {
        "id": comp_id,
        "complete": True,
        "worldwide": boards["worldwide"],
        "regions": {name: boards[name] for name, _code in REGION_CODES if name != "worldwide"},
    }
    path.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")))
    counts = {name: len(rows) for name, rows in boards.items()}
    return comp_id, counts


def build_indexes(meta: dict[int, dict[str, str]]) -> None:
    descriptions: dict[str, int] = {}
    competitions = []
    players: dict[str, dict[str, object]] = {}
    region_title_keys = {
        "Japan": "japanTitles",
        "North America": "northAmericaTitles",
        "Europe": "europeTitles",
        "Australia": "australiaTitles",
        "Korea": "koreaTitles",
    }

    def player_bucket(name: str) -> dict[str, object]:
        bucket = players.get(name)
        if bucket is None:
            bucket = {
                "name": name,
                "worldTitles": [],
                "japanTitles": [],
                "northAmericaTitles": [],
                "europeTitles": [],
                "australiaTitles": [],
                "koreaTitles": [],
                "podiums": [],
                "results": [],
            }
            players[name] = bucket
        return bucket

    total_rows = 0
    for comp_id in range(1, 146):
        path = RANKINGS / f"{comp_id:03d}.json"
        board = json.loads(path.read_text())
        info = meta[comp_id]
        description = info["description"]
        repeat_of = descriptions.get(description)
        if description and repeat_of is None:
            descriptions[description] = comp_id
        worldwide = board["worldwide"]
        regions = board["regions"]
        total_rows += len(worldwide) + sum(len(rows) for rows in regions.values())
        official = worldwide[0] if worldwide else None
        best = credible(worldwide)
        start, end = competition_window(comp_id)
        competitions.append(
            {
                "id": comp_id,
                "start": start,
                "end": end,
                "course": info["course"],
                "description": description,
                "restrictions": info["restrictions"],
                "repeatOf": repeat_of if repeat_of != comp_id else None,
                "worldwideCount": len(worldwide),
                "regionCounts": {name: len(regions.get(name, [])) for name in region_title_keys},
                "official": champion_payload(official),
                "champion": champion_payload(best),
            }
        )

        def named_champion(rows: list[dict[str, object]], field: str) -> None:
            row = credible(rows)
            if row is None or int(row["timeMs"]) < ANOMALY_MS:
                return
            name = str(row["player"]).strip()
            if not name:
                return
            titles = player_bucket(name)[field]
            assert isinstance(titles, list)
            titles.append(comp_id)

        named_champion(worldwide, "worldTitles")
        for region_name, field in region_title_keys.items():
            named_champion(regions.get(region_name, []), field)

        def absorb(rows: list[dict[str, object]], scope: str) -> None:
            real_podium = 0
            for row in rows:
                name = str(row["player"]).strip()
                if not name:
                    continue
                bucket = player_bucket(name)
                results = bucket["results"]
                assert isinstance(results, list)
                results.append([comp_id, scope, row["rank"], row["timeMs"]])
                anomalous = int(row["timeMs"]) < ANOMALY_MS
                if scope == "W" and not anomalous:
                    real_podium += 1
                    if real_podium <= 3:
                        podiums = bucket["podiums"]
                        assert isinstance(podiums, list)
                        podiums.append(comp_id)

        absorb(worldwide, "W")
        for region_name, _field in region_title_keys.items():
            absorb(regions.get(region_name, []), SCOPE_CODE[region_name])

    scraped_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    catalog = {
        "scrapedAt": scraped_at,
        "source": SOURCE,
        "wiki": WIKI_URL,
        "anomalyThresholdMs": ANOMALY_MS,
        "totalRows": total_rows,
        "competitions": competitions,
    }
    (DATA / "catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, separators=(",", ":")))

    def top(field: str) -> list[dict[str, object]]:
        ranked = sorted(
            players.values(),
            key=lambda item: (-len(item[field]), str(item["name"]).lower()),  # type: ignore[arg-type]
        )
        output = []
        for item in ranked:
            titles = item[field]
            assert isinstance(titles, list)
            if not titles:
                break
            output.append({"player": item["name"], "count": len(titles), "competitions": titles})
        return output

    leaders = {
        "world": top("worldTitles"),
        "europe": top("europeTitles"),
        "japan": top("japanTitles"),
        "northAmerica": top("northAmericaTitles"),
        "australia": top("australiaTitles"),
        "korea": top("koreaTitles"),
        "podiums": top("podiums"),
    }
    (DATA / "leaders.json").write_text(json.dumps(leaders, ensure_ascii=False, separators=(",", ":")))

    player_list = sorted(players.values(), key=lambda item: str(item["name"]).lower())
    (DATA / "players.json").write_text(json.dumps(player_list, ensure_ascii=False, separators=(",", ":")))
    print(f"rows {total_rows} players {len(player_list)} catalog competitions {len(competitions)}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--indexes-only", action="store_true")
    args = parser.parse_args()
    RANKINGS.mkdir(parents=True, exist_ok=True)
    print("reading wiki metadata")
    meta = wiki_metadata()
    (DATA / "wiki.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2))
    if not args.indexes_only:
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = [pool.submit(scrape_one, comp_id) for comp_id in range(1, 146)]
            for future in as_completed(futures):
                comp_id, counts = future.result()
                print(f"competition {comp_id:3d} {counts}", flush=True)
    build_indexes(meta)


if __name__ == "__main__":
    main()
