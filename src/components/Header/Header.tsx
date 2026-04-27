import HeaderLogo from "./HeaderLogo";
import HeaderSearch from "./HeaderSearch";
import HeaderMenu from "./HeaderMenu";
import HeaderIcons from "./HeaderIcons";

export default function Header() {
  return (
    <header
      className="bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/header.jpg')" }}
    >
      <div className="bg-black/50 p-6">
        <div className="flex justify-between items-center p-5">
          <div className="flex flex-col items-end">
            <HeaderSearch />
            <HeaderMenu />
          </div>

          <HeaderLogo />

          <HeaderIcons />
        </div>
      </div>
    </header>
  );
}
