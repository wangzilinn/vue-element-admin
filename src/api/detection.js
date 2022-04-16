import request from "@/utils/request";

export function Cnt() {
  return request({
    url: "/cnt",
    method: "get",
  });
}
