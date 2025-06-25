export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex flex-col gap-12 items-center justify-center my-auto h-[80vh]">{children}</div>
  );
}
