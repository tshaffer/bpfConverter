export enum BpfConverterErrorType {
  unexpectedError,
  errorFetchingBsnFeeds,
  errorFetchingBsnFeedProperties,
  errorUpdatingAssetCollection,
  errorEnumMatchError,
  errorUnsupportedBpf,
  errorNotAValidBpf,
}

const bpfConverterErrorMessage: {[type: number]: string} = {
  [BpfConverterErrorType.errorNotAValidBpf]: 'Not a valid bpf file',
  [BpfConverterErrorType.errorUnsupportedBpf]: 'Bpf version unsupported',
  [BpfConverterErrorType.unexpectedError]: 'Unexpected error',
  [BpfConverterErrorType.errorFetchingBsnFeeds]: 'Error fetching bsn feeds',
  [BpfConverterErrorType.errorUpdatingAssetCollection]: 'Error updating asset collection',
};

export class BpfConverterError extends Error {
  name = 'BpfConverterError';
  type: BpfConverterErrorType;

  constructor(type: BpfConverterErrorType, reason?: string) {
    super();
    this.type = type;
    if (reason) {
      this.message = bpfConverterErrorMessage[type] + ': ' + reason;
    } else {
      this.message = bpfConverterErrorMessage[type];
    }
    Object.setPrototypeOf(this, BpfConverterError.prototype);
  }
}
