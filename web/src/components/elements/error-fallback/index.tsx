import type { FallbackProps } from "react-error-boundary";

// export const とするとエラーになるので、export function としている
export function ErrorFallback({ error }: FallbackProps) {
  const handleRefresh = () => {
    window.location.assign(window.location.origin);
  };

  return (
    <div>
      <h1>Something went wrong</h1>
      <div>{error.message}</div>
      <button type="button" onClick={handleRefresh}>
        Refresh
      </button>
    </div>
  );
}
