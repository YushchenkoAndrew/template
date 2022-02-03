import { basePath } from "../../config";
import { ApiError, ApiRes, ProjectData } from "../../types/api";

export function loadProjectsThumbnail(page: number) {
  return new Promise<ProjectData[]>((resolve, reject) => {
    fetch(`${basePath}/api/projects/load?page=${page}&role=thumbnail`)
      .then((res) => res.json())
      .then((data: ApiRes<ProjectData[]> | ApiError) => {
        if (data.status === "ERR" || !data.result.length) return reject();
        resolve(data.result);
      })
      .catch((err) => reject());
  });
}
