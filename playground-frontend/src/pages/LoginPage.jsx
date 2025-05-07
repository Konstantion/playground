import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.js';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.js';
import { preventAndAsync } from '@/utils/Misc.js';
import { sCp, sEq } from '@/utils/ObjectUtils.js';
import { between, contains, substrs } from '@/utils/Strings.js';
import { fetchJwt, register } from '@/utils/AuthUtils.js';
import { RHome } from '@/rout/Routes.jsx';
import { toast } from 'sonner';
import { ErrorType } from '@/utils/ErrorType.js';
import { TestsPage } from '@/pages/Pages.js';
import { LockKeyhole, UserPlus } from 'lucide-react';

const Mode = Object.freeze({
    Login: 'login',
    Register: 'register',
});

const Role = Object.freeze({
    Teacher: 'Teacher',
    Student: 'Student',
});

const IInput = Object.freeze({
    username: '',
    email: '',
    role: Role.Student,
    password: '',
    confirmPassword: '',
});

const Errors = Object.freeze({
    username: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
});

const validate = (input, mode) => {
    const errors = sCp(Errors);

    if (!between(input.username, 6, 20)) {
        errors.username = 'Username must be 6-20 characters.';
    } else {
        errors.username = '';
    }

    if (!between(input.password, 6, 20)) {
        errors.password = 'Password must be 6-20 characters.';
    } else {
        errors.password = '';
    }

    if (mode === Mode.Register) {
        if (!between(input.email, 6, 40) || !contains(input.email, '@')) {
            errors.email = 'Enter a valid email (6-40 characters).';
        } else {
            errors.email = '';
        }

        if (input.role === Role.Student || input.role === Role.Teacher) {
            errors.role = '';
        } else {
            errors.role = 'Please select a role.';
        }

        if (input.password !== input.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        } else {
            errors.confirmPassword = '';
        }
    }

    return { errors: errors, valid: sEq(errors, Errors) };
};

export default function LoginPage() {
    const [mode, setMode] = useState(Mode.Login);
    const [input, setInput] = useState(sCp(IInput));
    const [error, setError] = useState(sCp(Errors));
    const [isLoading, setIsLoading] = useState(false);

    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const setter = key => e => {
        setInput(prev => ({
            ...prev,
            [key]: e.target.value,
        }));

        if (error[key]) {
            setError(prev => ({ ...prev, [key]: '' }));
        }
    };

    const setRole = value => {
        setInput(prev => ({ ...prev, role: value }));
        if (error.role) {
            setError(prev => ({ ...prev, role: '' }));
        }
    };

    const handleSubmit = preventAndAsync(async () => {
        setIsLoading(true);
        const { errors, valid } = validate(input, mode);
        setError(errors);

        if (!valid) {
            toast.error('Please correct the errors in the form.', {
                closeButton: true,
                duration: 3000,
            });
            setIsLoading(false);
            return;
        }

        if (mode === Mode.Login) {
            await fetchJwt(
                input.username,
                input.password,
                userAndToken => {
                    login(userAndToken);
                    toast.success(`Welcome back, ${userAndToken.user.username}!`, {
                        duration: 2000,
                    });
                    navigate(`${RHome}/${TestsPage}`);
                },
                (type, message) => {
                    if (type === ErrorType.TokenExpired) {
                        logout();
                    }
                    toast.error(
                        substrs(message, 150) || 'Login failed. Please check your credentials.',
                        { closeButton: true }
                    );
                    setInput(prev => ({ ...prev, password: '' }));
                    setError(sCp(Errors));
                }
            );
        }

        if (mode === Mode.Register) {
            await register(
                input.username,
                input.password,
                input.role,
                () => {
                    toast.success('Registration successful! Please log in.', {
                        closeButton: true,
                        duration: 3000,
                    });
                    setMode(Mode.Login);
                    setInput(sCp(IInput));
                    setError(sCp(Errors));
                },
                (type, message) => {
                    toast.error(substrs(message, 150) || 'Registration failed. Please try again.', {
                        closeButton: true,
                    });
                }
            );
        }
        setIsLoading(false);
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-900 p-4 selection:bg-sky-500 selection:text-white">
            <Card className="w-full max-w-md shadow-2xl rounded-xl dark:bg-slate-800">
                <CardHeader className="text-center pt-8 pb-4">
                    <div className="inline-flex items-center justify-center bg-sky-500 text-white p-3 rounded-full mb-4">
                        {mode === Mode.Login ? <LockKeyhole size={32} /> : <UserPlus size={32} />}
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                        {mode === Mode.Login ? 'Welcome Back!' : 'Create Account'}
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 pt-1">
                        {mode === Mode.Login
                            ? 'Sign in to access your dashboard.'
                            : 'Fill in the details to join us.'}
                    </CardDescription>
                </CardHeader>

                <Tabs
                    defaultValue={Mode.Login}
                    value={mode}
                    onValueChange={setMode}
                    className="w-full px-2 pb-2"
                >
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-200 dark:bg-slate-700 rounded-lg">
                        <TabsTrigger
                            value={Mode.Login}
                            className="py-2.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-950 data-[state=active]:shadow-md data-[state=active]:text-sky-600 rounded-md"
                        >
                            Login
                        </TabsTrigger>
                        <TabsTrigger
                            value={Mode.Register}
                            className="py-2.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-950 data-[state=active]:shadow-md data-[state=active]:text-sky-600 rounded-md"
                        >
                            Register
                        </TabsTrigger>
                    </TabsList>

                    <CardContent className="space-y-6">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Email input for registration */}
                            {mode === Mode.Register && (
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Email Address
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={input.email}
                                        onChange={setter('email')}
                                        maxLength={40}
                                        className={`dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500 ${error.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
                                        aria-invalid={!!error.email}
                                        aria-describedby="email-error"
                                    />
                                    {error.email && (
                                        <span
                                            id="email-error"
                                            className="text-xs text-red-500 dark:text-red-400"
                                        >
                                            {error.email}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Role selection for registration */}
                            {mode === Mode.Register && (
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="role"
                                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        I am a...
                                    </label>
                                    <Select
                                        onValueChange={setRole}
                                        defaultValue={input.role}
                                        value={input.role}
                                    >
                                        <SelectTrigger
                                            id="role"
                                            className={`w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500 ${error.role ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
                                            aria-invalid={!!error.role}
                                            aria-describedby="role-error"
                                        >
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-slate-700 dark:text-slate-200">
                                            <SelectItem value={Role.Student}>Student</SelectItem>
                                            <SelectItem value={Role.Teacher}>Teacher</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {error.role && (
                                        <span
                                            id="role-error"
                                            className="text-xs text-red-500 dark:text-red-400"
                                        >
                                            {error.role}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Username input */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Username
                                </label>
                                <Input
                                    id="username"
                                    placeholder="Your unique username"
                                    value={input.username}
                                    onChange={setter('username')}
                                    maxLength={20}
                                    className={`dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500 ${error.username ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
                                    aria-invalid={!!error.username}
                                    aria-describedby="username-error"
                                />
                                {error.username && (
                                    <span
                                        id="username-error"
                                        className="text-xs text-red-500 dark:text-red-400"
                                    >
                                        {error.username}
                                    </span>
                                )}
                            </div>

                            {/* Password input */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={input.password}
                                    onChange={setter('password')}
                                    maxLength={20}
                                    minLength={6}
                                    className={`dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500 ${error.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
                                    aria-invalid={!!error.password}
                                    aria-describedby="password-error"
                                />
                                {error.password && (
                                    <span
                                        id="password-error"
                                        className="text-xs text-red-500 dark:text-red-400"
                                    >
                                        {error.password}
                                    </span>
                                )}
                            </div>

                            {/* Confirm password input for registration */}
                            {mode === Mode.Register && (
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Confirm Password
                                    </label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Re-enter your password"
                                        value={input.confirmPassword}
                                        onChange={setter('confirmPassword')}
                                        maxLength={20}
                                        minLength={6}
                                        className={`dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500 ${error.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
                                        aria-invalid={!!error.confirmPassword}
                                        aria-describedby="confirm-password-error"
                                    />
                                    {error.confirmPassword && (
                                        <span
                                            id="confirm-password-error"
                                            className="text-xs text-red-500 dark:text-red-400"
                                        >
                                            {error.confirmPassword}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Submit button */}
                            <Button
                                type="submit"
                                className="w-full mt-6 py-3 text-base bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out disabled:opacity-70"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Processing...
                                    </div>
                                ) : mode === Mode.Login ? (
                                    'Login'
                                ) : (
                                    'Register'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Tabs>
            </Card>
        </div>
    );
}
