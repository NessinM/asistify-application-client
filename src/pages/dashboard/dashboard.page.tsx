import React from 'react';
import { Chart01 } from '@/components/dashboard/chart-01';
import { Chart02 } from '@/components/dashboard/chart-02';
import { Chart03 } from '@/components/dashboard/chart-03';
import { Chart04 } from '@/components/dashboard/chart-04';
import { Chart05 } from '@/components/dashboard/chart-05';
import { Chart06 } from '@/components/dashboard/chart-06';
import { ActionButtons } from '@/components/dashboard/action-buttons';

const SecurityPage: React.FC = () => {
  return (
    <div className="px-4 md:px-6 lg:px-8 @container">
      <div className="w-full max-w-6xl mx-auto">
        <header className="flex flex-wrap gap-3 min-h-20 py-4 shrink-0 justify-between items-center  border-b">
          {/* Right side */}
          <div className="items-start justify-start md:block flex">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome to your dashboard! Here you can find all the important information at a
              glance.
            </p>
          </div>
          <ActionButtons />
        </header>
        <div className="overflow-hidden">
          <div className="grid auto-rows-min @2xl:grid-cols-2 *:-ms-px *:-mt-px -m-px">
            <Chart01 />
            <Chart02 />
            <Chart03 />
            <Chart04 />
            <Chart05 />
            <Chart06 />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
