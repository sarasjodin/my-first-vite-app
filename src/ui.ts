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
    link.href = course.syllabus;
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
