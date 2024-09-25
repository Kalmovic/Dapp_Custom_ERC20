export function TextShimmer(props: { width: string }) {
  return (
    <div
      className="animate-pulse bg-gray-200 rounded-lg h-6 w-full"
      style={{ width: props.width }}
    ></div>
  );
}
