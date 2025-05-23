
import React from "react";
import ProfileForm from "@/components/shared/form/ProfileForm";
import { useTenantOnboarding } from "@/hooks/useTenantOnboarding";
import { getTenantOnboardingFields } from "@/config/tenantOnboardingFields";

const OnboardTenant = () => {
  const { form, onSubmit, isLoading, handleCancel } = useTenantOnboarding();
  const formFields = getTenantOnboardingFields();

  return (
    <ProfileForm
      title="Complete Your Rental Preferences"
      description="Please provide detailed information about your housing needs and preferences."
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isLoading}
      onCancel={handleCancel}
      fields={formFields}
      submitButtonText="Save and Continue"
      cancelButtonText="Back to Home"
    />
  );
};

export default OnboardTenant;
