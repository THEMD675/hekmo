"use client";

import { RotateCcw, Settings2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface ModelParameters {
  temperature: number;
  maxTokens: number;
  topP: number;
}

const DEFAULT_PARAMS: ModelParameters = {
  temperature: 0.7,
  maxTokens: 4096,
  topP: 1,
};

interface ModelParametersProps {
  parameters: ModelParameters;
  onChange: (params: ModelParameters) => void;
  className?: string;
}

export function ModelParametersControl({
  parameters,
  onChange,
  className,
}: ModelParametersProps) {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    onChange(DEFAULT_PARAMS);
  };

  const isModified =
    parameters.temperature !== DEFAULT_PARAMS.temperature ||
    parameters.maxTokens !== DEFAULT_PARAMS.maxTokens ||
    parameters.topP !== DEFAULT_PARAMS.topP;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn("gap-2 relative", className)}
          size="sm"
          variant="ghost"
        >
          <Settings2 className="h-4 w-4" />
          {isModified && (
            <span className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">إعدادات النموذج</h4>
          <Button
            className="h-8 px-2 text-xs"
            onClick={handleReset}
            size="sm"
            variant="ghost"
          >
            <RotateCcw className="h-3 w-3 ml-1" />
            إعادة تعيين
          </Button>
        </div>

        <div className="space-y-6">
          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                الحرارة (Temperature)
              </label>
              <span className="text-sm text-muted-foreground">
                {parameters.temperature.toFixed(2)}
              </span>
            </div>
            <Slider
              max={2}
              min={0}
              onValueChange={([value]) =>
                onChange({ ...parameters, temperature: value })
              }
              step={0.1}
              value={[parameters.temperature]}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              قيمة أعلى = ردود أكثر إبداعية. قيمة أقل = ردود أكثر تركيزاً.
            </p>
          </div>

          {/* Max Tokens */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">الحد الأقصى للرموز</label>
              <span className="text-sm text-muted-foreground">
                {parameters.maxTokens}
              </span>
            </div>
            <Slider
              max={8192}
              min={256}
              onValueChange={([value]) =>
                onChange({ ...parameters, maxTokens: value })
              }
              step={256}
              value={[parameters.maxTokens]}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              الحد الأقصى لطول الرد.
            </p>
          </div>

          {/* Top P */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Top P</label>
              <span className="text-sm text-muted-foreground">
                {parameters.topP.toFixed(2)}
              </span>
            </div>
            <Slider
              max={1}
              min={0}
              onValueChange={([value]) =>
                onChange({ ...parameters, topP: value })
              }
              step={0.05}
              value={[parameters.topP]}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              التحكم في تنوع الردود.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Hook for managing model parameters
export function useModelParameters() {
  const [parameters, setParameters] = useState<ModelParameters>(DEFAULT_PARAMS);

  return {
    parameters,
    setParameters,
    resetParameters: () => setParameters(DEFAULT_PARAMS),
  };
}
