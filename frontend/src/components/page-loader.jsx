export const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-[#1D232A] gap-4">
      <p className="text-lg font-medium text-white">Cargando...</p>
      <span className="loading loading-dots loading-lg text-white"></span>
    </div>
  );
};
