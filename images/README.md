# Imágenes

## Lista actual

| Archivo | Uso en UI |
|---------|-----------|
| `0d036f77-c18c-4f4a-926b-edcf7b02cdfb.jpg` | Hero (coupleHero) |
| `7f2d03e1-f71d-4a37-bb7f-21d6f208ad52.jpg` | IntroGrid (detailVase) |
| `coral.png` | MoodBoard M (moodM) |
| `IMG_*.HEIC` | No usados (HEIC no soportado en navegador) |

## Slots en UI que usan imagen local

1. Hero – **conectado** (`coupleHero`)
2. IntroGrid (detalle) – **conectado** (`detailVase`)
3. MoodBoard Mood – **conectado** (`moodM`)
4. MoodBoard Origin – falta imagen local (se usa URL por defecto)
5. MoodBoard Rare – falta imagen local (se usa URL por defecto)

**Faltan 2 imágenes** para reemplazar las URLs de Mood O y Mood R. Añade 2 archivos JPG/PNG/WebP y actualiza `IMAGES.moodO` y `IMAGES.moodR` en `App.tsx`.
