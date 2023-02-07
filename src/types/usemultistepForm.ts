import { useState } from "uelements";
import { ComponentChildren } from "uelements";

function usemultistepForm(steps: any[]) {
  const [currentStepindex, setCurrentStepIndex] = useState<number>(0);
  const cmpComponentsLength = steps.length
  function next() {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  }

  function back() {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  }

  function goTo(index: number) {
    setCurrentStepIndex(index);
  }
  return {
    currentStepindex,
    step: steps[currentStepindex],
    next,
    back,
    goTo,
  cmpComponentsLength 

  };
}

export default usemultistepForm;