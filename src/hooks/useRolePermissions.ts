
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export type UserRole = "tenant" | "agent" | "landlord" | "admin";
export type AccessTier = "basic" | "verified" | "premium";
export type Permission = 
  | "view_tenant_directory"
  | "create_listing"
  | "send_invitations"
  | "access_analytics"
  | "manage_properties"
  | "contact_tenants"
  | "view_property_details"
  | "manage_users"
  | "view_admin_dashboard";

interface RolePermissions {
  role: UserRole | null;
  tier: AccessTier;
  permissions: Permission[];
  isVerified: boolean;
  canAccess: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  loading: boolean;
}

// Define permission sets for each role and tier
const ROLE_PERMISSIONS: Record<UserRole, Record<AccessTier, Permission[]>> = {
  tenant: {
    basic: ["view_property_details"],
    verified: ["view_property_details", "contact_tenants"],
    premium: ["view_property_details", "contact_tenants", "access_analytics"]
  },
  agent: {
    basic: ["create_listing", "manage_properties", "view_property_details"],
    verified: ["create_listing", "manage_properties", "view_property_details", "view_tenant_directory", "send_invitations"],
    premium: ["create_listing", "manage_properties", "view_property_details", "view_tenant_directory", "send_invitations", "access_analytics", "contact_tenants"]
  },
  landlord: {
    basic: ["create_listing", "manage_properties", "view_property_details"],
    verified: ["create_listing", "manage_properties", "view_property_details", "view_tenant_directory", "send_invitations"],
    premium: ["create_listing", "manage_properties", "view_property_details", "view_tenant_directory", "send_invitations", "access_analytics", "contact_tenants"]
  },
  admin: {
    basic: ["manage_users", "view_admin_dashboard", "access_analytics"],
    verified: ["manage_users", "view_admin_dashboard", "access_analytics"],
    premium: ["manage_users", "view_admin_dashboard", "access_analytics"]
  }
};

export const useRolePermissions = (): RolePermissions => {
  const { user, getUserRole } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [tier, setTier] = useState<AccessTier>("basic");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userRole = await getUserRole();
        setRole(userRole as UserRole);

        // Fetch user's tier and verification status based on their profile
        // This would typically come from the user's profile table
        // For now, we'll determine it based on profile status
        if (userRole) {
          // TODO: Fetch actual tier and verification status from profile
          setTier("basic"); // Default tier
          setIsVerified(false); // Default verification status
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPermissions();
  }, [user, getUserRole]);

  const permissions = role ? ROLE_PERMISSIONS[role][tier] : [];

  const canAccess = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const hasRole = (checkRole: UserRole): boolean => {
    return role === checkRole;
  };

  return {
    role,
    tier,
    permissions,
    isVerified,
    canAccess,
    hasRole,
    loading
  };
};
