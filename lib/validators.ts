const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const blacklistedDomains = [
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "yopmail.com",
  "dispostable.com",
  "guerrillamail.com"
];

export function validateEmailForMrDuLow(email?: string | null) {
  if (!email || typeof email !== "string") {
    return { isValid: false, error: "Valid email syntax structure is required." };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { isValid: false, error: "Email cannot be empty." };
  }

  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, error: "Invalid email syntax structure." };
  }

  const parts = cleanEmail.split("@");
  if (parts.length < 2 || !parts[1]) {
    return { isValid: false, error: "Invalid email domain structure." };
  }

  const domain = parts[1];

  if (blacklistedDomains.includes(domain)) {
    return { isValid: false, error: "Disposable temporary emails are strictly blocked." };
  }

  return { isValid: true, email: cleanEmail };
}
