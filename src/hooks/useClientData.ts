import { useEffect, useState } from 'react';
import { useGetClientQuery } from '../redux/api/apiSlice';
import { IClient } from '../types';

export const useClientData = (uniqueAccountIds: number[]) => {
  const [clientList, setClientList] = useState<IClient[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      for (const accountId of uniqueAccountIds) {
        const { data: client, isLoading } = await useGetClientQuery(accountId);

        if (!isLoading) {
          setClientList((prevList) => [...prevList, client]);
        }
      }
    };

    if (uniqueAccountIds.length > 0) {
      fetchData();
    }
  }, [uniqueAccountIds]);

  return clientList;
};
