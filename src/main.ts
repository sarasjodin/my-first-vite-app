import './style.css';
/* import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from './counter.ts'; */
import { CourseInfo } from './types';

const courseList = document.getElementById('courseList') as HTMLElement;
const form = document.getElementById('courseForm') as HTMLFormElement;

let courses: CourseInfo[] = [];

async function fetchCourses(): Promise<CourseInfo[]> {
  try {
    const res = await fetch(
      'https://webbutveckling.miun.se/files/ramschema_ht24.json'
    );
    if (!res.ok) throw new Error('URL misslyckades');
    return await res.json();
  } catch {
    // Fallback till lokal JSON i public-mappen
    const localRes = await fetch('/ramschema_ht24.json');
    return await localRes.json();
  }
}

function loadFromLocalStorage(): CourseInfo[] | null {
  const stored = localStorage.getItem('courses');
  return stored ? JSON.parse(stored) : null;
}

function saveToLocalStorage(): void {
  localStorage.setItem('courses', JSON.stringify(courses));
}

function renderCourses(): void {
  courseList.innerHTML = '';
  courses.forEach((course) => {
    const item = document.createElement('article');
    item.innerHTML = `
      <h3>${course.code} - ${course.coursename}</h3>
      <p>Progression: ${course.progression}</p>
      <a href="${course.syllabus}" target="_blank">Kursplan</a>
    `;
    courseList.appendChild(item);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const code = (
    document.getElementById('code') as HTMLInputElement
  ).value.trim();
  const coursename = (
    document.getElementById('coursename') as HTMLInputElement
  ).value.trim();
  const progression = (
    document.getElementById('progression') as HTMLSelectElement
  ).value as 'A' | 'B' | 'C';
  const syllabus = (
    document.getElementById('syllabus') as HTMLInputElement
  ).value.trim();

  if (courses.some((c) => c.code.toLowerCase() === code.toLowerCase())) {
    alert('Kurskoden finns redan!');
    return;
  }

  const newCourse: CourseInfo = { code, coursename, progression, syllabus };
  courses.push(newCourse);
  saveToLocalStorage();
  renderCourses();
  form.reset();
});

async function init(): Promise<void> {
  const local = loadFromLocalStorage();
  if (local) {
    courses = local;
  } else {
    courses = await fetchCourses();
    saveToLocalStorage(); // Sparar så vi slipper hämta igen
  }
  renderCourses();
}

init();
