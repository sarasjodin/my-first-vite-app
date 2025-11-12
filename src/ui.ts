import { CourseInfo } from './types';

let statusTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Renderar alla kurser i ett HTML-element
 * Innehållet i behållaren rensas
 * Använder <article> för varje kurs, med säker noopener noreferrer länk
 */
export function renderCourses(
  courses: CourseInfo[],
  container: HTMLElement
): void {
  container.innerHTML = '';

  courses.forEach((course) => {
    const item = document.createElement('article');

    const heading = document.createElement('h3');
    heading.textContent = `${course.code} - ${course.coursename}`;

    const progress = document.createElement('p');
    progress.textContent = `Progression: ${course.progression}`;

    const link = document.createElement('a');
    const safeHref = safeUrl(course.syllabus);
    if (safeHref) {
      link.href = safeHref;
    } else {
      link.removeAttribute('href');
      link.textContent = 'Ogiltig kurslänk';
    }
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Kursplan';

    item.appendChild(heading);
    item.appendChild(progress);
    item.appendChild(link);
    container.appendChild(item);
  });
}

export function showStatus(
  message: string,
  type: 'info' | 'warning' | 'error' = 'info',
  duration: number = 4000 // ms - 4s
): void {
  const statusEl: HTMLElement | null = document.getElementById('status');
  if (!statusEl) return;

  // Visa message
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;

  // Rensa ev tidigare timer
  if (statusTimeout) clearTimeout(statusTimeout);

  // Starta ny timer
  statusTimeout = setTimeout(() => {
    statusEl.textContent = '';
    statusEl.className = 'status';
  }, duration);
}

function safeUrl(input: string): string | null {
  try {
    const url = new URL(input, window.location.origin);
    const protocol = url.protocol.toLowerCase();
    if (protocol === 'http:' || protocol === 'https:') {
      return url.href;
    }
  } catch {
    console.warn('Ogiltig URL i safeUrl:', input);
  }
  return null;
}
