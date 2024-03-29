import { toast } from '@/ui/hooks/use-toast';
import { type Address } from 'viem';
import { useSwitchChain, useReadContract, useWriteContract, useAccount } from 'wagmi';
import { useConnectedChain } from './use-connected-chain';
import type { EvmTeleporterChain } from '@/constants/chains';

const MAXIMUM_ALLOWANCE = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

export const useResetAllowance = ({
  chain,
  tokenAddress,
  addressToReset,
}: {
  chain: EvmTeleporterChain;
  tokenAddress: Address;
  addressToReset: Address;
}) => {
  const { connectedChain } = useConnectedChain();
  const { switchChainAsync } = useSwitchChain();

  const { address } = useAccount();
  const { data: allowance } = useReadContract({
    address: chain?.contracts.teleportedErc20.address,
    functionName: 'allowance',
    abi: chain?.contracts.teleportedErc20.abi,
    args: address && chain ? [address, chain?.contracts.bridge.address] : undefined,
    query: {
      enabled: false, // Disable auto-fetch since we fetch manually right before teleporting.
    },
    chainId: Number(chain?.chainId),
  });

  const { writeContractAsync } = useWriteContract();

  return {
    resetAllownce: async () => {
      try {
        if (!chain) {
          throw new Error('Missing source subnet.');
        }

        if (connectedChain?.chainId !== chain.chainId) {
          const chainSwitchRes = await switchChainAsync({
            chainId: Number(chain.chainId),
          });
          if (String(chainSwitchRes.id) !== chain.chainId) {
            throw new Error(`Must be connected to ${chain.name}.`);
          }
        }

        const resetAllowanceResponse = await writeContractAsync({
          address: tokenAddress,
          functionName: 'decreaseAllowance',
          abi: chain?.contracts.teleportedErc20.abi,
          args: [addressToReset, allowance ? allowance : MAXIMUM_ALLOWANCE],
          chainId: Number(chain?.chainId),
        });
        console.info('Successfully reset allowance.', resetAllowanceResponse);
        toast({
          title: 'Success',
          description: `Allowance reset successful!`,
        });
        return resetAllowanceResponse;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.warn(e?.message ?? e);

        return undefined;
      }
    },
  };
};
