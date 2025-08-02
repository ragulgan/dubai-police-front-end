// FileDownload.test.ts

import FileDownload from "@/components/Forms/FileDownload ";

describe("FileDownload", () => {
  const filePath = "/dummy/path";
  const fileName = "file.txt";

  beforeEach(() => {
    global.fetch = jest.fn();
    global.URL.createObjectURL = jest.fn(() => "blob:dummy-url") as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should download file successfully", async () => {
    const blob = new Blob(["Hello"]);
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(blob),
    });

    const click = jest.fn();
    const linkMock: Partial<HTMLAnchorElement> = {
      click,
    };

    document.createElement = jest.fn(() => linkMock as HTMLAnchorElement);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();

    const { trigger } = FileDownload({ filePath, fileName });
    await trigger();

    expect(fetch).toHaveBeenCalledWith(filePath);
    expect(click).toHaveBeenCalled();
  });

  it("should show alert on error", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    (fetch as jest.Mock).mockResolvedValue({ ok: false });

    const { trigger } = FileDownload({ filePath, fileName });
    await trigger();

    expect(alertSpy).toHaveBeenCalledWith("Failed to download the file. Please try again.");
  });
});
