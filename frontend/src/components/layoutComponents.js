import Header from "@/components/header/Header";
import UserHeader from "@/components/header/UserHeader"
//import { AdminHeader } from "@/app/partials/admin-header";
import CreatorHeader from "@/components/header/CreatorHeader";
//import { DefaultFooter } from "@/app/partials/footer";

export default function getHeaderByRole(role) {
  if (!role) return null;

  switch (role) {
    case "USER":
      return <UserHeader />;
    case "ADMIN":
      return <Header />;
    case "CREATOR":
      return <CreatorHeader />;
    default:
      return null;
  }
}
