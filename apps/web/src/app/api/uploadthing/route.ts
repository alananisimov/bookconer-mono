import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "@acme/api/src/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter
});