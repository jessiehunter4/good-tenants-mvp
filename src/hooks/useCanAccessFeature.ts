
import { useRolePermissions, Permission, AccessTier } from "./useRolePermissions";

interface FeatureAccessOptions {
  permission: Permission;
  requiredTier?: AccessTier;
  requireVerification?: boolean;
}

export const useCanAccessFeature = () => {
  const { canAccess, tier, isVerified } = useRolePermissions();

  const checkAccess = (options: FeatureAccessOptions): boolean => {
    const { permission, requiredTier, requireVerification = false } = options;

    // Check basic permission
    if (!canAccess(permission)) {
      return false;
    }

    // Check tier requirement
    if (requiredTier) {
      const tierLevels = { basic: 0, verified: 1, premium: 2 };
      if (tierLevels[tier] < tierLevels[requiredTier]) {
        return false;
      }
    }

    // Check verification requirement
    if (requireVerification && !isVerified) {
      return false;
    }

    return true;
  };

  return { checkAccess };
};
