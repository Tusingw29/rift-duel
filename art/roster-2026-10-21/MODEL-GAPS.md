# Concept fidelity audit — Alpha 0.61

User feedback, 22 October 2026: Claude's Three.js-built characters look substantially better, but their identities drifted away from the concept art. Preserve the improved anatomical bodies, Three.js/Node pipeline, animation, weapons and loading improvements. The next work is costume and silhouette fidelity, not another engine change or replacement concept package.

Evidence: inspected all five non-Tala concept boards, the established Tala Design 02 board, `scripts/fighter-specs.mjs`, and the builder's tailoring/material branches. This is a source-and-concept audit, not a new hands-on gameplay review. Only Tala currently has a custom tailoring branch; the other characters use recolored MakeHuman stock outfits.

The original roster document says A/B/C are alternatives and the pose sheets use A provisionally. Use A as the existing working reference, not as a falsely recorded final user selection. Tala's later Design 02 sheet supersedes the initial A sketch.

| Fighter | Current source drift | Restore from working concept |
| --- | --- | --- |
| Aegis | `male_casualsuit05`: steel-blue jacket and jeans; no concept-specific armor construction | Relay Knight: ivory segmented armor over navy flexible suit, angular helmet/cyan visor, short asymmetric blue cape, forearm emitter, readable energy blade. All three concept alternatives share an armored science-fiction identity. |
| Rei | `female_elegantsuit01`: white business jacket/skirt; ivory long hair | Shrine Exile: dark tied hair, ivory high-collar blouse, plum sash and asymmetric trailing panels over dark trousers, boots, katana and bound-spirit presence. None of the boards uses ivory hair or a business skirt suit. |
| Tala | Only character with a custom costume branch; facial/hair likeness and garment finish remain incomplete | Established Design 02: athletic adult martial artist, auburn high ponytail and swept bangs, ochre open cropped vest over charcoal top, rust shorts, ivory wraps, dark martial shoes. Preserve the newer pipeline's closed-hand and tailoring improvements. |
| Morrow | `male_casualsuit01`: olive casual shirt; physique substitutes for costume identity | Iron Pilgrim: weathered silver hair/eyepatch, substantial olive segmented armor over dark undersuit, ivory worn shoulder mantle, heavy boots, greatsword and shoulder missile housing. Keep strong contrast with Aegis's clean lightweight armor. |
| Sol | `male_elegantsuit01`: recolored red business suit | Ember Cartographer: swept/spiky red hair, long split rust coat, high ivory collar, gold cuff/hem details, dark trousers, boots, cross-body atlas satchel and ornate staff. The long coat and staff silhouette must read at fight distance. |
| Vesper | `female_elegantsuit01`: violet jacket/skirt; similar stock wardrobe to Rei | Astral Mourner: long lavender hair, dark violet floor-length split gown, ivory shoulder drape, gold trim, floating broken halo and wrist rings. Distinguish the oracle silhouette from Rei's mobile swordswoman silhouette. |

## Implementation and review order

1. Aegis as the first costume benchmark: build armor, helmet/visor and cape on the improved body. Keep bone and weapon attachment contracts.
2. Review actual model front, profile and rear beside the A concept, then in guard and full attack motion. A jacket recolor is not an armor implementation.
3. Morrow: heavier armor, mantle, launcher silhouette and veteran face details.
4. Rei, Sol and Vesper: distinct garment lengths, panels and secondary movement; no shared business-suit silhouette.
5. Tala: preserve her improved working model and finish likeness/garment details against Design 02.

For each fighter, check silhouette without color, then large color masses, face/hair, costume construction, weapons/accessories, and movement. Automated tests verify compatibility and stability; they cannot establish concept fidelity. Do not expand the next art change across the entire roster before inspecting the first character's actual rendered result.

No model or public game was changed by this audit.

## Morrow sword update

The user subsequently requested a much larger Cloud-scale / Berserk-weight original sword and a matching concept redesign. [Morrow — Gravebound](../morrow-gravebound/README.md) is the new sword-and-character working direction, retaining Iron Pilgrim armor and identity. It supersedes the original board’s smaller sword, not the rest of the roster.
