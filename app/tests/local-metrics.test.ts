import { describe, expect, test } from "vitest";
// @ts-expect-error .mjs 스크립트는 타입 선언이 없다
import { countClusters, parseConf } from "../scripts/local-metrics.mjs";

const cluster = (name: string, server: string) => ({ name, cluster: { server } });
const ctx = (name: string, clusterName: string) => ({ name, context: { cluster: clusterName } });

describe("countClusters", () => {
  test("같은 서버를 가리키는 context는 한 번만 센다", () => {
    const kube = {
      clusters: [cluster("a", "https://a.eks.amazonaws.com")],
      contexts: [ctx("a-ctx", "a"), ctx("arn:alias", "a")],
    };
    expect(countClusters(kube)).toBe(1);
  });

  test("poc·kind·로컬 클러스터는 제외한다", () => {
    const kube = {
      clusters: [
        cluster("a", "https://a.eks.amazonaws.com"),
        cluster("p", "https://p.eks.amazonaws.com"),
        cluster("k", "https://127.0.0.1:6443"),
      ],
      contexts: [ctx("a-prod", "a"), ctx("eks-poc", "p"), ctx("kind-test", "k")],
    };
    expect(countClusters(kube)).toBe(1);
  });

  test("context가 없는 빈 설정은 0이다", () => {
    expect(countClusters({})).toBe(0);
  });
});

describe("parseConf", () => {
  test("주석·빈 줄을 건너뛰고 첫 '='로만 분리한다", () => {
    expect(parseConf("# c\n\nA=b=c\nD = e ")).toEqual({ A: "b=c", D: "e" });
  });
});
