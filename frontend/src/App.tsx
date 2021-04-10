import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Pages } from "./pages";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function Loader() {
  return (
    <div className="container mx-auto h-screen w-full flex justify-center items-center">
      Loading
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <Suspense fallback={<Loader />}>
        <Pages />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
