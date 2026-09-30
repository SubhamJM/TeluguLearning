import { describe, it, expect } from 'vitest';
import { SEED_PLAYGROUND_SETS } from '../store/playgroundStore';

describe('playgroundStore', () => {
  it('contains seed playground sets with valid mappings and phrases', () => {
    expect(SEED_PLAYGROUND_SETS.length).toBeGreaterThanOrEqual(3);
    const basics = SEED_PLAYGROUND_SETS.find((s) => s.name === 'My Telugu Basics');
    expect(basics).toBeDefined();
    expect(basics?.mappings.length).toBeGreaterThanOrEqual(4);

    // Verify Nenu -> Main exists
    const nenu = basics?.mappings.find((m) => m.telugu === 'Nenu');
    expect(nenu).toBeDefined();
    expect(nenu?.hindi).toBe('Main');

    // Verify Naaku -> Mujhe exists
    const naaku = basics?.mappings.find((m) => m.telugu === 'Naaku');
    expect(naaku).toBeDefined();
    expect(naaku?.hindi).toBe('Mujhe');
  });

  it('contains phrases in seed sets for sentence games', () => {
    const hostel = SEED_PLAYGROUND_SETS.find((s) => s.name === 'Hostel Telugu');
    expect(hostel).toBeDefined();
    expect(hostel?.phrases.length).toBeGreaterThanOrEqual(2);
    expect(hostel?.phrases.some((p) => p.telugu.includes('Mess'))).toBe(true);
  });
});
