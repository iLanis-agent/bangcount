var E = require('./engine.js'), n = 0, bad = 0;
function eq(a, b, m, tol) { n++; if (!(Math.abs(a - b) <= (tol || 0))) { bad++; console.log('FAIL', m, a, b); } }
// NWS/NOAA example: 15 seconds is 3 miles (5 km)
eq(E.miles(15), 3, 'NOAA 15 s'); eq(E.km(15), 5, 'NOAA 15 s km'); eq(E.miles(5), 1, '5 s'); eq(E.miles(50), 10, '50 s = 10 mi'); eq(E.km(3), 1, '3 s'); eq(E.miles(0), 0, '0'); eq(E.miles(2.5), 0.5, '2.5');
// linear in seconds
for (var s = 1; s <= 60; s++) { eq(E.miles(s), s * 0.2, 'mi ' + s, 1e-12); eq(E.km(s), s / 3, 'km ' + s, 1e-12); }
// speed of sound: 331.3 + 0.606 T. ~343.4 m/s at 20 C, 331.3 at 0 C. 5 s per mile is a good approximation near 15-20 C
eq(E.soundMs(0), 331.3, 'c0'); eq(E.soundMs(20), 343.42, 'c20', 1e-9); eq(E.soundMs(35), 352.51, 'c35', 1e-9);
eq(E.milesAt(5, 20), 1.0669, 'mile at 20C 5s', 1e-3); eq(E.milesAt(5, 0) < 1.03 ? 1 : 0, 1, 'cold 5s'); eq(E.milesAt(5, 20) > E.milesAt(5, 0) ? 1 : 0, 1, 'warm faster'); eq(E.kmAt(3, 20), 1.03, 'km 3s 20C', 1e-3);
// within 8% of the NWS rule between 5 and 35 C
for (var t = 5; t <= 35; t += 5) eq(Math.abs(E.milesAt(10, t) / E.miles(10) - 1) < 0.1 ? 1 : 0, 1, 'near NWS at ' + t);
// zones
[[0, 'overhead'], [5, 'overhead'], [5.1, 'range'], [30, 'range'], [50, 'range'], [50.1, 'far'], [120, 'far']].forEach(function (r) { eq(E.zone(r[0]).key === r[1] ? 1 : 0, 1, 'zone ' + r[0]); });
// trend: 4 mi to 2 mi in 10 minutes = 12 mph approaching, ETA 10 min
var t0 = 1000000, S = [{ t: t0, sec: 20 }, { t: t0 + 600000, sec: 10 }], r = E.trend(S);
eq(r.mph, 12, 'speed'); eq(r.dir === 'approaching' ? 1 : 0, 1, 'dir'); eq(r.etaMin, 10, 'eta', 1e-9);
r = E.trend([{ t: t0, sec: 10 }, { t: t0 + 1800000, sec: 30 }]); eq(r.mph, -8, 'away speed'); eq(r.dir === 'moving away' ? 1 : 0, 1, 'away'); eq(r.etaMin === null ? 1 : 0, 1, 'no eta away');
r = E.trend([{ t: t0, sec: 20 }, { t: t0 + 600000, sec: 20 }]); eq(r.dir === 'steady' ? 1 : 0, 1, 'steady'); eq(r.etaMin === null ? 1 : 0, 1, 'no eta steady');
eq(E.trend([{ t: t0, sec: 20 }]) === null ? 1 : 0, 1, 'one strike'); eq(E.trend([]) === null ? 1 : 0, 1, 'none'); eq(E.trend([{ t: t0, sec: 20 }, { t: t0 + 30000, sec: 10 }]) === null ? 1 : 0, 1, 'gap too short');
// uses the latest earlier strike that is at least minGap back
r = E.trend([{ t: t0, sec: 40 }, { t: t0 + 600000, sec: 30 }, { t: t0 + 630000, sec: 25 }]); eq(r.mph, (8 - 5) / (630000 / 3600000), 'uses strike beyond min gap', 1e-9);
// 30 minute all-clear
eq(E.allClearAt(t0), t0 + 1800000, 'all clear'); eq(E.remainingMs(t0, t0), 1800000, 'full'); eq(E.remainingMs(t0, t0 + 600000), 1200000, '20 min left'); eq(E.remainingMs(t0, t0 + 1800000), 0, 'done'); eq(E.remainingMs(t0, t0 + 5000000), 0, 'never negative');
console.log(n + ' assertions, ' + bad + ' failed'); process.exit(bad ? 1 : 0);
