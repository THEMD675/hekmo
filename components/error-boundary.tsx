"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
         
        >
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">حدث خطأ غير متوقع</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو تحديث الصفحة.
          </p>
          <div className="flex gap-3">
            <Button onClick={this.handleRetry}>
              <RefreshCw className="h-4 w-4 ml-2" />
              إعادة المحاولة
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              تحديث الصفحة
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-6 text-right w-full max-w-lg">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                تفاصيل الخطأ (للمطورين)
              </summary>
              <pre
                className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto"
                dir="ltr"
              >
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Error message component for inline errors
export function ErrorMessage({
  title,
  message,
  retry,
}: {
  title?: string;
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/10">
      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="font-medium text-destructive">{title}</p>}
        <p className="text-sm text-muted-foreground">{message}</p>
        {retry && (
          <Button className="mt-2" onClick={retry} size="sm" variant="outline">
            إعادة المحاولة
          </Button>
        )}
      </div>
    </div>
  );
}
