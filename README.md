# Gym Tracker

Installable phone app for logging lifts and cardio. Works offline, no account, and
each person's data stays on their own device.

**Live:** https://shikha811.github.io/gym-tracker/
**Repo:** https://github.com/shikha811/gym-tracker

---

## Files

```
index.html              the entire app — HTML, CSS and JS in one file
manifest.webmanifest    app name, icons, colours, home-screen shortcuts
sw.js                   service worker — offline caching
icons/                  app icons at every size iOS and Android ask for
README.md               this file
```

Nine files, ~70KB total. No build step, no dependencies to install. Chart.js is the
only external library and it loads from a CDN.

---

## Installing on a phone

**iPhone / iPad** — open the link in **Safari** (must be Safari, not Chrome), tap the
Share button, scroll down, tap **Add to Home Screen**.

**Android** — open in Chrome, tap **⋮**, tap **Install app**.

After that it opens full screen with its own icon and works with no signal. Long-press
the icon for shortcuts straight to Log, Progress, or History.

---

## What it does

**Logging**
- Seven day types: Legs, Back, Chest, Biceps, Triceps, Shoulders, Cardio
- Each day has its own exercise list, plus a Custom option for anything missing
- Sets in kg × reps. The weight box pre-fills from last time, and the button counts
  up (Add set 1 → Add set 2) so you can see where you are
- A green ✓ flash confirms each set landed
- Cardio in km + minutes with pace calculated, available on any day
- Free-text notes per session

**Feedback while training**
- Rest timer starts automatically after each set, beeps when you're up. Adjustable
  length, ±15s/+30s mid-rest. (Vibration is Android only — iOS blocks it.)
- Last-time recall on every exercise, so you know the number to beat
- **PB** flag on any set beating your previous best for that exercise

**Reviewing**
- History grouped by month, openable and editable
- Progress charts: top set and volume per exercise over time; distance and pace for
  cardio; 12-week total volume
- All-time totals

**Sharing** — the ↗ button in the header produces readable plain text for a coach or
training partner. Pick this session, last 7 days, last 30 days, or everything; preview
it; then Share (phone share sheet) or Copy. Notes are included, so check the preview
before sending.

**Other** — dark mode following the phone's setting, repeating calendar reminders,
JSON export/import.

---

## Updating the live app

1. Edit the file you want to change
2. **Bump the cache version in `sw.js`** — `const CACHE = "gym-tracker-v4";`
3. Upload to https://github.com/shikha811/gym-tracker/upload/main — click
   **choose your files**, pick the changed files, Commit. Same filenames overwrite.
4. Live in about a minute

Step 2 is not optional. Skip it and phones keep serving the old version from their
offline cache, and you'll think the deploy failed.

To pick up the new version on a phone: open the app **with a connection**, then close
and reopen once. Two opens.

---

## Things worth knowing

**Data is on the device, nowhere else.** Nothing is uploaded, so nothing can leak —
but a new phone starts empty and clearing browser data wipes the log. Settings →
Backup → **Export data** writes a JSON file; **Import** merges it back. Worth doing
monthly.

**Never "clear site data" to fix a stale cache.** That deletes every logged workout.
Export first, or on iPhone just delete the home-screen icon and re-add it — that
refreshes the app without touching stored data.

**No sync between devices.** Your phone and your laptop are separate logs. Real sync
needs a server and accounts. Export/import is the manual version.

**Reminders use your calendar, not notifications.** A web app can't reliably fire a
notification while closed — both mobile OSes suspend it. So Settings generates a
repeating `.ics` calendar event that your phone's own calendar alerts you about, 30
minutes ahead. A workaround, but it actually fires.

**The code is readable by anyone.** It's a client-side web app; View Source shows
everything. That's not a GitHub thing — it's how the web works. There's also nothing
sensitive in it.

---

## Known gaps

- No cross-device sync
- No screenshots in the manifest yet (needs real images of the running app; raises
  the PWABuilder score and improves Chrome's install dialog)
- Cardio pace uses total time ÷ total distance per session, not per interval
- No way to reorder exercises within a session
