import React, { createContext, useContext, useState } from "react";

type OnboardingData = {
  fitnessLevel: string;
  primaryGoal: string;
  secondaryGoals: string[];
  equipment: string[];
  daysPerWeek: number;
  sessionDuration: number;
  restDays: string[];
  isRegenerating: boolean; // Flag to indicate if we are in regeneration mode
};

type OnboardingContextType = {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  resetData: () => void;
};

const defaultData: OnboardingData = {
  fitnessLevel: "beginner",
  primaryGoal: "",
  secondaryGoals: [],
  equipment: [],
  daysPerWeek: 3,
  sessionDuration: 45,
  restDays: [],
  isRegenerating: false,
};

const OnboardingContext = createContext<OnboardingContextType>({
  data: defaultData,
  updateData: () => {},
  resetData: () => {},
});

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<OnboardingData>(defaultData);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData(defaultData);
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </OnboardingContext.Provider>
  );
};
