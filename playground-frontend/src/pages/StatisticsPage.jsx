import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.jsx';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { ErrorType } from '@/utils/ErrorType.js';
import { toast } from 'sonner';

import Header from '@/components/Header.jsx';
import Loading from '@/components/Loading.jsx';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    BarChart3,
    BookOpenText,
    CheckCircle2,
    Percent,
    PieChart,
    AlertTriangle,
    Code2,
    Eye,
    Users,
    Activity,
    TrendingUp,
    TrendingDown,
    Filter,
    XCircle,
    ListChecks,
    Clock,
    HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CodeDisplay = ({ formatAndCode, title = 'Code Snippet' }) => {
    if (!formatAndCode || !formatAndCode.code) {
        return (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                No code snippet available.
            </p>
        );
    }
    return (
        <div className="mt-2">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {title} ({formatAndCode.format || 'N/A'}):
            </p>
            <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md text-xs overflow-x-auto">
                <code className={`language-${formatAndCode.format}`}>{formatAndCode.code}</code>
            </pre>
        </div>
    );
};

const UserTestStatus = {
    NOT_STARTED: 'NOT_STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
};

const attemptStatusFilterOptions = [
    { id: UserTestStatus.COMPLETED, label: 'Completed' },
    { id: UserTestStatus.EXPIRED, label: 'Expired' },
    { id: UserTestStatus.CANCELLED, label: 'Cancelled' },
];

export default function StatisticsPage() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [selectableTests, setSelectableTests] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState('');
    const [testStatistics, setTestStatistics] = useState(null);

    const [isLoadingTests, setIsLoadingTests] = useState(false);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [error, setError] = useState(null);

    const [selectedAttemptStatuses, setSelectedAttemptStatuses] = useState([
        UserTestStatus.COMPLETED,
        UserTestStatus.EXPIRED,
    ]);

    const handleAttemptStatusChange = statusId => {
        setSelectedAttemptStatuses(prev =>
            prev.includes(statusId) ? prev.filter(s => s !== statusId) : [...prev, statusId]
        );

        if (selectedTestId) {
            fetchTestStatistics(selectedTestId);
        }
    };

    const fetchSelectableTests = useCallback(async () => {
        setIsLoadingTests(true);
        setError(null);

        await authenticatedReq(
            Endpoints.ImmutableTest.Base,
            'GET',
            null,
            auth.accessToken,
            (type, message) => {
                setError(`Failed to load tests list: ${message}`);
                if (type === ErrorType.TokenExpired) logout();
                setIsLoadingTests(false);
            },
            data => {
                const testsForSelection = (Array.isArray(data) ? data : [])
                    .filter(test => test.status === 'ACTIVE' || test.status === 'ARCHIVED')
                    .map(t => ({
                        id: t.id,
                        name: t.name,
                        createdAt: t.createdAt,
                        status: t.status,
                    }));
                setSelectableTests(testsForSelection);
                setIsLoadingTests(false);
            }
        );
    }, [auth.accessToken, logout]);

    const fetchTestStatistics = useCallback(
        async testId => {
            if (!testId) {
                setTestStatistics(null);
                return;
            }
            setIsLoadingStats(true);
            setError(null);

            await authenticatedReq(
                `${Endpoints.ImmutableTest.Base}/${testId}`,
                'GET',
                null,
                auth.accessToken,
                (type, message) => {
                    setError(`Failed to load statistics for test ${testId}: ${message}`);
                    if (type === ErrorType.TokenExpired) logout();
                    setTestStatistics(null);
                    setIsLoadingStats(false);
                },
                data => {
                    if (
                        data &&
                        data.id &&
                        Array.isArray(data.questions) &&
                        Array.isArray(data.userTests)
                    ) {
                        const relevantAttempts = data.userTests.filter(ut =>
                            selectedAttemptStatuses.includes(ut.status)
                        );

                        const totalScore = relevantAttempts.reduce(
                            (sum, ut) => sum + (ut.score || 0),
                            0
                        );
                        const avgScore =
                            relevantAttempts.length > 0
                                ? totalScore / relevantAttempts.length
                                : null;

                        const mockStats = {
                            immutableTestId: data.id,
                            testName: data.name,
                            totalConsideredAttempts: relevantAttempts.length,
                            averageScore: avgScore,
                            questionStatistics: data.questions.map(q => {
                                const timesAnswered = relevantAttempts.filter(ut =>
                                    ut.questionAnswers?.some(qa => qa.questionId === q.id)
                                ).length;

                                let timesCorrectlyMock = 0;
                                let questionScoreSum = 0;

                                relevantAttempts.forEach(ut => {
                                    const userAnswerForThisQ = ut.questionAnswers?.find(
                                        qa => qa.questionId === q.id
                                    );
                                    if (userAnswerForThisQ) {
                                        const studentSelectedAnswerIds = new Set(
                                            userAnswerForThisQ.answers.map(a => a.id)
                                        );
                                        const correctVariantIds = new Set(
                                            q.correctVariants.map(v => v.id)
                                        );

                                        let isAttemptCorrect =
                                            studentSelectedAnswerIds.size > 0 &&
                                            [...studentSelectedAnswerIds].every(id =>
                                                correctVariantIds.has(id)
                                            ) &&
                                            studentSelectedAnswerIds.size ===
                                                correctVariantIds.size;

                                        if (isAttemptCorrect) {
                                            timesCorrectlyMock++;
                                            questionScoreSum += 100;
                                        }
                                    }
                                });

                                const averageScoreForQMock =
                                    timesAnswered > 0 ? questionScoreSum / timesAnswered : null;

                                const allVariantOptions = [
                                    ...(q.correctVariants || []).map(v => ({
                                        ...v,
                                        isCorrectOption: true,
                                    })),
                                    ...(q.incorrectVariants || []).map(v => ({
                                        ...v,
                                        isCorrectOption: false,
                                    })),
                                ];

                                const answerOptionStats = allVariantOptions.map(variant => {
                                    let timesSelectedInRelevant = 0;
                                    relevantAttempts.forEach(ut => {
                                        const userAnswerForThisQ = ut.questionAnswers?.find(
                                            qa => qa.questionId === q.id
                                        );
                                        if (
                                            userAnswerForThisQ?.answers.some(
                                                ans => ans.id === variant.id
                                            )
                                        ) {
                                            timesSelectedInRelevant++;
                                        }
                                    });
                                    return {
                                        answerId: variant.id,
                                        originalVariantId: variant.id,
                                        answerText: variant.code?.code
                                            ? `Code: ${variant.code.code.substring(0, 30)}...`
                                            : `Variant Text ID: ${variant.id}`,
                                        answerCode: variant.code
                                            ? { code: variant.code.code, format: q.lang }
                                            : null,
                                        timesSelected: timesSelectedInRelevant,
                                        isCorrectOption: variant.isCorrectOption,
                                    };
                                });

                                return {
                                    originalQuestionId: q.id,
                                    questionTextSnapshot: q.body,
                                    questionFormatAndCodeSnapshot: q.formatAndCode,
                                    totalTimesAnsweredInConsideredTests: timesAnswered,
                                    timesAnsweredCorrectly: timesCorrectlyMock,
                                    averageScoreForQuestion: averageScoreForQMock,
                                    answerOptionStatistics: answerOptionStats,
                                };
                            }),
                        };
                        setTestStatistics(mockStats);
                    } else {
                        setTestStatistics(data);
                    }
                    setIsLoadingStats(false);
                }
            );
        },
        [auth.accessToken, logout, selectedAttemptStatuses]
    );

    useEffect(() => {
        fetchSelectableTests();
    }, [fetchSelectableTests]);

    useEffect(() => {
        if (selectedTestId) {
            fetchTestStatistics(selectedTestId);
        } else {
            setTestStatistics(null);
        }
    }, [selectedTestId, fetchTestStatistics]);

    const renderOverallStats = () => {
        if (!testStatistics) return null;

        const { testName, totalConsideredAttempts, averageScore } = testStatistics;
        return (
            <Card className="mb-6 dark:bg-slate-800 border dark:border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center dark:text-slate-100">
                        <BarChart3 className="mr-2 h-6 w-6 text-sky-600 dark:text-sky-500" />
                        Overall Statistics for: {testName}
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                        Summary based on {selectedAttemptStatuses.join(', ')} attempts.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                        <Users className="h-5 w-5 mr-3 text-sky-500" />
                        <div>
                            <p className="font-semibold dark:text-slate-200">
                                Total Considered Attempts
                            </p>
                            <p className="text-lg font-bold text-sky-600 dark:text-sky-400">
                                {totalConsideredAttempts}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                        <Percent className="h-5 w-5 mr-3 text-green-500" />
                        <div>
                            <p className="font-semibold dark:text-slate-200">Average Score</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                {averageScore !== null && averageScore !== undefined
                                    ? `${averageScore.toFixed(1)}%`
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderQuestionStats = () => {
        if (
            !testStatistics ||
            !testStatistics.questionStatistics ||
            testStatistics.questionStatistics.length === 0
        ) {
            return (
                <Card className="dark:bg-slate-800 border dark:border-slate-700/50">
                    <CardContent className="p-6 text-center text-slate-500 dark:text-slate-400">
                        <BookOpenText className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-3" />
                        <p>
                            No detailed question statistics available for this test with the current
                            filters.
                        </p>
                        {selectedTestId && !isLoadingStats && (
                            <p className="text-xs mt-1">
                                This might mean no attempts match the selected statuses or data is
                                still processing.
                            </p>
                        )}
                    </CardContent>
                </Card>
            );
        }

        return testStatistics.questionStatistics.map((qStat, index) => (
            <Card
                key={qStat.originalQuestionId || index}
                className="mb-4 dark:bg-slate-800 border dark:border-slate-700/50"
            >
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-start dark:text-slate-100">
                        <span className="mr-2 text-sky-600 dark:text-sky-500 text-base">
                            Q{index + 1}.
                        </span>
                        <span className="flex-1">{qStat.questionTextSnapshot}</span>
                    </CardTitle>
                    <CardDescription className="text-xs dark:text-slate-400">
                        Original Question ID: {qStat.originalQuestionId}
                    </CardDescription>
                    {qStat.questionFormatAndCodeSnapshot && (
                        <CodeDisplay
                            formatAndCode={qStat.questionFormatAndCodeSnapshot}
                            title="Question Code Snippet"
                        />
                    )}
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <p className="dark:text-slate-300">
                            <strong className="font-medium">Answered:</strong>{' '}
                            {qStat.totalTimesAnsweredInConsideredTests} times
                        </p>
                        <p className="dark:text-slate-300">
                            <strong className="font-medium">Correctly:</strong>{' '}
                            {qStat.timesAnsweredCorrectly} times
                        </p>
                        <p className="dark:text-slate-300">
                            <strong className="font-medium">Avg. Score:</strong>{' '}
                            {qStat.averageScoreForQuestion !== null
                                ? `${qStat.averageScoreForQuestion.toFixed(1)}%`
                                : 'N/A'}
                        </p>
                    </div>
                    <Separator className="my-3 dark:bg-slate-700" />
                    <h4 className="text-sm font-semibold mb-1 dark:text-slate-200">
                        Answer Options Statistics:
                    </h4>
                    {qStat.answerOptionStatistics && qStat.answerOptionStatistics.length > 0 ? (
                        <ul className="space-y-2">
                            {qStat.answerOptionStatistics.map(optStat => {
                                const percentageSelected =
                                    qStat.totalTimesAnsweredInConsideredTests > 0
                                        ? (optStat.timesSelected /
                                              qStat.totalTimesAnsweredInConsideredTests) *
                                          100
                                        : 0;
                                return (
                                    <li
                                        key={optStat.answerId || optStat.originalVariantId}
                                        className="p-2 border dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-700/30"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span
                                                className={cn(
                                                    'font-medium break-all',
                                                    optStat.isCorrectOption
                                                        ? 'text-green-700 dark:text-green-400'
                                                        : 'dark:text-slate-200'
                                                )}
                                            >
                                                {optStat.answerText}
                                            </span>
                                            <Badge
                                                variant={
                                                    optStat.isCorrectOption
                                                        ? 'secondary'
                                                        : 'outline'
                                                }
                                                className={cn(
                                                    optStat.isCorrectOption
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300 border-green-300 dark:border-green-700'
                                                        : 'dark:border-slate-600 dark:text-slate-300'
                                                )}
                                            >
                                                {optStat.isCorrectOption ? (
                                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                                ) : (
                                                    <XCircle className="mr-1 h-3 w-3" />
                                                )}
                                                {optStat.isCorrectOption ? 'Correct' : 'Incorrect'}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                            Times Selected: {optStat.timesSelected} (
                                            {percentageSelected.toFixed(1)}%)
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                                            <div
                                                className={cn(
                                                    'h-1.5 rounded-full',
                                                    optStat.isCorrectOption
                                                        ? 'bg-green-500'
                                                        : 'bg-sky-500'
                                                )}
                                                style={{ width: `${percentageSelected}%` }}
                                            ></div>
                                        </div>
                                        {optStat.answerCode && (
                                            <CodeDisplay
                                                formatAndCode={optStat.answerCode}
                                                title="Original Variant Code"
                                            />
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="italic text-slate-500 dark:text-slate-400">
                            No answer option data for this question.
                        </p>
                    )}
                </CardContent>
            </Card>
        ));
    };

    return (
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
            <Card className="mb-6 shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center dark:text-slate-100">
                        <PieChart className="mr-3 h-7 w-7 text-sky-600 dark:text-sky-500" />
                        Test Performance Statistics
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                        Select a test and filter attempt statuses to view detailed statistics.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label
                                htmlFor="test-select"
                                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                                Select Test:
                            </Label>
                            <Select
                                value={selectedTestId}
                                onValueChange={setSelectedTestId}
                                disabled={isLoadingTests || selectableTests.length === 0}
                            >
                                <SelectTrigger
                                    id="test-select"
                                    className="w-full mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                                >
                                    <SelectValue
                                        placeholder={
                                            isLoadingTests ? 'Loading tests...' : 'Select a test'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                                    {isLoadingTests ? (
                                        <SelectItem value="loading" disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : selectableTests.length === 0 ? (
                                        <SelectItem value="no-tests" disabled>
                                            No tests available for statistics.
                                        </SelectItem>
                                    ) : (
                                        selectableTests.map(test => (
                                            <SelectItem key={test.id} value={test.id}>
                                                {test.name} ({test.status}) - Created:{' '}
                                                {new Date(test.createdAt).toLocaleDateString()}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* --- START: Attempt Status Filter UI --- */}
                        <div>
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                                Filter Attempt Statuses:
                            </Label>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 p-2 border dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-700/30">
                                {attemptStatusFilterOptions.map(option => (
                                    <div key={option.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`status-${option.id}`}
                                            checked={selectedAttemptStatuses.includes(option.id)}
                                            onCheckedChange={() =>
                                                handleAttemptStatusChange(option.id)
                                            }
                                            className="dark:border-slate-500 data-[state=checked]:bg-sky-600 dark:data-[state=checked]:bg-sky-500 dark:data-[state=checked]:text-slate-50"
                                        />
                                        <Label
                                            htmlFor={`status-${option.id}`}
                                            className="text-xs font-normal text-slate-700 dark:text-slate-300 cursor-pointer"
                                        >
                                            {option.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* --- END: Attempt Status Filter UI --- */}
                    </div>

                    {error && (
                        <div className="my-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md text-red-700 dark:text-red-300 text-sm flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" /> {error}
                        </div>
                    )}

                    {isLoadingStats && <Loading message="Loading statistics..." />}

                    {!isLoadingStats && selectedTestId && !testStatistics && !error && (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                            <Activity className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-3" />
                            <p>No statistics data found for the selected test and filters.</p>
                        </div>
                    )}

                    {!isLoadingStats && testStatistics && (
                        <div className="space-y-6 mt-4">
                            {renderOverallStats()}
                            <Separator className="dark:bg-slate-700" />
                            <div>
                                <h3 className="text-xl font-semibold mb-3 flex items-center dark:text-slate-100">
                                    <BookOpenText className="mr-2 h-5 w-5 text-sky-600 dark:text-sky-500" />
                                    Per-Question Breakdown
                                </h3>
                                <ScrollArea className="h-[60vh] pr-3">
                                    {renderQuestionStats()}
                                </ScrollArea>
                            </div>
                        </div>
                    )}
                    {!selectedTestId && !isLoadingTests && !isLoadingStats && (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                            <TrendingUp className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-3" />
                            <p>
                                Please select a test from the dropdown above to view its statistics.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
