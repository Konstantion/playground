import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function ClearAllButton() {
    return (
        <Button variant="outline" size="sm" onClick={() => toast.dismiss()}>
            Clear All Toasters
        </Button>
    );
}
