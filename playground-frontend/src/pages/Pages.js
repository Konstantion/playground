import {Role} from '@/entities/Role.js';

export const TestsPage = 'Tests';
export const QuestionsPage = 'Questions';
export const StatisticsPage = 'Statistics';

export const TeacherPages = Object.freeze([TestsPage, QuestionsPage, StatisticsPage]);

export const StudentPages = Object.freeze([TestsPage]);

export const pagesFor = role => {
    switch (role) {
        case Role.Teacher: {
            return TeacherPages;
        }
        case Role.Admin: {
            return TeacherPages;
        }
        case Role.Student: {
            return StudentPages;
        }
    }
};
