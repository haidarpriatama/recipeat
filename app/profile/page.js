// Server component wrapper — metadata lives here
import ProfileContent from "./ProfileContent";

export const metadata = {
  title: "Profile – Recipeat",
  description: "Manage your Recipeat profile and account settings.",
};

export default function ProfilePage() {
  return <ProfileContent />;
}
