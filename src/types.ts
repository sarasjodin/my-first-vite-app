//"export" gör den möjlig att importera i andra ts-filer
export interface CourseInfo {
  code: string;
  coursename: string;
  progression: 'A' | 'B' | 'C'; // Använder sig av "string literal union"
  syllabus: string;
}
