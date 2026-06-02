<script>
  import { untrack } from 'svelte';
  import { useQuestion } from 'tessera-learn';

  let { question, getAnswer, submitNow } = $props();

  // Tessera's Interaction type wants raw structured data — it does the
  // SCORM 2004 / xAPI string serialization itself. Pre-formatting here
  // breaks formatResponse, which expects e.g. `choice.response` to be a
  // `string[]` and calls `.join('[,]')` on it.
  function buildInteraction(q, a) {
    const kind = q.kind ?? 'mc';

    // Identifiers are readable slugs ("william-lassell"): cmi5 and SCORM 2004
    // write them verbatim (LRS traces stay self-describing), while options /
    // optionPairs let the SCORM 1.2 adapter map each slug to its index — the
    // spec-safe form strict 1.2 validators want. Labels must never be used
    // raw: a space ("William Lassell") fails SCORM 2004 validation (406).
    if (kind === 'mc') {
      const options = q.options.map(slugId);
      const selected = typeof a === 'number' ? options[a] : undefined;
      const correctOpt = Number.isInteger(q.correct) ? options[q.correct] : undefined;
      return {
        type: 'choice',
        response: selected != null ? [selected] : [],
        ...(correctOpt != null ? { correct: [correctOpt] } : {}),
        options,
      };
    }

    if (kind === 'sequencing') {
      const options = q.items.map(slugId);
      const order = Array.isArray(a) ? a : [];
      return {
        type: 'sequencing',
        response: order.map(slugId),
        correct: options,
        options,
      };
    }

    if (kind === 'matching') {
      const left = q.pairs.map((p) => slugId(p.left));
      const right = q.pairs.map((p) => slugId(p.right));
      const responsePairs =
        a && typeof a === 'object'
          ? Object.entries(a).map(([l, r]) => [slugId(l), slugId(r)])
          : [];
      return {
        type: 'matching',
        response: responsePairs,
        correct: q.pairs.map((p) => [slugId(p.left), slugId(p.right)]),
        optionPairs: { left, right },
      };
    }

    if (kind === 'slider') {
      const tol = q.tolerance ?? 0;
      return {
        type: 'numeric',
        response: typeof a === 'number' ? a : 0,
        correct: { min: q.correct - tol, max: q.correct + tol },
      };
    }

    if (kind === 'hotspot') {
      // No clean xAPI cmi.interaction type for 2D click targets; use
      // 'other' with the same coordinate encoding the rest of the
      // challenge uses for display.
      const respStr =
        a && typeof a === 'object' && typeof a.x === 'number'
          ? `${Math.round(a.x)},${Math.round(a.y)}`
          : '';
      const targets = Array.isArray(q.target) ? q.target : [q.target];
      const corrStr = targets.map((t) => `${t.cx},${t.cy}`).join('|');
      return { type: 'other', response: respStr, correct: corrStr };
    }

    return { type: 'other', response: String(a ?? ''), correct: '' };
  }

  function slugId(label) {
    return (
      String(label)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'opt'
    );
  }

  function stableId(q) {
    const k = q.kind ?? 'mc';
    const slug = q.question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);
    const planet = q.planet ? `${q.planet}-` : '';
    return `cosmic-${planet}${k}-${slug}`;
  }

  // The reporter is mounted via `{#key index}` in the parent, so `question`
  // does not change for the lifetime of this instance. `useQuestion` also
  // pins its id at registration. `untrack` makes that intent explicit and
  // silences the prop-read-outside-closure warning.
  const qHook = useQuestion({
    id: untrack(() => stableId(question)),
    response: () => buildInteraction(question, getAnswer()),
  });

  $effect(() => {
    if (submitNow && !qHook.submitted) qHook.submit();
  });
</script>
