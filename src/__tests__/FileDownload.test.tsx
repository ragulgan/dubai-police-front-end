import FileDownload from '@/components/FileDownload ';

describe('FileDownload', () => {
  const filePath = 'https://example.com/file.pdf';
  const fileName = 'file.pdf';
  let originalOpen: typeof window.open;
  let originalAlert: typeof window.alert;

  beforeAll(() => {
    originalOpen = window.open;
    originalAlert = window.alert;
  });

  afterAll(() => {
    window.open = originalOpen;
    window.alert = originalAlert;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should open a new tab with the given filePath', () => {
    // Create a mock Window object to satisfy the type requirement
    const mockWindow = {} as Window;
    const openMock = jest.fn(() => mockWindow);
    window.open = openMock;
    window.alert = jest.fn();

    const downloader = FileDownload({ filePath, fileName });
    downloader.trigger();

    expect(openMock).toHaveBeenCalledWith(filePath, '_blank');
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('should alert if popup is blocked', () => {
    window.open = jest.fn(() => null);
    const alertMock = jest.fn();
    window.alert = alertMock;

    const downloader = FileDownload({ filePath, fileName });
    downloader.trigger();

    expect(alertMock).toHaveBeenCalledWith('Popup blocked! Please allow popups for this site.');
  });
});
