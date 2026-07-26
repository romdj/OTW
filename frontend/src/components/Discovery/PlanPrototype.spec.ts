import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import PlanPrototype from './PlanPrototype.svelte';

describe('PlanPrototype', () => {
  it('starts in Guidance with score hints and no results', async () => {
    render(PlanPrototype);
    expect(await screen.findByText('OTW 96')).toBeTruthy();
    expect(screen.queryByText(/defeated/i)).toBeNull();
    expect(screen.getByText(/opted-in quality hint/i)).toBeTruthy();
  });

  it('requires confirmation before revealing all results', async () => {
    render(PlanPrototype);
    await fireEvent.click(screen.getByText('Full story'));
    expect(screen.getByRole('alertdialog', { name: 'Reveal every result?' })).toBeTruthy();
    await fireEvent.click(screen.getByRole('button', { name: 'Reveal full story' }));
    expect(await screen.findByText(/Okafor defeated Lind/i)).toBeTruthy();
  });

  it('supports a local reveal without changing global disclosure', async () => {
    render(PlanPrototype);
    await screen.findByText('OTW 96');
    await fireEvent.click(screen.getAllByRole('button', { name: /Details/ })[0]);
    const dialog = screen.getByRole('dialog');
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Reveal this event' }));
    expect(await within(dialog).findByText(/Okafor defeated Lind/i)).toBeTruthy();
    expect(screen.getByText(/Quality hints on · Results hidden/i)).toBeTruthy();
  });

  it('queues, marks watched, and records usefulness feedback', async () => {
    render(PlanPrototype);
    await screen.findByText('OTW 96');
    await fireEvent.click(screen.getByRole('button', { name: /Add Amara Okafor — Sofia Lind to queue/ }));
    const queue = screen.getByRole('complementary', { name: 'Your queue' });
    await fireEvent.click(within(queue).getByRole('button', { name: 'Mark watched' }));
    await fireEvent.click(within(queue).getByRole('button', { name: 'Great pick' }));
    await waitFor(() => expect(within(queue).getByRole('button', { name: 'Great pick' }).classList.contains('chosen')).toBe(true));
  });
});
