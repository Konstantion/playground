import { Card, CardContent, CardHeader } from '@/components/ui/card.js';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel.js';
import Header from '@/components/Header.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.js';
import { Label } from '@/components/ui/label.js';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.js';
import { I32RangeConfigurator } from '@/components/placeholder/I32RangeConfigurator.jsx';
import { Button } from '@/components/ui/button.js';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.js';

export function StatisticsPage() {
    const correct = ['correct code 1', 'correct code 2'];
    return (
        <>
            <Header />
            <div
                className="grid grid-cols-[2fr_2fr_3fr_3fr] grid-rows-2 gap-4 w-full min-h-screen
        p-4
        "
            >
                <Card className="col-span-2">
                    <CardHeader>Question</CardHeader>
                </Card>
                <Card>
                    <CardHeader>Correct Variants</CardHeader>
                    <CardContent className="flex justify-center">
                        <Carousel className="w-7/10 h-7/10">
                            <CarouselContent>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1">
                                            <Card>
                                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                                    <span className="text-4xl font-semibold">
                                                        {index + 1}
                                                    </span>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>Incorrect Variants</CardHeader>
                </Card>
                <Card>
                    <CardHeader>Placeholders Configuration</CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Add</TabsTrigger>
                                <TabsTrigger value="register">Remove</TabsTrigger>
                            </TabsList>

                            <ScrollArea>
                                <Label>PlaceholderDefinition</Label>
                                <Select className="space-y-2">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a fruit" />{' '}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={'1'}>
                                            <div className="flex items-center">
                                                <span>Placeholder 1</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value={'2'}>
                                            <div className="flex items-center">
                                                <span>Placeholder 2</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Label>PlaceholderIdentifier</Label>
                                <Select className="space-y-2">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a fruit" />{' '}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={'1'}>
                                            <div className="flex items-center">
                                                <span>Identifier 1</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value={'2'}>
                                            <div className="flex items-center">
                                                <span>Identifier 2</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Label>Placeholder Configuration</Label>
                                <I32RangeConfigurator />
                                <Button>Add</Button>
                            </ScrollArea>
                        </Tabs>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>Add call args</CardHeader>
                </Card>
                <Card className="col-span-2">
                    <CardHeader>Add variant</CardHeader>
                </Card>
            </div>
        </>
    );
}
