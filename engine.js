(function (root) {
  'use strict';
  var MIN30 = 30 * 60000;
  // NWS rule of thumb: sound travels about 1 mile in 5 seconds (1 km in 3 seconds)
  function miles(sec) { return sec / 5; }
  function km(sec) { return sec / 3; }
  // Speed of sound in air, m/s (standard linear approximation, T in C)
  function soundMs(tC) { return 331.3 + 0.606 * tC; }
  function milesAt(sec, tC) { return sec * soundMs(tC) / 1609.344; }
  function kmAt(sec, tC) { return sec * soundMs(tC) / 1000; }
  // Thunder can be heard only about 10 miles away (NWS), which is 50 seconds
  function zone(sec) {
    if (sec <= 5) return { key: 'overhead', label: 'Very close', note: 'Under a mile. Get inside a building or hard-topped car now.' };
    if (sec <= 50) return { key: 'range', label: 'Within striking distance', note: 'If you can hear thunder you are close enough to be hit. Get to safe shelter now.' };
    return { key: 'far', label: 'Probably beyond thunder range', note: 'Thunder carries about 10 miles. A storm can still move in, so keep watching and stay ready to go inside.' };
  }
  // strikes: [{t: ms timestamp of the flash, sec: counted seconds}] oldest first
  // Rough storm approach speed from the last two strikes at least minGap ms apart. Positive means approaching.
  function trend(strikes, minGap) {
    minGap = minGap == null ? 60000 : minGap;
    if (!strikes || strikes.length < 2) return null;
    var last = strikes[strikes.length - 1], prev = null;
    for (var i = strikes.length - 2; i >= 0; i--) if (last.t - strikes[i].t >= minGap) { prev = strikes[i]; break; }
    if (!prev) return null;
    var hours = (last.t - prev.t) / 3600000, dMi = miles(prev.sec) - miles(last.sec), v = dMi / hours;
    var dir = Math.abs(v) < 1 ? 'steady' : v > 0 ? 'approaching' : 'moving away';
    var eta = v > 1 ? miles(last.sec) / v * 60 : null; // minutes until about overhead on a straight path
    return { mph: v, dir: dir, etaMin: eta };
  }
  // NWS: wait 30 minutes after the last lightning or thunder before going back outside
  function allClearAt(lastEventMs) { return lastEventMs + MIN30; }
  function remainingMs(lastEventMs, nowMs) { return Math.max(0, allClearAt(lastEventMs) - nowMs); }
  var api = { MIN30: MIN30, miles: miles, km: km, soundMs: soundMs, milesAt: milesAt, kmAt: kmAt, zone: zone, trend: trend, allClearAt: allClearAt, remainingMs: remainingMs };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Bang = api;
})(typeof window !== 'undefined' ? window : this);
