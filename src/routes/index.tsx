import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { Experience } from "@/components/site/Experience";
import { Sections } from "@/components/site/Sections";

const TITLE = "Fiberon IT — Technology. Infrastructure. Security.";
const DESCRIPTION =
  "Fiberon IT engineers enterprise CCTV, network infrastructure and IT systems as one platform — coverage, monitoring, analytics, recording and network designed together.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <SiteNav />
      <Experience />
      <Sections />
    </main>
  );
}
