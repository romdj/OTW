<script lang="ts">
  import { page } from '$app/stores';
  import { Breadcrumbs } from '../../../components/Navigation';
  import { SPORTS } from '../../../components/Sports';

  $: sportId = $page.params.sport;
  $: sportConfig = SPORTS.find((s) => s.id === sportId);
</script>

<div class="space-y-4">
  <!-- Breadcrumbs -->
  <Breadcrumbs />

  <!-- Sport Content -->
  <slot />
</div>
