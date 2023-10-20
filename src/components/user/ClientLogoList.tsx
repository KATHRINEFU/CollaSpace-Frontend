import { useGetClientQuery } from '../../redux/api/apiSlice';

interface ClientLogoListProps {
  accountIds: number[];
}

interface ClientLogoProps {
  name: string,
  logoUrl: string
}

const ClientLogo: React.FC<ClientLogoProps> = ({ name, logoUrl }) => (
  <div className="w-4/12 text-center flex-0 sm:w-5/12 md:w-4/12 lg:w-2/12">
    <a
      href="javascript:;"
      className="inline-flex items-center justify-center text-sm text-white transition-all duration-200 ease-in-out border border-solid w-14 h-14 rounded-circle"
    >
      <img src={logoUrl} alt="Client Logo" className="w-full p-1 rounded-circle" />
    </a>
    <p className="mb-0 text-sm leading-normal dark:text-white dark:opacity-60">{name}</p>
  </div>
);

const ClientLogoList: React.FC<ClientLogoListProps> = ({ accountIds }) => {
  return (
    <div className="flex flex-auto p-6 gap-9">
      {accountIds.map(accountId => {
        const { data } = useGetClientQuery(accountId);
        // console.log(accountId, data);
        if (!data) {
          return null; // or a loader, placeholder, etc.
        }

        return (
          <ClientLogo 
            key={accountId} 
            name={data.company.companyName} 
            logoUrl={data.company.companyLogoUrl} 
          />
        );
      })}
    </div>
  );
};

export default ClientLogoList;
