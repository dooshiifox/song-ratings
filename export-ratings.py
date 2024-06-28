#!/usr/bin/env python3
"""Exports ratings from MPD."""


from dataclasses import dataclass
from typing import Iterable, Optional
from mpd import MPDClient
import re


class SongNotFoundError(Exception):
    """Song was not found in the MPD database."""


@dataclass
class SongData:
    """General information about a song."""

    file: str

    rating: Optional[int]
    base_bias: float
    play_count: int

    artist: Optional[str]
    album: Optional[str]
    title: Optional[str]
    disc: Optional[int]
    track: Optional[int]
    duration: float
    year: Optional[int]


def parse_year(date_str: Optional[str]):
    if date_str is None:
        return None

    if not isinstance(date_str, str):
        # Sometimes it returns as an array for some reason
        # Iterate until we get one that works
        if not isinstance(date_str, Iterable):
            print("INVALID YEAR", date_str)
            return None

        for entry in date_str:
            result = parse_year(entry)
            if result is not None:
                return result

        print("INVALID YEAR", date_str)
        return None

    match = re.search(r"\d{4}", date_str)
    if match is None:
        return None
    return int(match.group())


def get_all_song_info(client: MPDClient):
    songs: dict[str, SongData] = {}

    for song in client.listallinfo(""):
        if "directory" in song:
            continue

        if "file" not in song:
            print("wtf no file???", song)
            continue
        file = song["file"]

        if "duration" not in song:
            print("wtf no duration???", song)
            continue
        duration = float(song["duration"])

        artist = song.get("artist")
        album = song.get("album")
        title = song.get("title")
        disc = song.get("disc")
        disc = int(disc) if disc is not None else None
        track = song.get("track")
        track = int(track) if track is not None else None
        year = parse_year(song.get("date"))

        songs[file] = SongData(
            file, None, 1, 0, artist, album, title, disc, track, duration, year
        )

    for result in client.sticker_find("song", "", "rating"):
        if result["file"] not in songs:
            raise SongNotFoundError(f"Sticker for non-existent song: {result['file']}")

        rating = result["sticker"].split("=")[1]
        songs[result["file"]].rating = int(rating)

    for result in client.sticker_find("song", "", "base_bias"):
        if result["file"] not in songs:
            raise SongNotFoundError(f"Sticker for non-existent song: {result['file']}")

        bias = float(result["sticker"].split("=")[1])
        songs[result["file"]].base_bias = bias

    for result in client.sticker_find("song", "", "play_count"):
        if result["file"] not in songs:
            raise SongNotFoundError(f"Sticker for non-existent song: {result['file']}")

        play_count = int(result["sticker"].split("=")[1])
        songs[result["file"]].play_count = play_count

    return songs.values()


def escape_csv_entry(segment: Optional[str]):
    if segment is None:
        return ""
    if '"' in segment or "," in segment:
        return '"' + segment.replace('"', '""') + '"'
    return segment


def export_csv(songs: Iterable[SongData], filename: str):
    with open(filename, "w", encoding="utf-8") as file:
        csv_lines = [
            "file,rating,base_bias,play_count,artist,album,title,disc,track,duration,year"
        ]
        for song in songs:
            csv_lines.append(
                f"{escape_csv_entry(song.file)},{song.rating or ''},{song.base_bias},{song.play_count},{escape_csv_entry(song.artist)},{escape_csv_entry(song.album)},{escape_csv_entry(song.title)},{song.disc or ''},{song.track or ''},{song.duration},{song.year or ''}"
            )
        file.writelines("\n".join(csv_lines))


def main():
    """Exports all files."""

    client = MPDClient()
    client.connect("localhost", 6600)
    songs = get_all_song_info(client)
    export_csv(songs, "./src/data.csv")


if __name__ == "__main__":
    main()
