import { memo } from 'react';

import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuantityProps {
    onChange: (value: number) => void;
    value: number;
}

function Quantity({ onChange, value }: QuantityProps) {
    return (
        <div className="flex gap-1 ">
            <Button
                className="h-6 w-6 p-0"
                disabled={value === 0}
                onClick={() => onChange(value - 1)}
            >
                <Minus className="w-3 h-3" />
            </Button>
            <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="h-6 p-1 w-8 text-center"
                value={value}
                onChange={(e) => {
                    const { value: inputValue } = e.target;
                    const numberValue = Number(inputValue);
                    if (Number.isNaN(numberValue)) {
                        return;
                    }
                    onChange(numberValue);
                }}
            />
            <Button
                className="h-6 w-6 p-0"
                onClick={() => onChange(value + 1)}
            >
                <Plus className="w-3 h-3" />
            </Button>
        </div>
    );
}

export default memo(Quantity);
