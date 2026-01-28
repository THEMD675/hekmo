export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-muted-foreground/20 border-t-primary animate-spin mx-auto" />
        </div>
        <p className="text-muted-foreground animate-pulse">جاري التحميل...</p>
      </div>
    </div>
  );
}
