import { CourseInfo } from './types';
import { showStatus } from './ui';

/**
 * Hämtar kurser från extern data från API.
 * Om det misslyckas, hämtas en lokal kopia json från /public
 * Returnerar alltid CourseInfo
 */
export async function fetchCourses(): Promise<CourseInfo[]> {
  console.log('Anropar fetchCourses...');

  type RawCourse = {
    code: string;
    coursename: string;
    progression: string;
    syllabus: string;
  };

  const tryFetch = async (
    url: string,
    source: string
  ): Promise<CourseInfo[]> => {
    const res: Response = await fetch(url);
    if (!res.ok) throw new Error(`Kunde inte hämta från ${source}`);

    showStatus(`Kurser laddade från ${source}`, 'info');
    console.log(`Kurser laddade från ${source}`);

    // Typa som RawCourse[], mappa till din strikta CourseInfo
    const rawCourses = (await res.json()) as RawCourse[];

    return rawCourses.map((course) => ({
      code: course.code.toUpperCase(),
      coursename: course.coursename,
      progression: course.progression as 'A' | 'B' | 'C',
      syllabus: course.syllabus,
    }));
  };

  try {
    return await tryFetch(
      'https://webbutveckling.miun.se/files/ramschema_ht24.json',
      'API'
    );
  } catch (error) {
    console.warn('Extern hämtning misslyckades, provar lokal fil...', error);
    showStatus('Kunde inte ladda från API. Visar lokal fil', 'warning');
    return await tryFetch('/ramschema_ht24.json', 'lokal JSON-fil');
  }
}
