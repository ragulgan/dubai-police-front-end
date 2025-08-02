import { render, screen } from "@testing-library/react";
import Footer from "@/components/footer"; 

describe("Footer", () => {
  it("renders footer text with current year", () => {
    render(<Footer />);
   const year = new Date().getFullYear();
expect(
  screen.getByText(`© Copyright ${year} iSportz, Inc. All Rights Reserved.`)
).toBeInTheDocument();
  });
});
