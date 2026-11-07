# Options audit tables

Build `f7116242389d`, switches movement=v2&arena=ring&burst=v2&step=linear&airlock=12. Each cell: who comes out ahead over all 30 ordered fighter pairs. **A** = attacker's option wins, **D** = defender's, **=** = even/safe (neither can punish). "A 22/30" means a split, with the majority shown.

## close — both commit (guess)

Point blank, 2.0 units, both neutral.

| Attacker ↓ / Defender → | guard | strike | grab | backdash | sidestep | freshGuard | wait |
|---|---|---|---|---|---|---|---|
| strike | D 25/30 | A 21/30 | A | D | = | D | A |
| grab | A | D | = | A | D | D | A |
| launcher | D | D | D | D | D | D 25/30 | A |
| upSpecial | D | D | D | A 20/30 | D 20/30 | D | A |
| towardSpecial | D | D | D | A | D | D 25/30 | A |
| wait | = | D | D | = | = | = | = |

## close — defender reacts at 15f

Point blank, 2.0 units, both neutral.

| Attacker ↓ / Defender → | guard | strike | grab | backdash | sidestep | freshGuard |
|---|---|---|---|---|---|---|
| strike | A | A | A | A | A | A |
| grab | A | A | A | A | A | A |
| launcher | D | A | A | A 20/30 | A 25/30 | D |
| upSpecial | D 25/30 | A | A | A | A | D 25/30 |
| towardSpecial | = 25/30 | A | A | A | A 25/30 | = 25/30 |
| wait | = | = | = | = | = | = |

## tip — both commit (guess)

Edge of reach, 2.8 units: outside most strikes, inside grab range.

| Attacker ↓ / Defender → | guard | strike | grab | backdash | sidestep | walkIn | wait |
|---|---|---|---|---|---|---|---|
| strike | = 20/30 | A 16/30 | A 15/30 | A 20/30 | D 29/30 | A | A |
| grab | A | A 15/30 | = | A | D | A | A |
| launcher | D | D | D | D | D | A | A 20/30 |
| upSpecial | D | D | D | A 15/30 | D 20/30 | A | A |
| pursuit | D | A | A | D | A | A | A |
| dashStrike | = | D | D | = | = | = | = |
| wait | = | D | D | = | = | = | = |

## tip — defender reacts at 15f

Edge of reach, 2.8 units: outside most strikes, inside grab range.

| Attacker ↓ / Defender → | guard | strike | grab | backdash | sidestep |
|---|---|---|---|---|---|
| strike | A 15/30 | A | A | A | A |
| grab | A | A | A | A | A |
| launcher | D | A 20/30 | A 20/30 | D | A 15/30 |
| upSpecial | D 25/30 | A | A | A 25/30 | A 25/30 |
| pursuit | A | A | A | A | A |
| dashStrike | = | = | A | = | = |
| wait | = | = | = | = | = |

## third — both commit (guess)

Defender guarding a chain: attacker chooses what follows hit 2.

| Attacker ↓ / Defender → | guardPunish | reversal | mashAfterBlock | backdashAfter2 |
|---|---|---|---|---|
| chain3 | D | D | A 21/30 | = |
| chain2grab | A | = | A 21/30 | A |
| chain2stop | D | = | A 21/30 | = |
| chain2late | D | D 25/30 | A 21/30 | = |

## middle — both commit (guess)

Middle range, 5 units.

| Attacker ↓ / Defender → | guard | sidestep | backdash | walkIn | shot | charge | wait |
|---|---|---|---|---|---|---|---|
| towardSpecial | = | D 25/30 | A | A | D 25/30 | A | A |
| towardAlt | = 25/30 | D 15/30 | A 25/30 | A | D 26/30 | A 25/30 | A 25/30 |
| awaySpecial | = | = 19/30 | A | A | D 26/30 | A | A |
| awayAlt | = | A 25/30 | = 20/30 | D 20/30 | D 27/30 | = 20/30 | = 20/30 |
| upSpecial | D 25/30 | D 25/30 | D 15/30 | A | D | A 15/30 | A 15/30 |
| pursuit | D | D | D | D 25/30 | D | D | D |
| dashStrike | = | = | = | = | D | = | = |
| grab | A | A | A | A | D | A | A |

## middle — defender reacts at 15f

Middle range, 5 units.

| Attacker ↓ / Defender → | guard | sidestep | backdash |
|---|---|---|---|
| towardSpecial | = | D 25/30 | A |
| towardAlt | = 25/30 | D 15/30 | A 25/30 |
| awaySpecial | = | = | A |
| awayAlt | = | A 25/30 | = 20/30 |
| upSpecial | D 25/30 | D 25/30 | D 15/30 |
| pursuit | D | D | D |
| dashStrike | = | = | = |
| grab | A | D | A |

## far — both commit (guess)

Far range, 9 units.

| Attacker ↓ / Defender → | guard | breakTap | sidestep | walkIn | shot | charge | wait |
|---|---|---|---|---|---|---|---|
| shot | = | A | = 26/30 | A | A 15/30 | A | A |
| towardSpecial | = | A | = | A | D 19/30 | A | A |
| towardAlt | = | A 25/30 | = 20/30 | A 25/30 | D 21/30 | A 25/30 | A 25/30 |
| grab | A | = | = 20/30 | A | D | A | A |
| chargeLong | = | = | = | = | D | = | = |
| dashStrike | = | = | = | = | D | = | = |

## far — defender reacts at 15f

Far range, 9 units.

| Attacker ↓ / Defender → | guard | breakTap | sidestep |
|---|---|---|---|
| shot | = | A | = |
| towardSpecial | = | A | = |
| towardAlt | = | A 25/30 | = 20/30 |
| grab | A | = | = 25/30 |
| chargeLong | = | = | = |
| dashStrike | = | = | = |

## air — both commit (guess)

After a landed launcher: the defender is airborne.

| Attacker ↓ / Defender → | airRecover | airRecoverUnlock | airRecoverLate | airRecoverReact | wait |
|---|---|---|---|---|---|
| pursuitAir | A | A | A | A | A |
| wait | A | D | = | = | A |

## wake — both commit (guess)

Defender knocked down 2.5 units away; attacker times an option to their wake-up.

| Attacker ↓ / Defender → | wait | rollAway | rollToward | rollSide | guardGetup | getupAttack |
|---|---|---|---|---|---|---|
| meaty | A | = | = | = | D | A |
| meatyGrab | A | = | = | = | D | A |
| delayGrab | A | A | A | A | A | D 25/30 |
| delayStrike | A | A | A | A | D 20/30 | D 25/30 |
| waitPunish | A | = | A | = | D 20/30 | A 20/30 |
| backdash | A | = | = | = | A | D |
