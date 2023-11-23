import { ref } from 'vue';

export function useBoolean(initialValue = false) {
  const bool = ref(initialValue);

  function setBool(val: boolean) {
    bool.value = val;
  }

  function setTrue() {
    setBool(true);
  }

  function setFalse() {
    setBool(false);
  }
  function toggle() {
    setBool(!bool.value);
  }

  return {
    bool,
    setBool,
    setTrue,
    setFalse,
    toggle,
  };
}
