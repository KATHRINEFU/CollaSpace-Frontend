interface Props {
  message?: string;
}

export default function ErrorFallback({ message }: Props) {
  return (
    <div className="flex items-center justify-center relative mx-auto overflow-hidden min-h-screen min-w-screen bg-gray-50">
      <div className="flex-1 px-6 py-8 hmx-auto md:-screen lg:py-0 ml-12 !-mt-36">
        <p className="text-2xl text-black mt-36">
          Heyy! Something went wrong...
        </p>
        <p className="text-base text-black mt-6">
          Check the error message here:{" "}
        </p>
        <p className="text-base text-black mt-6">{message}</p>
      </div>
    </div>
  );
}
