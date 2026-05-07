import FooterLogo from "./FooterLogo";
import FooterLinks from "./FooterLinks";
import FooterSocial from "./FooterSocial";
import FooterCopyRight from "./FooterCopyRight";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 mr-10 ">
        
        <FooterLogo />
        <FooterLinks />
        <FooterSocial />

      </div>

      <FooterCopyRight />
    </footer>
  );
}