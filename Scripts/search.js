// ===== SEARCH =====

// Safe regex compiler
export function compileRegex(input, flags = 'i') {
  try {
    return input ? new RegExp(input, flags) : null;
  } catch {
    return null;
  }
}

// Filter tasks by regex pattern
export function filterTasks(tasks, pattern) {
  if (!pattern) return tasks;
  const re = compileRegex(pattern);
  if (!re) return tasks;
  return tasks.filter(t =>
    re.test(t.title) || re.test(t.tag) || re.test(t.priority)
  );
}

// Highlight matches in text
export function highlight(text, re) {
  if (!re) return text;
  return String(text).replace(re, m => `<mark>${m}</mark>`);
}