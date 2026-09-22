/**
 * Daily Gospel / Evangelizo liturgy helper.
 * Fetches today's readings from the public Evangelizo reader (powers dailygospel.org).
 * Attribution required — do not vendor full lectionary text into the repo.
 */
(function () {
  const FEED = 'https://feed.evangelizo.org/v2/reader.php';

  function todayStamp(date) {
    const d = date || new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return { ymd: `${y}-${m}-${day}`, ymdCompact: `${y}${m}${day}`, display: d };
  }

  function cdataText(xml, tag) {
    const el = xml.querySelector(tag);
    if (!el) return '';
    return String(el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function excerpt(text, max) {
    const value = String(text || '').trim();
    if (!value) return '';
    if (value.length <= max) return value;
    return `${value.slice(0, max - 1).trim()}…`;
  }

  function dailyGospelUrl() {
    return 'https://dailygospel.org/';
  }

  async function fetchToday(lang) {
    const language = lang || 'AM';
    const { ymdCompact, ymd, display } = todayStamp();
    const url = `${FEED}?date=${ymdCompact}&type=xml&lang=${encodeURIComponent(language)}`;

    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) throw new Error(`Liturgy feed unavailable (${response.status})`);

    const raw = await response.text();
    const xml = new DOMParser().parseFromString(raw, 'application/xml');
    if (xml.querySelector('parsererror')) throw new Error('Could not parse liturgy feed');

    const saint = cdataText(xml, 'saint');
    const liturgicalTitle = cdataText(xml, 'litugic_t') || cdataText(xml, 'liturgic_t');
    const readingRef = cdataText(xml, 'reading_text1_st') || cdataText(xml, 'reading_text1_lt');
    const readingText = cdataText(xml, 'reading_text1');
    const psalmRef = cdataText(xml, 'reading_text2_st') || cdataText(xml, 'reading_text2_lt');
    const gospelRef = cdataText(xml, 'reading_gospel_st') || cdataText(xml, 'reading_gospel_lt');
    const gospelText = cdataText(xml, 'reading_gospel');

    return {
      dateKey: ymd,
      dateLabel: display.toLocaleDateString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      liturgicalTitle,
      saint,
      feast: saint,
      readingRef,
      readingExcerpt: excerpt(readingText, 160),
      psalmRef,
      gospelRef,
      gospelExcerpt: excerpt(gospelText, 180),
      sourceUrl: dailyGospelUrl(),
      sourceLabel: 'Daily Gospel / Evangelizo',
      lang: language
    };
  }

  window.TTC_LITURGY = {
    fetchToday,
    dailyGospelUrl,
    todayStamp
  };
})();
