import { describe, expect, test } from "vitest";
// @ts-expect-error .mjs 스크립트는 타입 선언이 없다
import { helmProduct, resourceArea, topWithOther } from "../scripts/tech-map.mjs";

describe("helmProduct", () => {
  test("같은 제품의 여러 차트를 한 제품으로 합친다", () => {
    expect(helmProduct("istiod")).toBe("Istio");
    expect(helmProduct("base")).toBe("Istio");
    expect(helmProduct("karpenter-crd")).toBe("Karpenter");
  });

  test("매핑에 없는 차트는 이름을 노출하지 않고 기타로 둔다", () => {
    expect(helmProduct("some-customer-private-chart")).toBe("기타");
  });
});

describe("resourceArea", () => {
  test("aws 서비스 접두사와 다른 provider를 영역으로 분류한다", () => {
    expect(resourceArea("aws_iam_role")).toBe("IAM");
    expect(resourceArea("aws_security_group_rule")).toBe("네트워크(VPC)");
    expect(resourceArea("kubectl_manifest")).toBe("Kubernetes");
    expect(resourceArea("helm_release")).toBe("Helm");
    expect(resourceArea("aws_unknownsvc_x")).toBe("기타");
    expect(resourceArea("random_password")).toBe("기타");
  });
});

describe("topWithOther", () => {
  test("상위 N개 뒤의 나머지를 기타로 합산한다", () => {
    const counts = new Map([["A", 5], ["B", 3], ["C", 2], ["D", 1], ["기타", 4]]);
    expect(topWithOther(counts, 2)).toEqual([
      { name: "A", count: 5 },
      { name: "B", count: 3 },
      { name: "기타", count: 7 },
    ]);
  });

  test("나머지가 없으면 기타를 만들지 않는다", () => {
    expect(topWithOther(new Map([["A", 2]]), 5)).toEqual([{ name: "A", count: 2 }]);
  });
});
