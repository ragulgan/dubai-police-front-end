import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ModuleSearchInput component", () => {
  const setSearchText = jest.fn();
  const setPage = jest.fn();
  const setRowsPerPage = jest.fn();
  it("render with correct value and placeholder", () => {
    render(
      <ModuleSearchInput
        searchText="test"
        setSearchText={setSearchText}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        placeholder="Search here"
        flexGrow={{ flexGrow: 1 }}
      />
    );
    const input = screen.getByPlaceholderText("Search here");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("test");
  });
  it("calls setSearchText, setPage, and setRowsPerPage on input change", () => {
    render(
      <ModuleSearchInput
        searchText="test"
        setSearchText={setSearchText}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        placeholder="Search here"
        flexGrow={{ flexGrow: 1 }}
      />
    );
    const input = screen.getByPlaceholderText("Search here");
    fireEvent.change(input, { target: { value: "new value" } });

    expect(setSearchText).toHaveBeenCalledWith("new value");
    expect(setPage).toHaveBeenCalledWith(1);
    expect(setRowsPerPage).toHaveBeenCalledWith(10);
  });
  it("calls only setPage when setRowsPerPage is undefined", () => {
    const setSearchText = jest.fn();
    const setPage = jest.fn();

    render(
      <ModuleSearchInput
        searchText=""
        setSearchText={setSearchText}
        setPage={setPage}
        placeholder="Search..."
        flexGrow={{ flexGrow: 1 }}
      />
    );

    const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "abc" } });

    expect(setSearchText).toHaveBeenCalledWith("abc");
    expect(setPage).toHaveBeenCalledWith(1);
  });
   it("calls only setRowsPerPage when setPage is undefined", () => {
    // const setSearchText = jest.fn();
    // const setPage = jest.fn();

    render(
      <ModuleSearchInput
        searchText=""
        setSearchText={setSearchText}
        setRowsPerPage={setRowsPerPage}
        placeholder="Search..."
        flexGrow={{ flexGrow: 1 }}
      />
    );

    const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "abc" } });

    expect(setSearchText).toHaveBeenCalledWith("abc");
    expect(setRowsPerPage).toHaveBeenCalledWith(10);
  });
});
