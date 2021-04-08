export function mapToObj<V>(inputMap: Map<string, V>): unknown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj = {} as any;

  inputMap.forEach(function (value, key: string) {
    obj[key] = value;
  });

  return obj;
}
