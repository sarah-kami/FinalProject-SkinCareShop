export default function HeaderIcons() {
  return (
    <div className="flex gap-4 items-center">
      <img
        src="/admin.svg"
        alt="user"
        className="w-10 h-9 cursor-pointer"
      />

      <img
        src="/shopcard.svg"
        alt="cart"
        className="w-10 h-9 cursor-pointer"
      />
    </div>
  );
}