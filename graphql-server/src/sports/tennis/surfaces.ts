/**
 * Tennis - Playing Surfaces
 *
 * Different court surfaces significantly impact gameplay and player styles.
 */

export const TennisSurfaces = {
  hard: {
    name: 'Hard Court',
    speed: 'medium-fast',
    bounce: 'consistent',
    majorTournaments: ['Australian Open', 'US Open'],
    favoredStyles: ['big_servers', 'aggressive_baseliners'],
    characteristics: [
      'consistent_bounce',
      'medium_rally_length',
      'rewards_power',
    ],
  },

  clay: {
    name: 'Clay Court',
    speed: 'slow',
    bounce: 'high',
    majorTournaments: ['French Open'],
    favoredStyles: ['grinders', 'defensive_baseliners', 'heavy_topspin'],
    characteristics: [
      'high_slow_bounce',
      'long_rallies',
      'sliding_movement',
      'physical_endurance',
    ],
  },

  grass: {
    name: 'Grass Court',
    speed: 'fast',
    bounce: 'low_irregular',
    majorTournaments: ['Wimbledon'],
    favoredStyles: ['serve_and_volley', 'big_servers', 'slice_specialists'],
    characteristics: [
      'low_skidding_bounce',
      'short_points',
      'rewards_net_play',
      'traditional_tennis',
    ],
  },

  indoor: {
    name: 'Indoor Hard',
    speed: 'fast',
    bounce: 'consistent',
    majorTournaments: ['ATP Finals'],
    favoredStyles: ['big_servers', 'aggressive_players'],
    characteristics: [
      'no_wind_sun_factors',
      'consistent_conditions',
      'favors_power',
    ],
  },
} as const;

export type TennisSurfaceType = keyof typeof TennisSurfaces;
export type TennisSurfacesType = typeof TennisSurfaces;
