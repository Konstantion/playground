import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {useEffect, useState} from 'react';
import {Lang} from '@/entities/Lang';
import {CheckCircle, XCircle} from 'lucide-react';
import {authenticatedReq} from '@/utils/Requester.js';
import {Endpoints} from '@/utils/Endpoints.js';
import {useAuth} from '@/hooks/useAuth.jsx';
import {ErrorType} from '@/utils/ErrorType.js';
import {toast} from 'sonner';
import {useNavigate} from 'react-router-dom';
import {Routes as RRoutes, RQuestions} from '@/rout/Routes.jsx';
import Loading from '@/components/Loading.jsx';
import {between, blank} from "@/utils/Strings.js";

const QuestionsPage = () => {
    const {auth, logout} = useAuth();
    const [questionName, setQuestionName] = useState('');
    const [questionLang, setQuestionLang] = useState(Object.values(Lang)[0]);
    const [search, setSearch] = useState('');
    const [dataItems, setDataItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            await authenticatedReq(
                Endpoints.Questions.Base,
                'GET',
                null,
                auth.accessToken,
                (type, message) => {
                    setLoading(false);
                    toast.error(message, {closeButton: true});
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RRoutes.Login.path);
                    }
                },
                questions => {
                    const converted = questions.map(convert);
                    setDataItems(converted);
                    setLoading(false);
                }
            );
        };

        fetchQuestions();
    }, []);

    const handleCreateQuestion = async () => {
        if (!between(questionName, 1, 50)) {
            toast.error('Question name must be between 1 and 50 characters.', {closeButton: true});
            return;
        } else if (blank(questionLang)) {
            toast.error('Please select a language.', {closeButton: true});
            return;
        }

        await authenticatedReq(
            Endpoints.Questions.Base,
            'POST',
            {body: questionName, lang: questionLang},
            auth.accessToken,
            (type, message) => {
                toast.error(message, {closeButton: true});
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
            },
            question => {
                toast.success('Question created successfully!', {closeButton: true});
                setQuestionName('');
                setDataItems(prev => [...prev, convert(question)]);
            }
        );
    };

    const convert = question => ({
        id: question.id,
        name: question.body,
        validated: question.validated,
        date: new Date(question.createdAt).toLocaleString(),
    });

    const filteredItems = dataItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="border rounded-md p-4 space-y-4 lg:col-span-1">
                <h2 className="text-lg font-semibold mb-2">Create Question</h2>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <label htmlFor="question-name" className="text-sm font-medium">
                            Name
                        </label>
                        <Input
                            id="question-name"
                            value={questionName}
                            onChange={e => setQuestionName(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Language</label>
                        <Select value={questionLang} onValueChange={setQuestionLang}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select language"/>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(Lang).map(lang => (
                                    <SelectItem key={lang} value={lang}>
                                        {lang}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleCreateQuestion}>Create</Button>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
                {loading ? (
                    <Loading/>
                ) : (
                    <>
                        <Input
                            placeholder="Search by name..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full"
                        />
                        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredItems.map((item, idx) => (
                                    <Card
                                        key={idx}
                                        className="w-full"
                                        onClick={() => navigate(`${RQuestions}/${item.id}`)}
                                    >
                                        <CardHeader>
                                            <h3 className="text-sm font-medium">Name</h3>
                                            <p className="text-muted-foreground">{item.name}</p>
                                        </CardHeader>
                                        <CardContent className="space-y-1">
                                            <div>
                                                <p className="text-sm font-medium">Date</p>
                                                <p className="text-muted-foreground">{item.date}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium">Validated</p>
                                                {item.validated ? (
                                                    <CheckCircle className="text-green-500 w-4 h-4"/>
                                                ) : (
                                                    <XCircle className="text-red-500 w-4 h-4"/>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuestionsPage;
