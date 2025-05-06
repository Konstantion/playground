import {useAuth} from '../hooks/useAuth.jsx';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button.js';
import {Input} from '@/components/ui/input.js';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs.js';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select.js';
import {preventAndAsync} from '@/utils/Misc.js';
import {sCp, sEq} from '@/utils/ObjectUtils.js';
import {between, contains, substrs} from '@/utils/Strings.js';
import {fetchJwt, register} from '@/utils/AuthUtils.js';
import {RHome} from '@/rout/Routes.jsx';
import {toast} from 'sonner';
import {ErrorType} from '@/utils/ErrorType.js';
import {TestsPage} from '@/pages/Pages.js';

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
        errors.username = 'Username must be between 6 and 20 characters';
    } else {
        errors.username = '';
    }

    if (!between(input.password, 6, 20)) {
        errors.password = 'Password must be between 6 and 20 characters';
    } else {
        errors.password = '';
    }

    if (mode === Mode.Register) {
        if (!between(input.email, 6, 40) || !contains(input.email, '@')) {
            errors.email = 'Email must be between 6 and 40 characters and contain @';
        } else {
            errors.email = '';
        }

        if (input.role === Role.Student || input.role === Role.Teacher) {
            errors.role = '';
        } else {
            errors.role = 'Select a role';
        }

        if (input.password !== input.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        } else {
            errors.confirmPassword = '';
        }
    }

    return {errors: errors, valid: sEq(errors, Errors)};
};

export default function LoginPage() {
    const [mode, setMode] = useState(Mode.Login);
    const [input, setInput] = useState(sCp(IInput));
    const [error, setError] = useState(sCp(Errors));

    const {login, logout} = useAuth();
    const navigate = useNavigate();

    const setter = key => e => {
        setInput(prev => ({
            ...prev,
            [key]: e.target.value,
        }));
    };

    const handleSubmit = preventAndAsync(async () => {
        const {errors, valid} = validate(input, mode);
        setError(errors);

        if (!valid) {
            toast.error('Please fix the errors in the form', {closeButton: true});
            return;
        }

        if (mode === Mode.Login) {
            await fetchJwt(
                input.username,
                input.password,
                userAndToken => {
                    login(userAndToken);
                    navigate(`${RHome}/${TestsPage}`);
                },
                (type, message) => {
                    if (type === ErrorType.TokenExpired) {
                        logout();
                    }
                    toast.error(`${substrs(message, 150)}`, {closeButton: true});
                    setInput(sCp(IInput));
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
                    toast.success('User registered!');
                    setMode(Mode.Login);
                    setInput(sCp(IInput));
                    setError(sCp(Errors));
                },
                (type, message) => {
                    toast.error(`${substrs(message, 150)}`, {closeButton: true});
                }
            );
        }
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <Tabs defaultValue="login" value={mode} onValueChange={setMode} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <CardContent className="space-y-4 mt-4">
                        <form className="space-y-4">
                            {mode === Mode.Register && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <Input
                                            type="email"
                                            placeholder="example@email.com"
                                            value={input.email}
                                            onChange={setter('email')}
                                            max={40}
                                        />
                                        <span className="text-xs text-red-500">{error.email}</span>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Select Role
                                        </label>
                                        <Select
                                            onValueChange={value => {
                                                setInput({...input, role: value});
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder="Select a role"
                                                    defaultValue={input.role}
                                                    value={input.role}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={Role.Student}>
                                                    Student
                                                </SelectItem>
                                                <SelectItem value={Role.Teacher}>
                                                    Teacher
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span className="text-xs text-gray-500 mt-1 block">
                                            {error.role}
                                        </span>
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <Input
                                    placeholder="Your username"
                                    value={input.username}
                                    onChange={setter('username')}
                                    max={20}
                                />
                                <span className="text-xs text-red-500">{error.username}</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={input.password}
                                    onChange={setter('password')}
                                    max={20}
                                    min={6}
                                />
                                <span className="text-xs text-red-500">{error.password}</span>
                            </div>

                            {mode === Mode.Register && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="Re-enter your password"
                                        value={input.confirmPassword}
                                        onChange={setter('confirmPassword')}
                                        max={20}
                                        min={6}
                                    />
                                    <span className="text-xs text-red-500">
                                        {error.confirmPassword}
                                    </span>
                                </div>
                            )}

                            <Button type="submit" className="w-full mt-2" onClick={handleSubmit}>
                                {mode === Mode.Login ? 'Login' : 'Register'}
                            </Button>
                        </form>
                    </CardContent>
                </Tabs>
            </Card>
        </div>
    );
}
