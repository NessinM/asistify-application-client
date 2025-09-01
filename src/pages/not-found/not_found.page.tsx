import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/registry/default/ui/button';
import { ChevronRight } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const goToPage = (page: string) => () => {
    navigate(page);
  };

  return (
    <div className="h-full w-full flex  items-center justify-center dark:text-white flex-col">
      <div className="max-w-md w-full  text-center">
        <div className="mb-8">
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Page not found</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sorry, we couldn't find this person you're looking for.
          </p>
        </div>
        <div className="mt-8">
          <Button onClick={goToPage('/')}>
            <ChevronRight></ChevronRight>
            Go back home
          </Button>
        </div>
      </div>
      <div className="mt-8 w-full max-w-2xl">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300 dark:border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-gray-100 dark:bg-border text-sm text-gray-500 dark:text-gray-400">
              If you think this is a mistake, please contact support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
