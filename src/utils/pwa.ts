export const isIOS = () => {
  if (typeof window === 'undefined') return false
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

export const isStandalone = () => {
  if (typeof window === 'undefined') return false
  return (
    (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches
  )
}
