export function useResponsive() {
  const isMobile = ref<boolean>(false);

  function checkMobile() {
    isMobile.value = window.innerWidth < 1024;
  }

  onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
  });

  return {
    isMobile: readonly(isMobile)
  }
}
