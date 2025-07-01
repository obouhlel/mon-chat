import { expect, test } from "bun:test";

test("Test date", () => {
  const dateString: string = "2025-06-28 20:12:34.80517+00";
  const date = new Date(dateString);

  expect(date).toBeInstanceOf(Date);
  expect(date.getTime()).not.toBeNaN();
  expect(date.getFullYear()).toBe(2025);
  expect(date.getMonth()).toBe(5);
  expect(date.getDate()).toBe(28);
  expect(date.getHours()).toBe(20);
  expect(date.getMinutes()).toBe(12);
  expect(date.getSeconds()).toBe(34);
  expect(date.getTimezoneOffset()).toBe(0);
  expect(date.toISOString()).toBe("2025-06-28T20:12:34.805Z");
});