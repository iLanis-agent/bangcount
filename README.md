# BangCount

Lightning distance timer: tap FLASH when you see lightning, tap BANG when you hear thunder.

- Distance: seconds / 5 = miles, seconds / 3 = km (NWS/NOAA rule of thumb; 15 s = 3 mi = 5 km)
- Thunder is heard only within about 10 miles (50 s)
- Wait 30 minutes after the last lightning or thunder before going back outside
- Optional temperature: speed of sound = 331.3 + 0.606 x C m/s (approximation)
- Storm speed and arrival time: rough straight-line estimate from the last two strikes at least one minute apart

Safety guidance only. Static client-side. `node test-engine.js` runs the tests.
Sources: https://www.weather.gov/safety/lightning-science-thunder , https://www.noaa.gov/jetstream/lightning/lightning-safety , https://www.weather.gov/safety/lightning-safety-overview
