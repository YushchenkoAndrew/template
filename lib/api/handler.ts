import { NextApiRequest } from "next";
import { FullResponse } from "../../types/request";

export class Handler {
  postHandler(req: NextApiRequest): Promise<FullResponse> | null {
    return null;
  }
  putHandler(req: NextApiRequest): Promise<FullResponse> | null {
    return null;
  }
  getHandler(req: NextApiRequest): Promise<FullResponse> | null {
    return null;
  }
  deleteHandler(req: NextApiRequest): Promise<FullResponse> | null {
    return null;
  }
  patchHandler(req: NextApiRequest): Promise<FullResponse> | null {
    return null;
  }
  headHandler(req: NextApiRequest): Promise<FullResponse> | null {
    return null;
  }

  execute(req: NextApiRequest) {
    switch (req.method) {
      case "POST":
        return this.postHandler(req);
      case "PUT":
        return this.putHandler(req);
      case "GET":
        return this.getHandler(req);
      case "DELETE":
        return this.deleteHandler(req);
      case "PATCH":
        return this.patchHandler(req);
      case "HEAD":
        return this.headHandler(req);
    }
    return null;
  }
}
