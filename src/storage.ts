import { CourseInfo } from './types';

/**
 * Läser in kurser från localStorage
 * Returnerar en array – en tom om inget finns eller JSON är ogiltig
 */
export function loadFromLocalStorage(): CourseInfo[] {
  const stored = localStorage.getItem('courses');
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored) as CourseInfo[];
    return parsed;
  } catch {
    console.warn('Kunde inte parsa kursdata från localStorage');
    return [];
  }
}

/**
 * Sparar aktuell kurslista till localStorage som JSON-sträng
 * Tar emot datan direkt som argument, istället för att hämta den från en global variabel
 */
export function saveToLocalStorage(courses: CourseInfo[]): void {
  localStorage.setItem('courses', JSON.stringify(courses));
}
