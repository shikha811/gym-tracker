# Gym Tracker — installable phone app

A single-page app that installs to the home screen on both iPhone and Android, works
with no signal, and keeps each person's log on their own device. No accounts, no server,
no app store.

## What's in here

```
index.html              the whole app (HTML + CSS + JS in one file)
manifest.webmanifest    tells the phone the name, icon, and colours
sw.js                   service worker — makes it work offline
icons/                  app icons, generated at every size iOS and Android ask for
```

## Step 1 — put it online

A PWA needs HTTPS to install, so it has to be hosted somewhere. Any static host works
and the free tiers are far more than enough.

> A note if you're reading this at work: Zerobox is DoorDash's internal default for
> hosting apps, but it's the wrong tool here — this is a personal project and your
> family can't reach internal infrastructure. Use a personal account on a public host.

**Option A — Vercel (simplest, no git needed)**

```bash
npm i -g vercel          # once
cd gym-app
vercel                   # sign in, accept the defaults
vercel --prod            # gives you the live https:// link
```

Or skip the CLI entirely: log in at vercel.com, choose "Add New… → Project → Deploy
without Git", and drag the `gym-app` folder onto the page.

**Option B — GitHub Pages (free forever, no CLI)**

1. Create a public repo, upload the contents of this folder to the root.
2. Settings → Pages → Source: `main` branch, `/ (root)` → Save.
3. Live at `https://<your-username>.github.io/<repo>/` within a minute or two.

Either way you get a permanent HTTPS link. That link *is* the app.

## Step 2 — the message to send your friends and family

Copy-paste this, with your link swapped in:

> Made us a gym tracker 💪 → **<your link>**
>
> **iPhone:** open the link in **Safari** (it has to be Safari), tap the Share button
> at the bottom, scroll down, tap **Add to Home Screen**.
>
> **Android:** open the link in Chrome, tap the **⋮** menu, tap **Install app**.
>
> It then works like a normal app — full screen, own icon, and it works in the gym
> even with no signal. Your workouts stay on your phone; nobody else can see them.

That last line matters: everyone gets their own private log from the same link. There's
no shared database, so there's nothing to set up per person and nothing for you to
administer.

## Step 3 — shipping updates

Edit `index.html`, then **bump the cache version** in `sw.js`:

```js
const CACHE = "gym-tracker-v2";   // was v1
```

Redeploy. Phones pick up the new version the next time the app is opened with a
connection — no reinstalling, no app store review. If you forget to bump `CACHE`,
people may keep seeing the old version from their offline cache.

## What it does

- **Seven day types** — Legs, Back, Chest, Biceps, Triceps, Shoulders, Cardio. Each has
  its own exercise list, plus a Custom option for anything missing.
- **Sets** in kg × reps. The weight box pre-fills from last time, so logging a set is
  usually two taps.
- **Cardio** in km + minutes, with pace worked out automatically. Available on any day,
  not just Cardio day.
- **Rest timer** — starts on its own after each set, beeps when you're up. Configurable
  length, ±adjustments mid-rest.
- **Last-time recall** — every exercise shows what you lifted the previous session, so
  you know the number to beat.
- **PB flags** on any set that beats your previous best for that exercise.
- **History** grouped by month, editable and deletable.
- **Progress charts** — top set and volume over time per exercise, pace and distance for
  cardio, plus a 12-week volume chart.
- **Dark mode**, following the phone's own setting by default.
- **Reminders** via a repeating calendar event (see the caveat below).
- **Export / import** JSON backups.

## Things worth knowing

**Data lives on the device, nowhere else.** That's the privacy upside and the backup
downside. Nothing is uploaded, so nothing can leak — but a new phone starts empty and
clearing browser data wipes the log. Settings → Backup → **Export data** writes a JSON
file; **Import** merges it back on the new device. Worth doing every month or so.

**No sync between devices.** Your phone and your laptop are separate logs. Real sync
needs a server and accounts, which is a much bigger project — export/import is the
manual version.

**Reminders use your calendar, not notifications.** A web app can't reliably fire a
notification while it's closed — iOS and Android both suspend it. So instead the app
generates a repeating calendar event (`.ics`) that your phone's own calendar alerts you
about, 30 minutes ahead. It's a workaround, but it's the one that actually fires.

**Vibration is Android only.** iOS Safari blocks the vibration API, so the rest timer
buzzes on Android and beeps on both.

**iOS needs Safari for the install.** Chrome on iPhone can't add to the home screen
reliably. Worth saying explicitly when you send the link, or half your family will get
stuck here.
