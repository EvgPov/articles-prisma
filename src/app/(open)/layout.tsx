import SiteShell from "@/components/SiteShell";

export default function OpenLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
