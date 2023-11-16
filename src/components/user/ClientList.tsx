import { List, Image } from "antd";
import { IAccount } from "../../types";

interface FilterOptions {
  type: string[];
  status: string[];
}

interface ClientListProps {
  accountList: IAccount[];
  filterOptions: FilterOptions;
  onOpenClientDetailModal: (item: IAccount) => void;
}

const ClientList: React.FC<ClientListProps> = ({
  accountList,
  filterOptions,
  onOpenClientDetailModal,
}) => {
  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "standard":
        return "bg-teal-100";
      case "premium":
        return "bg-pink-100";
      default:
        return "bg-white";
    }
  };

  const filteredAccounts = accountList.filter((account) => {
    const statusFilterMatch =
      filterOptions.status.length === 0 ||
      filterOptions.status
        .map((type) => type.toLowerCase())
        .includes(account.accountCurrentStatus);

    const typeFilterMatch =
      filterOptions.type.length === 0 ||
      filterOptions.type
        .map((type) => type.toLowerCase())
        .includes(account.accountType);

    return statusFilterMatch && typeFilterMatch;
  });

  return (
    <>
      <List
        dataSource={filteredAccounts}
        itemLayout="horizontal"
        renderItem={(item: IAccount) => (
          <List.Item
            className={`relative flex flex-col my-3 h-full min-w-0 break-words border-0 shadow-xl dark:shadow-dark-xl rounded-2xl bg-clip-border cursor-pointer ${getBackgroundColor(
              item.accountType,
            )}`}
            onClick={() => onOpenClientDetailModal(item)}
            // actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
          >
            <div className="w-full pb-0 border-black/12.5 rounded-t-2xl border-b-0 border-solid p-3 flex items-center justify-center gap-3">
              <div className="flex gap-3 items-center">
                <Image
                  src={item.accountCompany?.companyLogoUrl}
                  preview={false}
                  width={80}
                />
                <p className="font-bold text-center">
                  {item.accountCompany?.companyName}
                </p>
              </div>
              <div className="">
                <span className="py-1.5 px-2.5 text-xs w-40 rounded-1.8 inline-block bg-blue-100 text-center align-baseline font-bold uppercase leading-none text-blue-600">
                  {item.accountCurrentStatus}
                </span>
              </div>
            </div>
          </List.Item>
        )}
      />
    </>
  );
};
export default ClientList;
