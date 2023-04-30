import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import "formdata-submitter-polyfill";

hydrateRoot(document, <RemixBrowser />);
