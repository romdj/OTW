<script lang="ts">
  import {
    Shield,
    Target,
    CircleDot,
    Medal,
    Dribbble,
    Diamond,
    Swords,
    Sword,
    CarFront,
    Bike,
    Trophy,
  } from 'lucide-svelte';

  export let sportId: string;
  export let size: number = 24;
  export let strokeWidth: number = 1.5;

  const SPORT_ICON_MAP: Record<string, typeof Trophy> = {
    'ice-hockey': Shield,
    'american-football': Target,
    'association-football': CircleDot,
    'tennis': Medal,
    'basketball': Dribbble,
    'baseball': Diamond,
    'cricket': Swords,
    'lacrosse': Sword,
    'formula1': CarFront,
    'cycling': Bike,
  };

  $: IconComponent = SPORT_ICON_MAP[sportId] || Trophy;
</script>

<svelte:component this={IconComponent} {size} {strokeWidth} />
