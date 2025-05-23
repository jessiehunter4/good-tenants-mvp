
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export type Permission = 
  | "view_tenant_directory"
  | "create_listing"
  | "manage_listings"
  | "admin_access"
  | "create_invite"
  | "view_invites"
  | "profile_management"
  | "use_messaging"
  | "schedule_showings"
  | "review_applications"
  | "advanced_screening";

export type AccessTier = "basic" | "verified" | "premium";

export type RoleType = "tenant" | "agent" | "landlord" | "admin";

interface RolePermissions {
  [key: string]: {
    permissions: Permission[];
    tier: AccessTier;
  };
}

const ROLE_PERMISSIONS: RolePermissions = {
  tenant: {
    permissions: ["profile_management", "view_invites", "use_messaging", "schedule_showings"],
    tier: "basic"
  },
  agent: {
    permissions: [
      "view_tenant_directory", 
      "create_listing", 
      "manage_listings", 
      "create_invite", 
      "profile_management", 
      "view_invites", 
      "use_messaging", 
      "schedule_showings",
      "review_applications"
    ],
    tier: "basic"
  },
  landlord: {
    permissions: [
      "view_tenant_directory", 
      "create_listing", 
      "manage_listings", 
      "create_invite", 
      "profile_management", 
      "view_invites", 
      "use_messaging", 
      "schedule_showings",
      "review_applications"
    ],
    tier: "basic"
  },
  admin: {
    permissions: [
      "view_tenant_directory", 
      "create_listing", 
      "manage_listings", 
      "admin_access", 
      "create_invite", 
      "profile_management", 
      "view_invites", 
      "use_messaging", 
      "schedule_showings",
      "review_applications", 
      "advanced_screening"
    ],
    tier: "premium"
  }
};

interface VerificationStatus {
  [key: string]: boolean;
}

const VERIFICATION_STATUS: VerificationStatus = {
  incomplete: false,
  basic: false,
  verified: true,
  premium: true
};

export const useRolePermissions = () => {
  const { user, userProfile } = useAuth();
  const [role, setRole] = useState<RoleType>("tenant");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [tier, setTier] = useState<AccessTier>("basic");
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    if (user?.role) {
      const userRole = user.role as RoleType;
      setRole(userRole);

      // Set permissions based on role
      const rolePerms = ROLE_PERMISSIONS[userRole]?.permissions || [];
      setPermissions(rolePerms);

      // Determine tier based on profile status
      if (userProfile?.status) {
        const profileStatus = userProfile.status;
        if (profileStatus === "premium") {
          setTier("premium");
        } else if (profileStatus === "verified") {
          setTier("verified");
        } else {
          setTier("basic");
        }
        setIsVerified(VERIFICATION_STATUS[profileStatus] || false);
      }
    }
  }, [user, userProfile]);

  const canAccess = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  return {
    role,
    permissions,
    tier,
    isVerified,
    canAccess,
  };
};
