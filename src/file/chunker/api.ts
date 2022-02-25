/**
 * Chunker API can be used to slice up the file content according
 * to specific logic. It is designed with following properties in mind:
 * 
 * 1. **Stateless** - Chunker does not retain any state across the calls. This
 *    implies that calling `cut` function on the same bytes would produce same
 *    array of sizes. Do note however, that when chunker is used to chunk stream
 *    of data it will be **callers responsibility** to carry remaining bytes in
 *    subsequent calls.
 *
 * 2. **No side effects** - Chunker does not read from the underlying source and
 *    MUST not mutate given buffer nor any other outside references (including
 *    passed arguments). If your chunker is unable to operate optimally without
 *    interal state changes consider using `StatefulChunker` instead.
 *
 * 3. **Does not manage resources** - Chunker does not manage any resources,
 *   all the data is passed in and managed by the caller, which allows it to
 *    control amount of momory to be used.
 */
export interface ChunkerAPI<T> {
  /**
   * Context used by the chunker. It usually represents chunker
   * configuration like max, min chunk size etc. Usually chunker implementation
   * library will provide utility function to initalize a context.
   */
  readonly context: T
  /**
   * Chunker takes a `context:T` object, `buffer` containing bytes to be
   * chunked. Chunker is expected to return array of chunk byte lengths (from
   * the start of the buffer). If returned array is empty that signifies that
   * buffer contains no valid chunks.
   *
   * **Note:** Consumer of the chunker is responsible for dealing with remaining
   * bytes in the buffer when end of the stream is reached.
   */
  cut(context:T, buffer:Uint8Array):number[]
}

/**
 * Stateful chunker is just like regular `Chunker` execpt it also carries
 * **mutable** `state` that it is free to update as needed. It is adviced to use regural
 * `Chunker` and only resort to this when chunking logic may depend on
 * previously seen bytes.
 */
export interface StatefulChunker<T> extends ChunkerAPI<T> {
  type: 'Stateful'
}

export interface StatelessChunker<T extends Readonly<unknown>> extends ChunkerAPI<T> {
  type: 'Stateless'
}

export type Chunker<T=any> =
  | StatefulChunker<T>
  | StatelessChunker<T>