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
    const item: HTMLElement = document.createElement('article');
    item.innerHTML = `
      <h3>${course.code} - ${course.coursename}</h3>
      <p>Progression: ${course.progression}</p>
      <a href="${course.syllabus}" target="_blank" rel="noopener noreferrer">Kursplan</a>
    `;
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
