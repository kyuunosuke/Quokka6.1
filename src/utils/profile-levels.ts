// Profile level calculation utility

export interface ProfileLevelInfo {
  level: number;
  progress: number;
  nextLevelRequirements: string[];
  completedSections: string[];
  incompleteSections: string[];
  canAdvanceToLevel3: boolean;
  canAdvanceToLevel4: boolean;
  warningMessage?: string;
}

export function calculateProfileLevel(userData: any): ProfileLevelInfo {
  // Basic Information fields (Level 1 - always completed for signed-up users)
  const basicFields = ["nickname", "email"];

  // General Profile fields (Level 2)
  const generalFields = [
    "first_name",
    "last_name",
    "gender",
    "date_of_birth",
    "postcode",
  ];

  // Demographic & Lifestyle fields (Level 3)
  const demographicFields = [
    "interests",
    "hobbies",
    "occupation",
    "marital_status",
    "income_range",
    "education",
    "ethnicity",
    "languages_spoken",
    "home_ownership",
    "vehicle_ownership",
    "pet_ownership",
  ];

  // Check field completion
  const isFieldComplete = (field: string, value: any): boolean => {
    if (value === null || value === undefined || value === "") {
      return false;
    }
    if (Array.isArray(value)) {
      return (
        value.length > 0 &&
        value.some((item) => item && item.trim && item.trim() !== "")
      );
    }
    if (typeof value === "string") {
      return value.trim() !== "";
    }
    return true;
  };

  // Calculate completion for each section
  const basicComplete = basicFields.every((field) =>
    isFieldComplete(field, userData?.[field]),
  );
  const generalComplete = generalFields.every((field) =>
    isFieldComplete(field, userData?.[field]),
  );
  const demographicComplete = demographicFields.every((field) =>
    isFieldComplete(field, userData?.[field]),
  );

  // Check verification status (Level 4)
  const verificationApproved = userData?.verification_status === "approved";

  // Calculate incomplete fields for each section
  const incompleteGeneral = generalFields.filter(
    (field) => !isFieldComplete(field, userData?.[field]),
  );
  const incompleteDemographic = demographicFields.filter(
    (field) => !isFieldComplete(field, userData?.[field]),
  );

  let level = 1; // Minimum level (Basic Information always complete)
  let progress = 25; // Start at 25% for Level 1 (now 4 levels total)
  let nextLevelRequirements: string[] = [];
  let completedSections: string[] = ["Basic Information"];
  let incompleteSections: string[] = [];
  let canAdvanceToLevel3 = false;
  let canAdvanceToLevel4 = false;
  let warningMessage: string | undefined;

  // Determine level and progress
  if (generalComplete && demographicComplete && verificationApproved) {
    level = 4;
    progress = 100;
    nextLevelRequirements = [];
    completedSections = [
      "Basic Information",
      "General Profile",
      "Demographic & Lifestyle",
      "Verification",
    ];
    canAdvanceToLevel3 = true;
    canAdvanceToLevel4 = true;
  } else if (generalComplete && demographicComplete) {
    level = 3;
    progress = 75;
    canAdvanceToLevel3 = true;
    canAdvanceToLevel4 = true;
    nextLevelRequirements = [
      "Complete identity verification to reach Rank 4:",
      "• Upload identification document (Passport or Driver's License)",
      "• Wait for admin approval",
    ];
    completedSections = [
      "Basic Information",
      "General Profile",
      "Demographic & Lifestyle",
    ];
    incompleteSections = ["Verification"];
  } else if (generalComplete) {
    level = 2;
    progress = 50;
    canAdvanceToLevel3 = true;
    canAdvanceToLevel4 = false;
    if (incompleteDemographic.length > 0) {
      nextLevelRequirements = [
        "Complete all Demographic & Lifestyle fields:",
        ...incompleteDemographic.map((field) => `• ${formatFieldName(field)}`),
      ];
      incompleteSections = ["Demographic & Lifestyle"];
    }
    completedSections = ["Basic Information", "General Profile"];
  } else {
    level = 1;
    progress = 25;
    canAdvanceToLevel3 = false;
    canAdvanceToLevel4 = false;

    if (incompleteGeneral.length > 0) {
      nextLevelRequirements = [
        "Complete all General Profile fields to reach Rank 2:",
        ...incompleteGeneral.map((field) => `• ${formatFieldName(field)}`),
      ];
      incompleteSections = ["General Profile"];

      if (incompleteDemographic.length > 0) {
        incompleteSections.push("Demographic & Lifestyle");
      }
    }

    // Warning message for Rank 3 attempt
    if (!generalComplete) {
      warningMessage =
        "You must complete Rank 2 (General Profile) before you can advance to Rank 3 (Demographic & Lifestyle).";
    }
  }

  // Warning message for Rank 4 attempt
  if (!canAdvanceToLevel4 && level < 3) {
    if (!warningMessage) {
      warningMessage =
        "You must complete Rank 3 (Demographic & Lifestyle) before you can advance to Rank 4 (Verification).";
    }
  }

  return {
    level,
    progress,
    nextLevelRequirements,
    completedSections,
    incompleteSections,
    canAdvanceToLevel3,
    canAdvanceToLevel4,
    warningMessage,
  };
}

// Helper function to format field names for display
function formatFieldName(field: string): string {
  const fieldNames: { [key: string]: string } = {
    first_name: "First Name",
    last_name: "Last Name",
    date_of_birth: "Date of Birth",
    marital_status: "Marital Status",
    income_range: "Income Range",
    languages_spoken: "Languages Spoken",
    home_ownership: "Home Ownership",
    vehicle_ownership: "Vehicle Ownership",
    pet_ownership: "Pet Ownership",
  };

  return (
    fieldNames[field] ||
    field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ")
  );
}

// Get rank badge color
export function getLevelBadgeColor(level: number): string {
  switch (level) {
    case 1:
      return "bg-gray-100 text-gray-800 border-gray-200";
    case 2:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case 3:
      return "bg-green-100 text-green-800 border-green-200";
    case 4:
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

// Get progress bar color
export function getProgressBarColor(level: number): string {
  switch (level) {
    case 1:
      return "bg-gray-500";
    case 2:
      return "bg-blue-500";
    case 3:
      return "bg-green-500";
    case 4:
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
}
