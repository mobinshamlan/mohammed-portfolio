/**
 * Tonight in Riyadh: local time, whether the sun is down, and the moon's phase.
 * Computed in code from standard formulas, no network. Accurate to a few minutes.
 */

const RIYADH = { lat: 24.7136, lon: 46.6753, zone: "Asia/Riyadh" } as const;

const rad = Math.PI / 180;

function julianDay(date: Date) {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Sunrise and sunset in UTC for the given date at Riyadh (NOAA approximation). `depth` is the
 * sun's altitude that counts as the event: −0.833° for the visible edge, −18.5° for dawn. */
function sunTimesUtc(date: Date, depth = -0.833) {
  const jd = julianDay(date);
  const n = Math.ceil(jd - 2451545.0 + 0.0008);
  // Mean solar noon: longitude east is positive here, so the sun crosses earlier than at Greenwich.
  const jStar = n - RIYADH.lon / 360;
  const m = (357.5291 + 0.98560028 * jStar) % 360;
  const c =
    1.9148 * Math.sin(m * rad) +
    0.02 * Math.sin(2 * m * rad) +
    0.0003 * Math.sin(3 * m * rad);
  const lambda = (m + c + 180 + 102.9372) % 360;
  const jTransit =
    2451545.0 +
    jStar +
    0.0053 * Math.sin(m * rad) -
    0.0069 * Math.sin(2 * lambda * rad);
  const decl = Math.asin(Math.sin(lambda * rad) * Math.sin(23.4397 * rad));
  const cosHa =
    (Math.sin(depth * rad) - Math.sin(RIYADH.lat * rad) * Math.sin(decl)) /
    (Math.cos(RIYADH.lat * rad) * Math.cos(decl));
  const ha = Math.acos(Math.max(-1, Math.min(1, cosHa))) / rad;
  const set = jTransit + ha / 360;
  const rise = jTransit - ha / 360;
  return {
    rise: new Date((rise - 2440587.5) * 86400000),
    set: new Date((set - 2440587.5) * 86400000),
  };
}

export type MoonPhase = {
  /** 0 new, 0.25 first quarter, 0.5 full, 0.75 last quarter. */
  phase: number;
  /** Lit fraction of the disc, 0 to 1. */
  illumination: number;
  name: string;
};

export function moonPhase(date: Date): MoonPhase {
  const synodic = 29.530588853;
  const known = 2451550.1; // new moon, 6 January 2000
  const days = julianDay(date) - known;
  const phase = ((days / synodic) % 1 + 1) % 1;
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;
  const name =
    phase < 0.03 || phase > 0.97
      ? "New moon"
      : phase < 0.22
        ? "Waxing crescent"
        : phase < 0.28
          ? "First quarter"
          : phase < 0.47
            ? "Waxing gibbous"
            : phase < 0.53
              ? "Full moon"
              : phase < 0.72
                ? "Waning gibbous"
                : phase < 0.78
                  ? "Last quarter"
                  : "Waning crescent";
  return { phase, illumination, name };
}

export type Tonight = {
  time: string;
  /** Hour of the day in Riyadh, 0-23. */
  hour: number;
  night: boolean;
  sunset: string;
  sunrise: string;
  moon: MoonPhase;
};

/** The parts of one night, named the way the night is named in Arabic. */
export type NightPart = "sunset" | "nightfall" | "midnight" | "lastThird" | "dawn" | "sunrise";

export const nightParts: Record<NightPart, { ar: string; en: string }> = {
  sunset: { ar: "الغروب", en: "Sunset" },
  nightfall: { ar: "العشاء", en: "Nightfall" },
  midnight: { ar: "منتصف الليل", en: "Midnight" },
  lastThird: { ar: "الثلث الأخير", en: "The last third" },
  dawn: { ar: "الفجر", en: "Dawn" },
  sunrise: { ar: "الشروق", en: "Sunrise" },
};

export type Night = {
  /** Clock time of each part tonight in Riyadh, "HH:MM". */
  times: Record<NightPart, string>;
  /** Tonight's date in the Umm al-Qura calendar; the day turns at sunset. */
  hijri: { ar: string; en: string };
  moon: MoonPhase;
};

const DAY = 86400000;

/**
 * Tonight from sunset to sunrise. Before noon the night in question is the
 * one that is ending. Nightfall is the Isha time of the Umm al-Qura calendar
 * (90 minutes after sunset); midnight and the last third divide the night
 * from sunset to dawn; dawn is the sun 18.5° below the horizon.
 */
export function nightInRiyadh(now = new Date()): Night {
  const timeFormat = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: RIYADH.zone,
  });
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: RIYADH.zone }).format(now),
  ) % 24;
  const evening = hour < 12 ? new Date(now.getTime() - DAY) : now;
  const morning = new Date(evening.getTime() + DAY);
  const set = sunTimesUtc(evening).set;
  const rise = sunTimesUtc(morning).rise;
  const dawn = sunTimesUtc(morning, -18.5).rise;
  const span = dawn.getTime() - set.getTime();
  const at = (ms: number) => timeFormat.format(new Date(ms));
  // The Hijri day begins at sunset, so after sunset it is already tomorrow's date.
  const hijriDay = now > sunTimesUtc(now).set ? new Date(now.getTime() + DAY) : now;
  const hijri = (locale: string) =>
    new Intl.DateTimeFormat(`${locale}-u-ca-islamic-umalqura`, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: RIYADH.zone,
    }).format(hijriDay);
  return {
    times: {
      sunset: at(set.getTime()),
      nightfall: at(set.getTime() + 90 * 60000),
      midnight: at(set.getTime() + span / 2),
      lastThird: at(set.getTime() + (span * 2) / 3),
      dawn: at(dawn.getTime()),
      sunrise: at(rise.getTime()),
    },
    hijri: { ar: hijri("ar-SA"), en: hijri("en") },
    moon: moonPhase(now),
  };
}

export function tonightInRiyadh(now = new Date()): Tonight {
  const timeFormat = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: RIYADH.zone,
  });
  const hourFormat = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    hour12: false,
    timeZone: RIYADH.zone,
  });
  const { rise, set } = sunTimesUtc(now);
  const night = now < rise || now > set;
  return {
    time: timeFormat.format(now),
    hour: Number(hourFormat.format(now)) % 24,
    night,
    sunset: timeFormat.format(set),
    sunrise: timeFormat.format(rise),
    moon: moonPhase(now),
  };
}
