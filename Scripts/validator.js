// Rule 1 — Title no leading/trailing spaces, no double spaces
export function validateTitle(value) {
  const duplicateWord = /\b(\w+)\s+\1\b/i;

  if (!value || value.trim() === '') return 'Title is required';
  if (value !== value.trim()) return 'Title cannot have leading or trailing spaces';
  if (duplicateWord.test(value)) return 'Title contains a duplicate word';
  return null;
}


// Rule 2 — Date must be YYYY-MM-DD
export function validateDate(value) {
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!value) return 'Due date is required';
  if (!dateRegex.test(value)) return 'Date must be in YYYY-MM-DD format';
  return null;
}

// Rule 3 — Duration positive number, up to 2 decimal places
export function validateDuration(value) {
  const durationRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
  if (!value) return 'Duration is required';
  if (!durationRegex.test(value)) return 'Duration must be a positive number e.g. 90 or 1.5';
  return null;
}

// Rule 4 Tag: letters, spaces, hyphens only
export function validateTag(value) {
  const tagRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
  if (!value) return 'Tag is required';
  if (!tagRegex.test(value)) return 'Tag can only contain letters, spaces, or hyphens';
  return null;
}


// Priority validation
export function validatePriority(value) {
  if (!value) return 'Please select a priority';
  return null;
}

// Run all validations and return errors object
export function validateForm(data) {
  return {
    title: validateTitle(data.title),
    dueDate: validateDate(data.dueDate),
    duration: validateDuration(data.duration),
    priority: validatePriority(data.priority),
    tag: validateTag(data.tag),
  };
}