#!/usr/bin/env python3
"""
Optional legacy tool — strips backgrounds from product photos.

Site policy: use client pack shots AS-IS (see restore-original-images.mjs).
Do not run this in normal import/update flows; automated removal caused halos
and worse results than the originals.
"""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = ROOT / "public" / "images"
ARCHIVE_DIR = IMAGES_DIR / "archive" / "originals-with-bg"
REPORT_PATH = ROOT / "scripts" / "background-removal-report.json"

SKIP_NAMES = {"logo.png", "logo.jpeg", "logo.jpg"}
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp"}


def iter_source_images() -> list[Path]:
    by_stem: dict[str, Path] = {}
    priority = {".png": 0, ".jpeg": 1, ".jpg": 2, ".webp": 3}

    for path in sorted(IMAGES_DIR.iterdir()):
        if not path.is_file():
            continue
        if path.suffix.lower() not in IMAGE_EXTS:
            continue
        if path.name.lower() in SKIP_NAMES:
            continue
        if path.stem.startswith("_"):
            continue

        stem = path.stem
        current = by_stem.get(stem)
        if current is None:
            by_stem[stem] = path
            continue

        # Prefer archived-original extension when both png/jpeg exist
        archive_png = ARCHIVE_DIR / f"{stem}.png"
        archive_jpeg = ARCHIVE_DIR / f"{stem}.jpeg"
        if archive_jpeg.exists() and path.suffix.lower() in {".jpeg", ".jpg"}:
            by_stem[stem] = path
        elif archive_png.exists() and path.suffix.lower() == ".png":
            by_stem[stem] = path
        elif priority[path.suffix.lower()] < priority[current.suffix.lower()]:
            by_stem[stem] = path

    return sorted(by_stem.values(), key=lambda p: p.stem)


def backup_original(path: Path) -> None:
    ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
    dest = ARCHIVE_DIR / path.name
    if not dest.exists():
        shutil.copy2(path, dest)


def is_clean_white_mockup(img: Image.Image) -> bool:
    rgb = img.convert("RGB")
    w, h = rgb.size
    sample = max(16, min(w, h) // 24)
    corners = [
        rgb.crop((0, 0, sample, sample)),
        rgb.crop((w - sample, 0, w, sample)),
        rgb.crop((0, h - sample, sample, h)),
        rgb.crop((w - sample, h - sample, w, h)),
    ]
    arrays = [np.array(c, dtype=np.float32) for c in corners]
    avg = np.mean([a.mean(axis=(0, 1)) for a in arrays], axis=0)
    if avg.min() < 235:
        return False
    spread = max(a.max() - a.min() for a in arrays)
    return spread < 22


def sample_background(arr: np.ndarray) -> np.ndarray:
    h, w, _ = arr.shape
    pad = max(10, min(h, w) // 28)
    edge = max(4, pad // 2)

    samples = [
        arr[:pad, :pad],
        arr[:pad, w - pad :],
        arr[h - pad :, :pad],
        arr[h - pad :, w - pad :],
        arr[:edge, :],
        arr[h - edge :, :],
        arr[:, :edge],
        arr[:, w - edge :],
    ]
    stacked = np.concatenate([s.reshape(-1, 3) for s in samples], axis=0)
    return np.median(stacked, axis=0)


def flood_background_mask(arr: np.ndarray, bg: np.ndarray, *, tolerance_boost: float = 1.0) -> np.ndarray:
    """Mark background pixels connected to image borders (studio backdrop)."""
    from collections import deque

    h, w, _ = arr.shape
    diff = np.linalg.norm(arr - bg, axis=2)

    pad = max(10, min(h, w) // 28)
    edge_pixels = np.concatenate(
        [
            diff[:pad, :pad].ravel(),
            diff[:pad, w - pad :].ravel(),
            diff[h - pad :, :pad].ravel(),
            diff[h - pad :, w - pad :].ravel(),
            diff[: max(4, pad // 2), :].ravel(),
            diff[h - max(4, pad // 2) :, :].ravel(),
            diff[:, : max(4, pad // 2)].ravel(),
            diff[:, w - max(4, pad // 2) :].ravel(),
        ]
    )
    edge_med = float(np.median(edge_pixels))
    tolerance = max(14.0, min(52.0, edge_med * 1.15 + 10.0)) * tolerance_boost

    is_bg_like = diff <= tolerance
    is_background = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def try_seed(y: int, x: int) -> None:
        if 0 <= y < h and 0 <= x < w and is_bg_like[y, x] and not is_background[y, x]:
            is_background[y, x] = True
            queue.append((y, x))

    for x in range(w):
        try_seed(0, x)
        try_seed(h - 1, x)
    for y in range(h):
        try_seed(y, 0)
        try_seed(y, w - 1)

    while queue:
        y, x = queue.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and is_bg_like[ny, nx] and not is_background[ny, nx]:
                is_background[ny, nx] = True
                queue.append((ny, nx))

    product = ~is_background
    return (product.astype(np.uint8) * 255)


def product_mask_from_studio(arr: np.ndarray, bg: np.ndarray, *, tolerance_boost: float = 1.0) -> np.ndarray:
    """Binary product mask — no alpha blur (avoids gray halos on white cards)."""
    alpha = flood_background_mask(arr, bg, tolerance_boost=tolerance_boost)
    return alpha > 127


def is_studio_grey_mockup(img: Image.Image) -> bool:
    """Light grey studio backdrop (common on client 3D pack renders)."""
    rgb = img.convert("RGB")
    w, h = rgb.size
    sample = max(16, min(w, h) // 24)
    corners = [
        rgb.crop((0, 0, sample, sample)),
        rgb.crop((w - sample, 0, w, sample)),
        rgb.crop((0, h - sample, sample, h)),
        rgb.crop((w - sample, h - sample, w, h)),
    ]
    arrays = [np.array(c, dtype=np.float32) for c in corners]
    avg = np.mean([a.mean(axis=(0, 1)) for a in arrays], axis=0)
    if avg.min() < 175 or avg.max() > 252:
        return False
    spread = max(a.max() - a.min() for a in arrays)
    return spread < 45


def whiten_outside_product_bbox(arr: np.ndarray, product: np.ndarray) -> np.ndarray:
    ys, xs = np.where(product)
    if ys.size == 0:
        return arr
    y0, y1 = int(ys.min()), int(ys.max())
    x0, x1 = int(xs.min()), int(xs.max())
    pad = max(4, min(arr.shape[0], arr.shape[1]) // 120)
    out = arr.copy()
    out[: max(0, y0 - pad), :] = 255
    out[:, : max(0, x0 - pad)] = 255
    out[:, min(arr.shape[1], x1 + pad + 1) :] = 255
    # Keep soft floor shadow inside bbox; strip below product + margin
    floor_y = min(arr.shape[0], y1 + max(8, (y1 - y0) // 12))
    out[floor_y:, :] = 255
    return out


def strip_light_halos(arr: np.ndarray, product: np.ndarray, erosion: int = 12) -> np.ndarray:
    """Whiten gray/white halos outside the eroded product core."""
    from scipy.ndimage import binary_erosion

    if not product.any():
        return arr
    core = binary_erosion(product, iterations=erosion)
    light = arr.mean(axis=2) > 192
    out = arr.copy()
    out[light & ~core] = 255
    return out


def whiten_border_band(arr: np.ndarray, fraction: float = 0.07) -> np.ndarray:
    """Force outer frame to white (helps lifestyle shots with blurred edges)."""
    h, w, _ = arr.shape
    band_y = max(8, int(h * fraction))
    band_x = max(8, int(w * fraction))
    out = arr.copy()
    out[:band_y, :] = 255
    out[h - band_y :, :] = 255
    out[:, :band_x] = 255
    out[:, w - band_x :] = 255
    return out


def whiten_floor_and_halo(img: Image.Image, alpha: np.ndarray) -> Image.Image:
    arr = np.array(img.convert("RGB"))
    product = alpha > 200
    if not product.any():
        return img

    ys, xs = np.where(product)
    y_bottom = int(ys.max())
    x_left, x_right = int(xs.min()), int(xs.max())

    # Remove studio floor below the box
    floor_band = np.zeros(arr.shape[:2], dtype=bool)
    floor_band[y_bottom + 2 :, :] = True
    light = arr.mean(axis=2) > 205
    arr[floor_band & light] = 255

    # Remove gray halo around product on white
    halo = (~product) & (arr.mean(axis=2) > 215) & (arr.mean(axis=2) < 252)
    arr[halo] = 255

    # Side margins outside product column
    margin = max(8, (x_right - x_left) // 20)
    side_halo = np.zeros(arr.shape[:2], dtype=bool)
    side_halo[:, : max(0, x_left - margin)] = True
    side_halo[:, min(arr.shape[1], x_right + margin) :] = True
    light_side = arr.mean(axis=2) > 210
    arr[side_halo & light_side] = 255

    return Image.fromarray(arr, "RGB")


def crop_to_content(img: Image.Image, padding: int = 36) -> Image.Image:
    arr = np.array(img.convert("RGB"))
    non_white = np.any(arr < 252, axis=2)
    ys, xs = np.where(non_white)
    if ys.size == 0:
        return img
    y0 = max(0, int(ys.min()) - padding)
    y1 = min(arr.shape[0], int(ys.max()) + padding)
    x0 = max(0, int(xs.min()) - padding)
    x1 = min(arr.shape[1], int(xs.max()) + padding)
    return img.crop((x0, y0, x1, y1))


def flatten_studio_grey(img: Image.Image) -> Image.Image:
    """Grey-backdrop 3D renders: global backdrop replacement (avoids mask halos)."""
    rgb = img.convert("RGB")
    arr = np.array(rgb, dtype=np.float32)
    bg = sample_background(arr)
    diff = np.linalg.norm(arr - bg, axis=2)
    pad = max(10, min(arr.shape[0], arr.shape[1]) // 28)
    edge_diff = float(np.median(diff[:pad, :pad]))
    tolerance = max(22.0, min(38.0, edge_diff + 12.0))
    out = arr.copy()
    out[diff <= tolerance] = 255
    h = out.shape[0]
    out[: max(6, h // 18), :] = 255
    # Drop soft floor shadow below the pack
    non_white = np.any(out < 252, axis=2)
    if non_white.any():
        ys, _ = np.where(non_white)
        floor = min(out.shape[0], int(ys.max()) + max(6, (ys.max() - ys.min()) // 14))
        light_floor = out[floor:, :].mean(axis=2) > 175
        out[floor:, :][light_floor] = 255
    return crop_to_content(Image.fromarray(out.astype(np.uint8), "RGB"))


def clean_on_white(img: Image.Image, *, lifestyle: bool = False) -> Image.Image:
    rgb = img.convert("RGB")
    arr = np.array(rgb, dtype=np.float32)
    bg = sample_background(arr)
    boost = 1.45 if lifestyle else 1.0
    product = product_mask_from_studio(arr, bg, tolerance_boost=boost)

    out = arr.astype(np.uint8).copy()
    out[~product] = 255
    band = 0.12 if lifestyle else 0.07
    out = whiten_border_band(out.astype(np.float32), fraction=band)
    out = whiten_outside_product_bbox(out, product)
    out = strip_light_halos(out.astype(np.uint8), product)
    result = whiten_floor_and_halo(Image.fromarray(out.astype(np.uint8), "RGB"), product.astype(np.uint8) * 255)
    result_arr = strip_light_halos(np.array(result, dtype=np.uint8), product, erosion=8)
    return crop_to_content(Image.fromarray(result_arr, "RGB"))


def normalize_white(img: Image.Image) -> Image.Image:
    """Ensure already-clean mockups use pure #FFFFFF background."""
    arr = np.array(img.convert("RGB"), dtype=np.float32)
    bg = sample_background(arr)
    if bg.min() < 235:
        return img.convert("RGB")
    near_white = np.linalg.norm(arr - bg, axis=2) < 18
    arr[near_white] = 255
    return Image.fromarray(arr.astype(np.uint8), mode="RGB")


def process_image(path: Path) -> tuple[str, str]:
    backup_original(path)
    slug = path.stem
    out_path = IMAGES_DIR / f"{slug}.png"

    with Image.open(path) as img:
        img = img.convert("RGB")
        if is_clean_white_mockup(img):
            clean = normalize_white(img)
            clean.save(out_path, format="PNG", optimize=True)
            return "skipped_clean", out_path.name

        if is_studio_grey_mockup(img):
            clean = flatten_studio_grey(img)
            clean.save(out_path, format="PNG", optimize=True)
            return "studio_grey", out_path.name

        clean = clean_on_white(img, lifestyle=True)
        clean.save(out_path, format="PNG", optimize=True)
        return "processed", out_path.name


def main() -> int:
    sources = iter_source_images()
    report = {
        "method": "studio-background-removal + white composite",
        "total": len(sources),
        "processed": [],
        "skippedClean": [],
        "failed": [],
    }

    print(f"Processing {len(sources)} images...", flush=True)

    for index, src in enumerate(sources, start=1):
        slug = src.stem
        try:
            status, output = process_image(src)
            entry = {"slug": slug, "source": src.name, "output": output}
            if status == "skipped_clean":
                report["skippedClean"].append(entry)
                print(f"[{index}/{len(sources)}] already clean: {slug}", flush=True)
            else:
                report["processed"].append(entry)
                print(f"[{index}/{len(sources)}] done: {slug}", flush=True)
        except Exception as exc:  # noqa: BLE001
            report["failed"].append({"slug": slug, "source": src.name, "error": str(exc)})
            print(f"[{index}/{len(sources)}] FAILED: {slug} — {exc}", flush=True)

    REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")
    summary = {
        "total": report["total"],
        "processed": len(report["processed"]),
        "skippedClean": len(report["skippedClean"]),
        "failed": len(report["failed"]),
    }
    print(json.dumps(summary, indent=2), flush=True)
    return 1 if report["failed"] else 0


if __name__ == "__main__":
    sys.exit(main())
