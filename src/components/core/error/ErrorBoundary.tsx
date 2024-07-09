import { ErrorBoundary as NextErrorBoundary } from 'next/dist/client/components/error-boundary';
import { ReactNode } from 'react';

// const resetAppState = () => {
//   window.location.reload();
// };

type ErrorComponentPropr = {
  error: Error;
  reset: () => void;
};

type Props = {
  children: ReactNode;
};

export const ErrorBoundary = ({ children }: Props) => {
  return <NextErrorBoundary errorComponent={ErrorComponent}>{children}</NextErrorBoundary>;
};

const ErrorComponent = ({ error, reset }: ErrorComponentPropr) => {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <img src="/images/warning.svg" alt="error" className="m-auto" />
        <h1 className="m-auto font-bold text-xl text-center py-4">{error.message}</h1>
        <h3 className="m-auto text-gray-400 text-sm text-center py-2">
          Try refreshing the page and if it doesn&#39;t solve the issue, please email us at{' '}
          <a href="mailto:dev.muhammadshafi@gmail.com" className="text-blue-500">
            dev.muhammadshafi@gmail.com
          </a>
        </h3>
        <button
          className="m-auto flex rounded-md bg-blue-500 border border-transparent shadow-sm text-base font-medium text-white focus:outline-none px-6 py-2 mt-5"
          onClick={reset}
        >
          Reload
        </button>
      </div>
    </div>
  );
};
