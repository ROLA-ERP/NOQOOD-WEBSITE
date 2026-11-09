# NOQOOD ERP: 30-second promo video (production kit)

**Status: the MP4 has NOT been produced.** The development environment has no video encoder (ffmpeg), no Arabic text-to-speech voice and no licensed music, so no video file exists yet. This kit contains everything needed to produce it with an AI video tool and a voice tool, and the website section is already built to play it the moment the file is added.

## Files the website expects (put them in `public/video/`)
| File | What |
| --- | --- |
| `noqood-promo.mp4` | the finished video: 1920×1080, 16:9, H.264 + AAC, exactly 30 s, ≤ 25 MB (web-optimised, `-movflags +faststart`) |
| `noqood-promo.ar.vtt` | Arabic captions, **already written** (synced to the timings below; re-time if the voice-over is slower/faster) |
| `noqood-promo-poster.jpg` (optional) | cover image; without it the site draws its own poster |

Until `noqood-promo.mp4` exists the home page shows the poster with a "video in production" label and **no play button**.

## Specification
30 s · 16:9 · 1080p · Modern Standard Arabic · confident, clear male voice · premium corporate SaaS commercial · navy / turquoise / green · calm techno music, **commercially licensed** · motion graphics and smooth cinematic transitions · official NOQOOD logo (`public/noqood-logo-full.png`, `noqood-mark.png`) · real system footage only if it contains **no sensitive data** (use the demo company or the illustrative previews).

## Storyboard and voice-over
| Time | Scene | Visual | Voice-over (verbatim) |
| --- | --- | --- | --- |
| 0–5 s | Challenge | Quick cuts: a manager at a desk surrounded by spreadsheets, several windows and papers; screens with conflicting numbers; slight handheld tension. Cool desaturated grade, navy shadows | "إدارة أعمالك لا يجب أن تكون معقّدة." |
| 5–10 s | Solution | Clutter dissolves into light; NOQOOD mark builds with a turquoise sweep; transition into a clean modern dashboard | "مع نقود ERP، كل أعمالك في منصة واحدة." |
| 10–18 s | Capabilities | Five animated panels in turn, linked by glowing lines: accounting (ledger), sales (invoice → collection), purchasing (order → receipt), inventory (stock levels), HR (attendance/payroll). Icons in the site's module colours | "من المحاسبة والمبيعات، إلى المخزون والموارد البشرية، كل عملياتك مترابطة." |
| 18–25 s | Value | KPI tiles counting up, financial statement, branch comparison bars, a dashboard sweep | "رؤية أوضح لأداء شركتك، وتحكّم أكبر في مواردك، وقرارات مبنية على معلومات دقيقة." |
| 25–30 s | Close | Logo with the title *"أعمالك تحت السيطرة. قراراتك بثقة. ومستقبلك بلا حدود."*, then the end card with the button *اطلب عرضًا توضيحيًا* and `www.noqoodapp.com` | "نقود ERP... إدارة أذكى، ونمو بلا حدود." |

**Honesty rules for the footage and text:** show only capabilities listed in `ERP_FEATURE_DISCOVERY.md` (no generative-AI visuals presented as product features, no invented numbers or customer logos). The pricing, testimonials and any statistic must not appear. All on-screen numbers must be obviously illustrative or from the demo company.

## How to produce it (suggested workflow)
1. **Scenes:** generate each shot with an AI video tool (any current text/image-to-video model). Use the NOQOOD logo as an image reference for shots 2 and 5 where the tool allows, or add the logo afterwards in the editor (more reliable: AI tools distort logos). Prompt template per shot: *"Premium corporate SaaS commercial, dark navy and turquoise colour palette, cinematic lighting, smooth camera move, 16:9, 1080p, [scene description from the table]. No text, no logos, no readable numbers."* Add all text and the logo in the editor, never inside the AI shot.
2. **Dashboard shots:** for 5–25 s, screen-record the real system on a **demo company** (no real customers, salaries or bank data) or animate the illustrative previews from the site.
3. **Voice:** generate the narration with an Arabic text-to-speech service that offers a professional Modern Standard Arabic male voice (or record a voice actor). Use exactly the lines above, add the diacritics shown (e.g. معقّدة، وتحكّم) so the pronunciation is correct. Check the service's licence allows commercial use.
4. **Music:** use a track whose licence explicitly allows commercial use and keep the licence receipt. Duck the music ~12 dB under the voice.
5. **Edit and export:** assemble in any editor (DaVinci Resolve, CapCut, Premiere). Add motion graphics and the title/end card. Export 1920×1080, 30 fps, H.264, AAC 192 kbps.
6. **Optimise (needs ffmpeg):**
   `ffmpeg -i master.mp4 -c:v libx264 -crf 22 -preset slow -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart noqood-promo.mp4`
7. **Captions:** keep `noqood-promo.ar.vtt` (already provided). If the voice runs slower, adjust the cue times in that file.
8. **Poster:** export a frame from ~7 s (logo + dashboard) as `noqood-promo-poster.jpg` (1280×720).
9. Copy the files into `public/video/`, rebuild, and open the home page: the play button appears automatically.

## Checklist before publishing
- [ ] Exactly 30 s, 1080p, 16:9
- [ ] Voice-over matches the script word for word and is clear
- [ ] Music licence kept on file (commercial use)
- [ ] No sensitive data visible in any frame (zoom into every screen shot)
- [ ] Only real, listed capabilities are shown
- [ ] Captions in sync; video starts only on click, with sound under the viewer's control
- [ ] File ≤ 25 MB; plays on phone and desktop
