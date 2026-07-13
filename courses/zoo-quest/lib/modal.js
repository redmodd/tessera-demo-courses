// Svelte action for every game <dialog>: open it modal, focus the dialog itself rather than a
// button (so nothing looks tab-selected), and route Enter to the primary action when one is on
// screen — mid-question there is no .continue, so Enter does nothing, which is the intent.
export function zooDialog(dlg) {
  dlg.showModal();
  dlg.focus();
  dlg.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target !== dlg) return;
    const btn = dlg.querySelector('.continue');
    if (!btn) return;
    e.preventDefault();
    btn.click();
  });
}
