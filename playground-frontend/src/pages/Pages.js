import { Role } from '@/entities/Role.js';

export const TestsPage = 'Tests';
export const TestModelsPage = 'TestModels';
export const QuestionsPage = 'Questions';
export const StatisticsPage = 'Statistics';

export const TeacherPages = Object.freeze([
    TestsPage,
    QuestionsPage,
    TestModelsPage,
    StatisticsPage,
]);

export const StudentPages = Object.freeze([TestsPage]);

export const pagesFor = role => {
    switch (role) {
        case Role.Teacher:
        case Role.Admin: {
            return TeacherPages;
        }
        case Role.Student: {
            return StudentPages;
        }
        default: {
            return [];
        }
    }
};
