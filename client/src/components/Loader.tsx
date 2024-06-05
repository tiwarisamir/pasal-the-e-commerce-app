const Loader = () => {
  return <div>Loading...</div>;
};

export const Skeleton = ({
  width = "unset",
  length = 3,
}: {
  width?: string;
  length?: number;
}) => {
  const skeletons = Array.from({ length }, (_, idx) => (
    <div key={idx} className="skeleton-shape"></div>
  ));
  return (
    <div className="skeleton-loader" style={{ width }}>
      {skeletons}
    </div>
  );
};

export default Loader;
