import { Header } from "@/components/organisms/header";
import { Sidebar } from "@/components/organisms/sidebar";
import { SearchBar } from "@/components/molecules/search-bar";
import { CardPlaceholder } from "@/components/atoms/card-placeholder";
import { MainLayout } from "@/components/templates/main-layout";

const NAV_ITEMS = [
  { label: "Cartas", href: "/cards" },
  { label: "Mazos",  href: "#" },
  { label: "Colección", href: "#" },
];

export default function Home() {
  return (
    <MainLayout
      header={<Header navItems={NAV_ITEMS} />}
      sidebar={<Sidebar />}
    >
      <div
        className="px-6 py-4 shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <SearchBar />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <CardPlaceholder key={i} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
