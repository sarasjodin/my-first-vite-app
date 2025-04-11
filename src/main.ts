// Importerar global CSS och typer för kurser
import './style.css';
import { CourseInfo } from './types';
import { fetchCourses } from './api';
import { renderCourses } from './ui';
import { saveToLocalStorage } from './storage';
import { loadFromLocalStorage } from './storage';
import { showStatus } from './ui';

// Ref till formulär och kurslistan i DOM
// Kanske returnerar null särav "as HTMLFormElement" (sist)
const form = document.getElementById('course-form') as HTMLFormElement;
const courseList = document.getElementById('course-list') as HTMLElement;

// Kurslistan är en array med typ CourseInfo
let courses: CourseInfo[] = [];

// Borde returnera null därav "as HTMLFormElement" (sist)
const clearBtn = document.getElementById('clear-storage') as HTMLButtonElement;

clearBtn.addEventListener('click', (e: MouseEvent): void => {
  e.preventDefault();
  if (confirm('Är du säker på att du vill rensa alla sparade kurser?')) {
    localStorage.removeItem('courses');
    console.log('Kurser rensas och laddar om...');
    showStatus('Kurser rensas och laddar om...', 'info');

    setTimeout(() => {
      location.reload();
    }, 1000); // Vänta lite för att visa status först
  }
});

// Lyssnar på formulärets submit
// Validerar formuläret och lägger till ett kursobjekt
form.addEventListener('submit', (e: SubmitEvent): void => {
  e.preventDefault();

  const codeInput = document.getElementById('code') as HTMLInputElement | null;
  const nameInput = document.getElementById(
    'course-name'
  ) as HTMLInputElement | null;
  const progressionSelect = document.getElementById(
    'progression'
  ) as HTMLSelectElement | null;
  const syllabusInput = document.getElementById(
    'syllabus'
  ) as HTMLInputElement | null;

  // Ser till att alla fält är tillgängliga i DOM:en innan de används
  if (!codeInput || !nameInput || !progressionSelect || !syllabusInput) {
    return;
  }

  // Ser till att kurskoden visas i versaler
  const code: string = codeInput.value.trim().toUpperCase();
  const coursename: string = nameInput.value.trim();
  const progression = progressionSelect.value as 'A' | 'B' | 'C';
  const syllabus:string = syllabusInput.value.trim();

  // Förhindrar dubbletter baserat på kurskod (case-insensitive jämförelse)
  if (courses.some((c) => c.code.toUpperCase() === code.toUpperCase())) {
    console.log('Kurskoden finns redan, ingen kurs har blivit tillagd');
    showStatus(
      'Kurskoden finns redan. Ingen kurs har blivit tillagd.',
      'warning'
    );
    return;
  }

  // Lägger till ny kurs som sparas lokalt och visas i gränssnittet
  const newCourse: CourseInfo = { code, coursename, progression, syllabus };
  courses.push(newCourse);
  console.log('Ny kurs har blivit tillagd');
  showStatus('Ny kurs har blivit tillagd', 'info');
  saveToLocalStorage(courses); // Skickar med aktuell lista (data) för att spara
  console.log('Ny kurs har sparats till localStorage');
  showStatus('Ny kurs har sparats till local storage', 'info');
  renderCourses(courses, courseList); // Skickar med data + DOM-element för att visa
  console.log('Ny kurs visas');
  showStatus('Ny kurs visas', 'info');
  form.reset();
});

/**
 * Startfunktion som körs när sidan laddas
 * Försöker först läsa lokalt sparad data – annars hämtas den från nätet
 * Kurserna renderas till sidan
 */
async function init(): Promise<void> {
  console.log('Init startar');

  try {
    const local: CourseInfo[] = loadFromLocalStorage();

    if (local.length) {
      // Det finns redan sparade kurser i localStorage
      console.log('Data från localStorage');
      showStatus('Kurser inlästa från localStorage', 'info');
      courses = local;
      console.log('Kurser inlästa', courses);
      showStatus(`Kurser inlästa (${courses.length})`, 'info');
    } else {
      // Inga sparade kurser – hämta från fil/API
      courses = await fetchCourses();
      saveToLocalStorage(courses);
      console.log('Kurser hämtade och sparade till local storage');
      showStatus('Kurser sparade till local storage', 'info');
    }
    console.log('Renderar...');
    renderCourses(courses, courseList);
  } catch (error) {
    console.error('Ett fel inträffade i init:', error);
    showStatus('Kunde inte initiera appen', 'error');
  }
}

// Initierar startfunktionen
init();
