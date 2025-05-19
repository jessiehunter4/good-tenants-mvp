
/**
 * Utility functions for handling registration data
 */

export interface RegistrationData {
  name?: string | null;
  phone?: string | null;
  moveInDate?: string | null;
  city?: string | null;
}

/**
 * Get prefilled registration data from sessionStorage
 */
export const getPrefilledData = (): RegistrationData | null => {
  try {
    const storedData = sessionStorage.getItem("onboarding_data");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      
      // Clean up after retrieving
      sessionStorage.removeItem("onboarding_data");
      
      return parsedData;
    }
  } catch (error) {
    console.error("Error retrieving prefilled data:", error);
  }
  
  return null;
};

/**
 * Store prefilled registration data to sessionStorage
 */
export const storePrefilledData = (data: RegistrationData): void => {
  try {
    sessionStorage.setItem("onboarding_data", JSON.stringify(data));
  } catch (error) {
    console.error("Error storing prefilled data:", error);
  }
};
