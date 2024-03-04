import type { EvmTeleporterChain } from '@/constants/chains';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Suspense, memo, useState } from 'react';
import { Button } from '@/ui/button';

import { BridgeForm } from './bridge-form';
import { Skeleton } from '@/ui/skeleton';
import { FromToChain } from './from-to-chain';

export const ActiveBridgeCard = memo(
  ({ fromChain, toChain }: { fromChain: EvmTeleporterChain; toChain: EvmTeleporterChain }) => {
    const [isTeleporting, setIsTeleporting] = useState(false);

    return (
      <Card>
        <CardHeader>
          <CardTitle>{isTeleporting ? 'Bridging...' : 'Bridge Tokens'} </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Suspense
            fallback={
              <div className="flex flex-col gap-6">
                <FromToChain
                  fromChain={fromChain}
                  toChain={toChain}
                />
                <Skeleton className="w-full h-16" />
                <Button
                  className="w-full"
                  disabled
                >
                  Bridge
                </Button>
              </div>
            }
          >
            <BridgeForm
              fromChain={fromChain}
              toChain={toChain}
              isTeleporting={isTeleporting}
              setIsTeleporting={setIsTeleporting}
            />
          </Suspense>
        </CardContent>
      </Card>
    );
  },
);
ActiveBridgeCard.displayName = 'ActiveBridgeCard';