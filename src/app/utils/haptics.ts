/** Vibração curta dupla — sinaliza erro */
export function hapticError() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([35, 15, 35]);
  }
}

/** Vibração muito suave — sinaliza acerto */
export function hapticSuccess() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(12);
  }
}
